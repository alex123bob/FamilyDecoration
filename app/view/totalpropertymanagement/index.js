Ext.define('FamilyDecoration.view.totalpropertymanagement.Index', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.totalpropertymanagement-index',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DiaryBill'
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
                title: '财务分析'
            },
            {
                title: '财物汇总'
            },
            {
                title: '各类报表'
            }
        ];

        this.callParent();
    }
});