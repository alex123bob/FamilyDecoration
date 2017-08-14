Ext.define('FamilyDecoration.view.businessaggregation.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.businessaggregation-index',
    requires: [
        'FamilyDecoration.view.businessaggregation.BusinessList'
    ],
    layout: 'fit',
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'businessaggregation-businesslist'
            }
        ]

        this.callParent();
    }
});