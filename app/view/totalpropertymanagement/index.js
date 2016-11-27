Ext.define('FamilyDecoration.view.totalpropertymanagement.Index', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.totalpropertymanagement-index',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DiaryBill',
        'FamilyDecoration.view.totalpropertymanagement.FinanceAggregation',
        'FamilyDecoration.view.totalpropertymanagement.FinanceAnalysis'
    ],
    defaults: {
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'totalpropertymanagement-diarybill'
            },
            {
                xtype: 'totalpropertymanagement-financeanalysis'
            },
            {
                xtype: 'totalpropertymanagement-financeaggregation'
            },
            {
                title: '各类报表'
            }
        ];

        this.callParent();
    }
});