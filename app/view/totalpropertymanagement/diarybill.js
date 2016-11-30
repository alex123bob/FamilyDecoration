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
                        filterFunc: function (startTime, endTime, account, scale) {
                            Ext.apply(diarybillProxy.extraParams, {
                                startTime: Ext.Date.format(startTime, 'Ymd'),
                                endTime: Ext.Date.format(endTime, 'Ymd'),
                                accountId: account.getId(),
                                scale: scale
                            });
                            diarybillSt.load();
                        }
                    }
                ],
                store: diarybillSt,
                _getBtns: function () {
                    var bbar = this.getDockedItems('toolbar[dock="bottom"]')[0];
                    return {
                        bilchk: bbar.down('[name="bilchk"]'),
                        bilexp: bbar.down('[name="bilexp"]')
                    };
                },
                bbar: [
                    {
                        text: '核对',
                        name: 'bilchk',
                        icon: 'resources/img/bill_check.png',
                        handler: function () {
                            var resObj = _getRes(),
                                accountCombo = resObj.dateFilter._getRes().account,
                                account = accountCombo.findRecord('id', accountCombo.getValue()),
                                billItem = resObj.diaryBill.getSelectionModel().getSelection()[0];
                            if (billItem && billItem.get('status') == 'unchecked') {
                                Ext.Msg.warning('确定要进行核对吗?', function (btnId){
                                    if (btnId == 'yes') {
                                        ajaxUpdate('AccountLogMonthlyCheck', {
                                            status: 'checked',
                                            id: billItem.getId()
                                        }, ['id'], function (obj){
                                            if ('successful' == obj.status) {
                                                showMsg('核对成功！');
                                                resObj.diaryBill.getStore().reload();
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                showMsg('未选择条目或者已经被审核！');
                            }
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
                                // exportFrame.src = './fpdf/monthly_check_detail.php?accountId=' + me.budgetId; // startTime, endTime, accountId
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
                hidden: true,
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