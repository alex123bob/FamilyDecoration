Ext.define('FamilyDecoration.view.mytask.TaskTable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mytask-tasktable',
    requires: [
        'FamilyDecoration.model.TaskList'
    ],
    defaults: {
        
    },
    autoScroll: true,
    title: '任务列表',
    initComponent: function () {
        var me = this,
            st = Ext.create('Ext.data.Store', {
                model: 'FamilyDecoration.model.TaskList',
                autoLoad: false
            })
            proxy = st.getProxy();

        Ext.override(proxy, {
            extraParams: {
                action: 'getTaskList'
            }
        });
        st.load();
        this.store = st;

        this.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    text: '分配人',
                    dataIndex: 'taskDispatcher'
                },
                {
                    text: '执行人',
                    dataIndex: 'taskExecutor'
                },
                {
                    text: '时间',
                    dataIndex: 'createTime'
                },
                {
                    text: '开始',
                    dataIndex: 'startTime'
                },
                {
                    text: '结束',
                    dataIndex: 'endTime'
                },
                {
                    text: '标题'
                },
                {
                    text: '内容'
                },
                {
                    text: '优先级'
                },
                {
                    text: '协助人'
                },
                {
                    text: '完成情况'
                },
                {
                    text: '评分'
                }
            ]
        };
        
        this.callParent();
    }
});