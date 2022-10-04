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
                flex: 1,
                xtype: 'mytask-tasktable',
                title: '我执行的任务',
                filterCfg: {
                    taskExecutor: User.getName()
                },
                processEditEnabled: function (){
                    return true;
                }
            },
            {
                xtype: 'mytask-tasktable',
                filterCfg: {
                    taskDispatcher: User.getName()
                },
                title: '我分配的任务',
                flex: 1
            },
            {
                xtype: 'mytask-tasktable',
                title: '我协助的任务',
                flex: 1,
                filterCfg: {
                    assistant: User.getName()
                }
            },
            {
                xtype: 'mytask-tasktable',
                title: '待我验收任务',
                flex: 1,
                acceptEditEnabled: true,
                filterCfg: {
                    acceptor: User.getName()
                }
            }
        ]

        this.callParent();
    }
});