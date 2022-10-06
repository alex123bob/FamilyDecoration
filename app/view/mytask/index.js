Ext.define('FamilyDecoration.view.mytask.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.mytask-index',
    requires: [
        'FamilyDecoration.view.mytask.TaskTable',
        'FamilyDecoration.model.TaskList'
    ],
    layout: 'vbox',
    defaults: {
        flex: 1,
        width: '100%'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'mytask-tasktable',
                filterCfg: {
                    specificUser: User.getName()
                },
                processEditEnabled: function(rec) {
                    return rec.get('taskExecutor') === User.getName();
                },
                acceptEditEnabled: function(rec) {
                    return rec.get('acceptor') === User.getName();
                }
            }
        ]

        this.callParent();
    }
});