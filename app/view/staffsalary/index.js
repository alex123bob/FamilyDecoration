Ext.define('FamilyDecoration.view.staffsalary.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.staffsalary-index',
    requires: [
        'FamilyDecoration.view.checklog.MemberList',
        'FamilyDecoration.view.staffsalary.DetailedSalary'
    ],
    layout: 'hbox',
    defaults: {
        height: '100%'
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                title: '成员列表',
                xtype: 'checklog-memberlist',
                width: 200,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                }
            },
            {
                xtype: 'staffsalary-detailedsalary',
                flex: 1
            }
        ];

        
        this.callParent();
    }
});