Ext.define('FamilyDecoration.view.qualityguaranteedepositmgm.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.qualityguaranteedepositmgm-index',
    requires: [
        'FamilyDecoration.store.User',
        'FamilyDecoration.view.qualityguaranteedepositmgm.ModifyQgd',
        'FamilyDecoration.store.StatementBill',
        'FamilyDecoration.view.manuallycheckbill.CheckBillList'
    ],
    layout: 'hbox',
    defaultType: 'gridpanel',
    defaults: {
        height: '100%',
        autoScroll: true
    },

    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.StatementBill', {
                autoLoad: false
            });
        function _getRes() {
            var captainList = me.getComponent('gridpanel-projectCaptainList'),
                captainSelModel = captainList.getSelectionModel(),
                captainSt = captainList.getStore(),
                captain = captainSelModel.getSelection()[0],

                qgdList = me.getComponent('gridpanel-qgdList'),
                qgdSelModel = qgdList.getSelectionModel(),
                qgdSt = qgdList.getStore(),
                qgd = qgdSelModel.getSelection()[0];

            return {
                captainList: captainList,
                captainSelModel: captainSelModel,
                captainSt: captainSt,
                captain: captain,
                qgdList: qgdList,
                qgdSelModel: qgdSelModel,
                qgdSt: qgdSt,
                qgd: qgd
            };
        }

        me.items = [
            {
                flex: 1,
                title: '项目经理',
                hideHeaders: true,
                itemId: 'gridpanel-projectCaptainList',
                style: {
                    borderRightWidth: '1px',
                    borderRightStyle: 'solid'
                },
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '姓名',
                            dataIndex: 'realname'
                        }
                    ]
                },
                store: Ext.create('FamilyDecoration.store.User', {
                    autoLoad: true,
                    filters: [
                        function (rec) {
                            var level = rec.get('level');
                            return /^003-\d{3}$/gi.test(level);
                        }
                    ]
                }),
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var rec = sels[0],
                            resObj = _getRes();
                        resObj.qgdList.initBtn();
                        resObj.qgdList.refresh();
                    }
                }
            },
            {
                flex: 9,
                title: '质保金列表',
                itemId: 'gridpanel-qgdList',
                cls: 'gridpanel-qgdList',
                _getBtns: function () {
                    return {
                        apply: this.down('[name="button-applyQgd"]'),
                        modify: this.down('[name="button-modifyQgd"]'),
                        //flat: this.down('[name="button-flatQgd"]'),
                        pass: this.down('[name="button-passQgd"]')
                    }
                },
                initBtn: function () {
                    var resObj = _getRes(),
                        btnObj = this._getBtns();
                    btnObj.apply.setDisabled(!(resObj.qgd && resObj.qgd.data.status == "new" && resObj.qgd.data.id != null && resObj.qgd.data.id != "" )); //有id了说明已经实例化了，可以申付
                    btnObj.modify.setDisabled(!(resObj.qgd && (resObj.qgd.data.status === 'new' || resObj.qgd.data.status == '' || resObj.qgd.data.status == null))); //只有新创建或者未实例化的才能修改
                    btnObj.pass.setDisabled(!(resObj.qgd && (resObj.qgd.data.status === 'rdyck'))); //只有提交了审核的才能审核
                    btnObj.modify.setText(resObj.qgd && resObj.qgd.data.id ? '调整质保金':'创建质保金');
                },
                refresh: function () {
                    var resObj = _getRes();
                    if (resObj.captain) {
                        resObj.qgdSt.setProxy({
                            type: 'rest',
                            reader: {
                                type: 'json',
                                root: 'data',
                                totalProperty: 'total'
                            },
                            url: './libs/api.php',
                            extraParams: {
                                action: 'StatementBill.qualityGuaranteeDeposit',
                                captainName: resObj.captain.get('name')
                            }
                        });
                        resObj.qgdSt.loadPage(1, {
                            callback: function (recs, ope, success){
                                if (success) {
                                    if (resObj.qgd) {
                                        var index = resObj.qgdSt.indexOf(resObj.qgd);
                                    }
                                    resObj.qgdSelModel.deselectAll();
                                    resObj.qgdSelModel.select(index);
                                }
                            }
                        });
                    }
                    else {
                        resObj.qgdSt.removeAll();
                    }
                },
                store: st,
                tbar: [
                    {
                        xtype: 'button',
                        name: 'button-applyQgd',
                        text: '申付质保金',
                        icon: 'resources/img/up.png',
                        disabled: true,
                        handler: function () {
                            var resObj = _getRes();
                            Ext.Msg.warning('递交后不可再进行修改单据，确定要递交单据吗？', function (btnId) {
                                if ('yes' !== btnId) {
                                    return;
                                }
                                ajaxUpdate('StatementBill.changeStatus', {
                                    id: resObj.qgd.data.id,
                                    status: '+1'
                                }, ['id'], function (obj) {
                                    Ext.Msg.success('递交成功！');
                                    resObj.qgdList.refresh();
                                }, true);
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        text: '调整质保金',
                        name: 'button-modifyQgd',
                        icon: 'resources/img/modify1.png',
                        disabled: true,
                        handler: function () {
                            var resObj = _getRes();
                            var win = Ext.create('FamilyDecoration.view.qualityguaranteedepositmgm.ModifyQgd', {
                                qgd: resObj.qgd,
                                callback: function () {
                                    resObj.qgdList.refresh();
                                }
                            });
                            win.show();
                        }
                    },
                    /*{
                        xtype: 'button',
                        name: 'button-flatQgd',
                        text: '抹平质保金',
                        disabled: true,
                        icon: 'resources/img/balance.png'
                    },*/
                    {
                        xtype: 'button',
                        name: 'button-passQgd',
                        text: '审核通过',
                        disabled: true,
                        icon: 'resources/img/check.png',
                        handler: function (){
                            var resObj = _getRes();
                            Ext.Msg.warning('确定将当前质保金置为审核通过吗？', function (btnId) {
                                if ('yes' !== btnId) {
                                    return;
                                }
                                ajaxUpdate('StatementBill.changeStatus', {
                                    id: resObj.qgd.data.id,
                                    status: '+1'
                                }, ['id'], function (obj) {
                                    Ext.Msg.success('审核通过！');
                                    resObj.qgdList.refresh();
                                }, true);
                            });
                        }
                    }
                ],
                bbar: [
                    {
                        xtype: 'pagingtoolbar',
                        store: st,   // same store GridPanel is using
                        displayInfo: true
                    }
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'left'
                    },
                    items: [
                        {
                            text: '单据号',
                            flex: 0.7,
                            dataIndex: 'id'
                        },
                        {
                            text: '领款人',
                            flex: 0.7,
                            dataIndex: 'payee'
                        },
                        {
                            text: '工种',
                            flex: 0.7,
                            dataIndex: 'professionTypeName'
                        },
                        {
                            text: '工程地址',
                            flex: 0.9,
                            dataIndex: 'projectName'
                        },
                        {
                            text: '联系电话',
                            flex: 0.9,
                            dataIndex: 'phoneNumber'
                        },
                        {
                            xtype: 'actioncolumn',
                            text: '单据',
                            flex: 0.2,
                            items: [
                                {
                                    icon: 'resources/img/balance.png',
                                    tooltip: '点击查看单据',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        var win = window.open('./fpdf/statement_bill.php?id=' + rec.get('refId'), '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                    }
                                }
                            ]
                        },
                        {
                            text: '总金额(元)',
                            align: 'right',
                            flex: 1.1,
                            dataIndex: 'total'
                        },
                        {
                            text: '已付(元)',
                            flex: 0.9,
                            align: 'right',
                            dataIndex: 'paid'
                        },
                        {
                            text: '质保金(元)',
                            align: 'right',
                            flex: 1.1,
                            dataIndex: 'qgd'
                        },
                        {
                            text: '调整后(元)',
                            flex: 1.1,
                            align: 'right',
                            dataIndex: 'totalFee',
                            renderer: function (val, meta, rec) {
                                if (val == 0)
                                    return rec.data.qgd;
                                if (val == rec.data.qgd)
                                    return val;
                                var diff = (val - rec.data.qgd);
                                return val + "(" + (diff > 0 ? '+' : '') + diff + ")";
                            }
                        },
                        {
                            text: '质保金期限',
                            dataIndex: 'deadline'
                        },
                        {
                            text: '状态',
                            flex: 0.5,
                            dataIndex: 'statusName'
                        }
                    ]
                },
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var resObj = _getRes();
                        resObj.qgdList.initBtn();
                    }
                }
            }
        ];

        this.callParent();
    }
});