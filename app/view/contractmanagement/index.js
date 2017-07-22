Ext.define('FamilyDecoration.view.contractmanagement.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.contractmanagement-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain'
    ],
    layout: 'hbox',
    defaults: {
        height: '100%',
        flex: 1
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                hideHeaders: true,
                title: '合同种类',
                xtype: 'gridpanel',
                style: {
                    borderRight: '1px solid #cccccc'
                },
                columns: [
                    {
                        text: '合同种类'
                    }
                ]
            },
            {
                searchFilter: true,
                xtype: 'progress-projectlistbycaptain',
                title: '合同列表',
                style: {
                    borderRight: '1px solid #cccccc'
                }
            },
            {
                xtype: 'panel',
                title: '合同详情',
                flex: 4
            }
        ]
        
        this.callParent();
    }
});