Ext.define('FamilyDecoration.view.businessaggregation.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.businessaggregation-index',
    requires: [
        'FamilyDecoration.store.Business'
    ],
    layout: 'fit',
    defaults: {
        xtype: 'gridpanel'
    },
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.Business');

        me.items = [
            {
                title: '业务汇总',
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '小区'
                        },
                        {
                            text: '地址'
                        },
                        {
                            text: '等级'
                        }
                    ]
                }
            }
        ]
        
        this.callParent();
    }
});