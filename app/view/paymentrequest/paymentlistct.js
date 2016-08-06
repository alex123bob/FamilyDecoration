Ext.define('FamilyDecoration.view.paymentrequest.PaymentListCt', {
    extend: 'Ext.container.Container',
    alias: 'widget.paymentrequest-paymentlistct',
    layout: 'vbox',
    requires: [
        'FamilyDecoration.view.paymentrequest.EditRequest',
        'FamilyDecoration.store.StatementBill',
        'FamilyDecoration.view.paymentrequest.AttachmentManagement'
    ],
    defaults: {
        width: '100%',
        xtype: 'gridpanel'
    },
    user: undefined,

    initComponent: function () {
        var me = this,
            requestSt = Ext.create('FamilyDecoration.store.StatementBill', {
                autoLoad: false
            });

        me.refresh = function (user) {
            var resObj = _getRes(),
                requestProxy = resObj.requestSt.getProxy();
            me.user = user;

            if (user) {
                Ext.apply(requestProxy.extraParams, {
                    payee: user.get('name')
                });
                resObj.requestSt.setProxy(requestProxy);
                resObj.requestSt.loadPage(1);
            }
            else {
                resObj.requestSt.removeAll();
            }
        }

        function _getBtns() {
            return {
                add: me.down('[name="button-addRequest"]'),
                edit: me.down('[name="button-editRequest"]'),
                del: me.down('[name="button-deleteRequest"]'),
                submit: me.down('[name="button-submitRequest"]'),
                pass: me.down('[name="button-passRequest"]')
            };
        }

        function _getRes() {
            var requestGrid = me.down('[name="gridpanel-requestGrid"]'),
                requestSelModel = requestGrid.getSelectionModel(),
                request = requestSelModel.getSelection()[0],
                requestSt = requestGrid.getStore(),
                historyGrid = me.down('[name="gridpanel-historyRecords"]'),
                historySelModel = historyGrid.getSelectionModel(),
                historyRec = historySelModel.getSelection()[0];
            return {
                requestGrid: requestGrid,
                requestSelModel: requestSelModel,
                requestSt: requestSt,
                request: request,
                historyGrid: historyGrid,
                historySelModel: historySelModel,
                historyRec: historyRec
            }
        }

        me.initBtn = function (user) {
            var btnObj = _getBtns(),
                resObj = _getRes();
            for (var key in btnObj) {
                if (btnObj.hasOwnProperty(key)) {
                    var btn = btnObj[key];
                    switch (key) {
                        case "add":
                            btn.setDisabled(!user);
                            break;
                        case "edit":
                        case "del":
                            btn.setDisabled(!resObj.request || resObj.request.get('status') != 'new');
                            break;
                        case "submit":
                            btn.setDisabled(!resObj.request || resObj.request.get('status') != 'new');
                            break;
                        case "pass":
                            btn.setDisabled(!resObj.request || resObj.request.get('status') == 'new' || resObj.request.get('status') == 'chk' || resObj.request.get('status') == 'paid');
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        me.items = [
            {
                title: '&nbsp;',
                flex: 3,
                name: 'gridpanel-requestGrid',
                cls: 'gridpanel-requestGrid',
                tbar: [
                    {
                        name: 'button-addRequest',
                        text: '添加',
                        disabled: true,
                        icon: 'resources/img/add_request.png',
                        handler: function () {
                            var win = Ext.create('FamilyDecoration.view.paymentrequest.EditRequest', {
                                user: me.user,
                                callback: function () {
                                    var resObj = _getRes();
                                    resObj.requestSt.reload();
                                }
                            });
                            win.show();
                        }
                    },
                    {
                        name: 'button-editRequest',
                        text: '编辑',
                        disabled: true,
                        icon: 'resources/img/edit_request.png',
                        handler: function () {
                            var resObj = _getRes();
                            if (resObj.request) {
                                var win = Ext.create('FamilyDecoration.view.paymentrequest.EditRequest', {
                                    user: me.user,
                                    request: resObj.request,
                                    callback: function () {
                                        resObj.requestSt.reload({
                                            callback: function (recs, ope, success) {
                                                if (success) {
                                                    var index = resObj.requestSt.indexOf(resObj.request);
                                                    resObj.requestSelModel.deselectAll();
                                                    resObj.requestSelModel.select(index);
                                                }
                                            }
                                        });
                                    }
                                });
                                win.show();
                            }
                        }
                    },
                    {
                        name: 'button-deleteRequest',
                        text: '删除',
                        disabled: true,
                        icon: 'resources/img/delete_request.png',
                        handler: function () {
                            var resObj = _getRes();
                            if (resObj.request) {
                                Ext.Msg.warning('确定要删除当前请求吗？', function (btnId) {
                                    if ('yes' == btnId) {
                                        ajaxDel('StatementBill', {
                                            id: resObj.request.getId()
                                        }, function (obj) {
                                            showMsg('删除成功！');
                                            resObj.requestSt.loadPage(1);
                                        });
                                    }
                                });
                            }
                            else {
                                showMsg('请选择请求！');
                            }
                        }
                    },
                    {
                        name: 'button-submitRequest',
                        text: '递交申请',
                        disabled: true,
                        icon: 'resources/img/submit_request.png',
                        handler: function () {
                            this.nextSibling().changeStatus('确定要将当前申请进行递交吗？', '递交成功！');
                        }
                    },
                    {
                        name: 'button-passRequest',
                        text: '审核通过',
                        disabled: true,
                        hidden: !User.isAdmin(),
                        icon: 'resources/img/pass_request.png',
                        changeStatus: function (cfmMsg, successMsg) {
                            var resObj = _getRes();
                            if (resObj.request) {
                                function request(validateCode) {
                                    var params = {
                                        id: resObj.request.getId(),
                                        status: '+1'
                                    }, arr = ['id'],
                                        index = resObj.requestSt.indexOf(resObj.request);
                                    if (validateCode) {
                                        Ext.apply(params, {
                                            validateCode: validateCode
                                        });
                                        arr.push('validateCode');
                                    }
                                    ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
                                        Ext.Msg.success(successMsg);
                                        resObj.requestSelModel.deselectAll();
                                        resObj.requestSt.reload({
                                            callback: function (recs, ope, success) {
                                                if (success) {
                                                    resObj.requestSelModel.select(index);
                                                }
                                            }
                                        })
                                    }, true);
                                }
                                Ext.Msg.warning(cfmMsg, function (btnId) {
                                    if ('yes' == btnId) {
                                        ajaxGet('StatementBill', 'getLimit', {
                                            id: resObj.request.getId()
                                        }, function (obj) {
                                            if (obj.type == 'checked') {
                                                showMsg(obj.hint);
                                                request();
                                            }
                                            else {
                                                Ext.defer(function () {
                                                    Ext.Msg.password(obj.hint, function (val) {
                                                        if (obj.type == 'sms') {
                                                        }
                                                        else if (obj.type == 'securePass') {
                                                            val = md5(_PWDPREFIX + val);
                                                        }
                                                        request(val);
                                                    });
                                                }, 500);
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                showMsg('请选择申请！');
                            }
                        },
                        handler: function () {
                            this.changeStatus('确定要将当前申请置为本级通过吗？', '审核通过！');
                        }
                    }
                ],
                bbar: [
                    {
                        xtype: 'pagingtoolbar',
                        displayInfo: true,
                        store: requestSt
                    }
                ],
                store: requestSt,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '项目名称',
                            dataIndex: 'projectName'
                        },
                        {
                            text: '归属项目',
                            dataIndex: 'reimbursementReason'
                        },
                        {
                            text: '申请金额',
                            dataIndex: 'claimAmount'
                        },
                        {
                            text: '申请日期',
                            dataIndex: 'createTime',
                            renderer: function (val, meta, rec){
                                val = val ? val.slice(0, 10) : '';
                                return val;
                            }
                        },
                        {
                            text: '提交状态',
                            dataIndex: 'statusName'
                        },
                        {
                            text: '申请属性',
                            dataIndex: 'billTypeName'
                        },
                        {
                            text: '备注',
                            dataIndex: 'descpt'
                        },
                        {
                            text: '附件',
                            xtype: 'actioncolumn',
                            width: 50,
                            items: [
                                {
                                    tooltip: '查看编辑附件',
                                    icon: 'resources/img/attachment.png',
                                    handler: function (grid, rowIndex, colIndex){
                                        var rec = grid.getStore().getAt(rowIndex),
                                            win = Ext.create('FamilyDecoration.view.paymentrequest.AttachmentManagement', {
                                                infoObj: {
                                                    refType: 'statement_bill',
                                                    refId: rec.getId()
                                                }
                                            });
                                        win.show();
                                    }
                                }
                            ]
                        }
                    ]
                },
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        me.initBtn(me.user);
                    }
                }
            },
            {
                title: '往年记录',
                flex: 2,
                name: 'gridpanel-historyRecords',
                cls: 'gridpanel-historyGrid',
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '年份'
                        },
                        {
                            text: '笔数'
                        },
                        {
                            text: '总额'
                        }
                    ]
                }
            }
        ];

        me.callParent();
    }
});