Ext.define('FamilyDecoration.view.totalpropertymanagement.FinanceAggregation', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.totalpropertymanagement-financeaggregation',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DateFilter',
        'FamilyDecoration.store.FinanceAggregation'
    ],
    title: '财务汇总',
    autoScroll: true,

    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.FinanceAggregation', {
                autoLoad: false
            });
        
        me.store = st;

        me.dockedItems = [
            {
                xtype: 'totalpropertymanagement-datefilter'
            }
        ];

        me.columns = {
            defaults: {
                align: 'center',
                flex: 1
            },
            items: [
                {
                    text: '序号',
                    dataIndex: 'id'
                },
                {
                    text: '项目',
                    dataIndex: 'name'
                },
                {
                    text: '本年累计金额',
                    dataIndex: 'yearAccMoney'
                },
                {
                    text: '本月累计金额',
                    dataIndex: 'monthAccMoney'
                }
            ]
        };

        this.callParent();
    }
});