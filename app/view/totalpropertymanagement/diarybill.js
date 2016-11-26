Ext.define('FamilyDecoration.view.totalpropertymanagement.DiaryBill', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.totalpropertymanagement-diarybill',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DateFilter'
    ],
    layout: 'vbox',
    defaults: {
        width: '100%'
    },
    title: '日记账',

    initComponent: function () {
        var me = this;

        me.items = [
            {
                flex: 7,
                xtype: 'gridpanel',
                dockedItems: [
                    {
                        xtype: 'totalpropertymanagement-datefilter'
                    }
                ],
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
                flex: 1,
                xtype: 'panel',
                title: '年度核对'
            }
        ];

        this.callParent();
    }
});