Ext.define('FamilyDecoration.view.totalpropertymanagement.DiaryBill', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.totalpropertymanagement-diarybill',
    requires: [
        'FamilyDecoration.view.billaudit.DateFilter'
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
                xtype: 'gridpanel',
                dockedItems: [
                    {
                        xtype: 'billaudit-datefilter',
                        needBillNumber: false,
                        needCustomTxt: false
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
            }
        ];

        this.callParent();
    }
});