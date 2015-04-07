Ext.define('FamilyDecoration.view.taskassign.UserTaskList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.TaskList'],
	alias: 'widget.taskassign-usertasklist',
	userName: undefined,

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: false
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
						action: 'getTaskListYearsByUser'
					}
				},
				listeners: {
					beforeload: function (st, ope){
						var node = ope.node;
						if (node.get('year')) {
							st.proxy.url = 'libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListMonthsByUser',
								year: node.get('year'),
								user: me.userName
							};
						}
						else if (node.get('month')) {
							st.proxy.url = 'libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListByMonthByUser',
								year: node.parentNode.get('year'),
								month: node.get('month'),
								user: me.userName
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
	            				node.set({
	            					icon: 'resources/img/log.ico',
	            					leaf: true,
	            					qtip: '任务名称：' + node.get('taskName') + '<br />' + '分配人：' + node.get('realName')
	            				});
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