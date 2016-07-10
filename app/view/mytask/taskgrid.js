Ext.define('FamilyDecoration.view.mytask.TaskGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.mytask-taskgrid',
	requires: [
        'FamilyDecoration.model.TaskList'
	],
	autoScroll: true,
	refresh: Ext.emptyFn,

	initComponent: function () {
		var me = this;

		me.columns = {
			defaults: {
				align: 'left',
				sortable: false,
				menuDisabled: true
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
					dataIndex: 'createTime'
				}
			]
		};

		me.store = Ext.create('Ext.data.Store', {
            model: 'FamilyDecoration.model.TaskList',
			autoLoad: false,
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