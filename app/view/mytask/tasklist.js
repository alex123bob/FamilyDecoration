Ext.define('FamilyDecoration.view.mytask.TaskList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.TaskList'],
	alias: 'widget.mytask-tasklist',
	taskId: undefined,

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: true
			},
			store: Ext.create('FamilyDecoration.store.TaskList', {
				autoLoad: false,
				proxy: {
					type: 'rest',
					url: 'libs/tasklist.php',
					appendId: false,
					reader: {
						type: 'json'
					},
					extraParams: {
						action: 'getTaskListYears'
					}
				},
				listeners: {
					beforeload: function (st, ope){
						var node = ope.node;
						if (node.get('year')) {
							st.proxy.url = 'libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListMonths',
								year: node.get('year')
							};
						}
						else if (node.get('month')) {
							st.proxy.url = 'libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListByMonth',
								year: node.parentNode.get('year'),
								month: node.get('month')
							};
						}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (pNode) {
	            			node.set({
	            				text: node.get('year') || node.get('month') || (node.get('taskName') + '(分配人:' + node.get('realName') + ')' )
	            			});
	            			if (node.get('year') || node.get('month')) {
	            				node.set({
	            					icon: 'resources/img/calendar.gif'
	            				});
	            			}
	            			else if (node.get('taskName')) {
	            				if ((me.taskId && me.taskId == node.getId()) || !me.taskId) {
	            					node.set({
		            					icon: 'resources/img/log.ico',
		            					leaf: true,
		            					qtip: '任务名称：' + node.get('taskName') + '<br />' + '分配人：' + node.get('realName')
		            				});
	            				}
	            				else {
	            					return false;
	            				}
	            			}
	            		}
	            	},
	            	load: function (st, node, recs){
	            		
	            	}
				}
			})
		});

		this.callParent();
	}
});