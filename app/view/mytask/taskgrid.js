Ext.define('FamilyDecoration.view.mytask.TaskGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.mytask-taskgrid',
	requires: [
        'FamilyDecoration.model.TaskList'
	],
	autoScroll: true,
	refresh: Ext.emptyFn,
    taskId: undefined,

	initComponent: function () {
		var me = this;

		me.columns = {
			defaults: {
				align: 'center'
			},
			items: [
				{
					flex: 1,
					text: '标题',
					dataIndex: 'taskName'
				},
                {
					flex: 1,
					text: '时间',
					dataIndex: 'createTime',
                    renderer: function (val, meta, rec){
                        if (val) {
                            return val.slice(0, 10);
                        }
                        else {
                            return '';
                        }
                    }
				},
                {
                    flex: 1,
                    text: '分配人',
                    dataIndex: 'realName'
                }
			]
		};

		me.store = Ext.create('Ext.data.Store', {
            model: 'FamilyDecoration.model.TaskList',
			autoLoad: false,
            filters: [
                function (item){
                    if ( (me.taskId && item.getId() == me.taskId) || !me.taskId ) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            ],
            proxy: {
                type: 'rest',
                url: './libs/tasklist.php?action=getTaskListByUser',
                extraParams: {
                    user: User.getName()
                }
            }
		});

        me.addListener('afterrender', function (grid, opts){
            me.refresh();
        });

		me.callParent();
	}
});