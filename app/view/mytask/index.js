Ext.define('FamilyDecoration.view.mytask.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.mytask-index',
    requires: [
        'FamilyDecoration.view.mytask.TaskTable'
    ],
    layout: 'fit',
    defaults: {
        
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'mytask-tasktable',
                filterCfg: {
                    taskExecutor: User.getName()
                },
                processEditEnabled: function (){
                    return true;
                }
            }
        ]

        this.callParent();
    }
});