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
                xtype: 'totalpropertymanagement-datefilter',
                needScale: false,
                filterFunc: function (startTime, endTime, account, scale){
                    var st = me.getStore(),
                        proxy = st.getProxy();
                    Ext.Msg.info('数据和相关模块不齐全，需要协商，敬请期待模块开放');
                    // Ext.apply(proxy.extraParams, {
                    //     startTime: startTime,
                    //     endTime: endTime,
                    //     action: ''
                    // });
                    // st.load();
                }
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