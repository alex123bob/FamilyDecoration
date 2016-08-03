Ext.define('FamilyDecoration.view.paymentrequest.PaymentListCt', {
    extend: 'Ext.container.Container',
    alias: 'widget.paymentrequest-paymentlistct',
    layout: 'vbox',
    requires: [
        'FamilyDecoration.view.paymentrequest.EditRequest',
        'FamilyDecoration.store.StatementBill'
    ],
    defaults: {
        width: '100%',
        xtype: 'gridpanel'
    },
    user: undefined,

    initComponent: function () {
        var me = this;

        me.refresh = function (user) {
            var resObj = _getRes(),
                requestProxy = resObj.requestSt.getProxy();
            me.user = user;

            if (user) {
                Ext.apply(requestProxy.extraParams, {
                    payee: user.get('name')
                });
                resObj.requestSt.setProxy(requestProxy);
                resObj.requestSt.load();
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
                        case "submit":
                        case "pass":
                            btn.setDisabled(!resObj.request);
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
                tbar: [
                    {
                        name: 'button-addRequest',
                        text: '添加',
                        disabled: true,
                        icon: 'resources/img/add_request.png',
                        handler: function () {
                            var win = Ext.create('FamilyDecoration.view.paymentrequest.EditRequest', {
                                user: me.user
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

                        }
                    },
                    {
                        name: 'button-deleteRequest',
                        text: '删除',
                        disabled: true,
                        icon: 'resources/img/delete_request.png',
                        handler: function () {

                        }
                    },
                    {
                        name: 'button-submitRequest',
                        text: '递交申请',
                        disabled: true,
                        icon: 'resources/img/submit_request.png',
                        handler: function () {

                        }
                    },
                    {
                        name: 'button-passRequest',
                        text: '审核通过',
                        disabled: true,
                        icon: 'resources/img/pass_request.png',
                        handler: function () {

                        }
                    }
                ],
                store: Ext.create('FamilyDecoration.store.StatementBill', {
                    autoLoad: false
                }),
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
                            dataIndex: 'createTime'
                        },
                        {
                            text: '提交状态',
                            dataIndex: 'status'
                        },
                        {
                            text: '申请属性',
                            dataIndex: 'billType'
                        },
                        {
                            text: '备注',
                            dataIndex: 'descpt'
                        },
                        {
                            text: '附件',
                            dataIndex: 'certs'
                        }
                    ]
                }
            },
            {
                title: '往年记录',
                flex: 2,
                name: 'gridpanel-historyRecords',
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