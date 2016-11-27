Ext.define('FamilyDecoration.view.totalpropertymanagement.AnalysisTable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.totalpropertymanagement-analysistable',
    requires: [
        
    ],
    hideHeaders: true,
    initComponent: function () {
        var me = this,
            st = Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                autoLoad: false,
                proxy: {
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'data'
                    },
                    extraParams: {
                        action: ''
                    }
                }
            });

        me.store = st;

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    text: '项目',
                    dataIndex: 'name'
                },
                {
                    text: '内容',
                    dataIndex: 'value'
                }
            ]
        };
        
        this.callParent();
    }
});