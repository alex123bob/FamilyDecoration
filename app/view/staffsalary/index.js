Ext.define('FamilyDecoration.view.staffsalary.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.staffsalary-index',
    requires: [
        'FamilyDecoration.view.staffsalary.DetailedSalary',
        'FamilyDecoration.view.staffsalary.DepaList'
    ],
    layout: 'hbox',
    defaults: {
        height: '100%'
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                title: '部门',
                xtype: 'staffsalary-depalist',
                width: 200,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                hideHeaders: true
            },
            {
                xtype: 'staffsalary-detailedsalary',
                flex: 1
            }
        ];

        
        this.callParent();
    }
});