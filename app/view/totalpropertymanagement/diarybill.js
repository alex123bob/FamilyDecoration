Ext.define('FamilyDecoration.view.totalpropertymanagement.DiaryBill', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.totalpropertymanagement-diarybill',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DateFilter',
        'FamilyDecoration.store.DiaryBill'
    ],
    layout: 'vbox',
    defaults: {
        width: '100%'
    },
    title: '日记账',

    initComponent: function () {
        var me = this,
            diarybillSt = Ext.create('FamilyDecoration.store.DiaryBill', {
                autoLoad: false
            }),
            diarybillProxy = diarybillSt.getProxy();


        me.items = [
            {
                flex: 1,
                xtype: 'gridpanel',
                dockedItems: [
                    {
                        xtype: 'totalpropertymanagement-datefilter',
                        needBankAccount: true,
                        filterFunc: function (startTime, endTime, account){
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
                _getBtns: function (){
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
                        handler: function (){

                        }
                    },
                    {
                        text: '核对',
                        name: 'bilchk',
                        icon: 'resources/img/bill_check.png',
                        handler: function () {

                        }
                    },
                    {
                        text: '导出报表',
                        name: 'bilexp',
                        icon: 'resources/img/bill_export.png',
                        handler: function (){

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
                            text: '月份'
                        },
                        {
                            text: '月出账'
                        },
                        {
                            text: '月入账'
                        },
                        {
                            text: '账户余额'
                        },
                        {
                            text: '明细'
                        },
                        {
                            text: '核对人'
                        }
                    ]
                }
            },
            {
                height: 74,
                xtype: 'gridpanel',
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