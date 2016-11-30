Ext.define('FamilyDecoration.view.totalpropertymanagement.DiaryBill', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.totalpropertymanagement-diarybill',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DateFilter',
        'FamilyDecoration.store.DiaryBill',
        'FamilyDecoration.view.totalpropertymanagement.MonthlyBillDetail'
    ],
    layout: 'vbox',
    defaults: {
        width: '100%'
    },
    title: '日记账',
    html: '<iframe id="exportDiaryBill"  src="javascript:void(0);" style="display:none"></iframe>',

    initComponent: function () {
        var me = this,
            diarybillSt = Ext.create('FamilyDecoration.store.DiaryBill', {
                autoLoad: false
            }),
            diarybillProxy = diarybillSt.getProxy();

        var _getRes = function () {
            var diaryBill = me.getComponent('gridpanel-diaryBill'),
                dateFilter = diaryBill.getDockedItems('toolbar[dock="top"]')[0];
            return {
                diaryBill: diaryBill,
                dateFilter: dateFilter,
                yearlyCheck: me.getComponent('gridpanel-yearlyCheck')
            };
        }


        me.items = [
            {
                flex: 1,
                xtype: 'gridpanel',
                itemId: 'gridpanel-diaryBill',
                dockedItems: [
                    {
                        xtype: 'totalpropertymanagement-datefilter',
                        dock: 'top',
                        needBankAccount: true,
                        filterFunc: function (startTime, endTime, account) {
                            Ext.apply(diarybillProxy.extraParams, {
                                startTime: Ext.Date.format(startTime, 'Y-m'),
                                endTime: Ext.Date.format(endTime, 'Y-m'),
                                accountId: account.getId()
                            });
                            diarybillSt.load();
                        }
                    }
                ],
                store: diarybillSt,
                _getBtns: function () {
                    var bbar = this.getDockedItems('toolbar[dock="bottom"]')[0];
                    return {
                        bilret: bbar.down('[name="bilret"]'),
                        bilchk: bbar.down('[name="bilchk"]'),
                        bilexp: bbar.down('[name="bilexp"]')
                    };
                },
                bbar: [
                    {
                        text: '退回单据',
                        name: 'bilret',
                        icon: 'resources/img/bill_return.png',
                        handler: function () {

                        }
                    },
                    {
                        text: '核对',
                        name: 'bilchk',
                        icon: 'resources/img/bill_check.png',
                        handler: function () {
                            var resObj = _getRes(),
                                accountCombo = resObj.dateFilter._getRes().account,
                                account = accountCombo.findRecord('id', accountCombo.getValue());
                            ajaxGet('AccountLogMonthlyCheck', 'getYearInfo', {
                                accountId: account.getId()
                            }, function (obj) {
                                if ('successful' == obj.status) {
                                    Ext.Msg.show({
                                        title: '核对',
                                        msg: '该账户本年度出账***，入账***，余额***，请核对',
                                        width: 300,
                                        buttons: Ext.Msg.OKCANCEL,
                                        // multiline: true,
                                        fn: function (btnId, txt, opt) {
                                            console.log(btnId);
                                        },
                                        icon: Ext.window.MessageBox.INFO
                                    });
                                }
                            });
                        }
                    },
                    {
                        text: '导出报表',
                        name: 'bilexp',
                        icon: 'resources/img/bill_export.png',
                        handler: function () {
                            var resObj = _getRes();
                            if (resObj.dateFilter.isFiltered()) {
                                var exportFrame = document.getElementById('exportDiaryBill');
                                // exportFrame.src = './fpdf/index2.php?budgetId=' + me.budgetId;
                            }
                            else {
                                showMsg('请先进行筛选！');
                            }
                        }
                    }
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '月份',
                            dataIndex: 'checkMonth'
                        },
                        {
                            text: '月出账',
                            dataIndex: 'outcome'
                        },
                        {
                            text: '月入账',
                            dataIndex: 'income'
                        },
                        {
                            text: '账户余额',
                            dataIndex: 'balance'
                        },
                        {
                            xtype: 'actioncolumn',
                            text: '查看明细',
                            items: [
                                {
                                    icon: './resources/img/detail.png',
                                    tooltip: '查看明细',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex),
                                            win = Ext.create('FamilyDecoration.view.totalpropertymanagement.MonthlyBillDetail', {
                                                account: rec
                                            });
                                        win.show();
                                    }
                                }
                            ]
                        },
                        {
                            text: '核对人',
                            dataIndex: 'checker'
                        }
                    ]
                }
            },
            {
                height: 74,
                xtype: 'gridpanel',
                itemId: 'gridpanel-yearlyCheck',
                header: {
                    title: '年度核对',
                    padding: 2
                },
                columns: {
                    defaults: {
                        align: 'center',
                        flex: 1
                    },
                    items: [
                        {
                            text: '日、月、年度进账'
                        },
                        {
                            text: '日、月、年度出账'
                        },
                        {
                            text: '日、月、年度余额'
                        }
                    ]
                }
            }
        ];

        this.callParent();
    }
});