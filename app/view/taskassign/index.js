Ext.define('FamilyDecoration.view.taskassign.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.taskassign-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.view.taskassign.UserTaskList',
		'FamilyDecoration.store.TaskScrutinize',
		'FamilyDecoration.view.taskassign.AssignTaskWin',
		'FamilyDecoration.view.mytask.TaskTable'
	],
	autoScroll: true,
	layout: {
		type: 'hbox',
		align: 'stretch',
		height: '100%'
	},
	taskId: undefined,
	taskExecutor: undefined,

	initComponent: function () {
		var me = this;

		me.items = [
			{
				xtype: 'checklog-memberlist',
				title: '成员列表',
				id: 'treepanel-taskMemberName',
				name: 'treepanel-taskMemberName',
				userName: me.taskExecutor,
				flex: 1,
				hidden: me.taskExecutor ? true : false,
				fullList: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				margin: '0 1 0 0',
				listeners: {
					itemclick: function (view, rec) {
						if (rec.get('level') && rec.get('name')) {
							return true;
						}
						else {
							return false;
						}
					},
					selectionchange: function (selModel, sels, opts) {
						var rec = sels[0],
							userTaskPanel = Ext.getCmp('treepanel-taskNameByUser'),
							st = userTaskPanel.getStore(),
							taskDetailPanel = Ext.getCmp('panel-taskDetailByUser');

						if (rec && rec.get('level') && rec.get('name')) {
							userTaskPanel.getSelectionModel().deselectAll();

							userTaskPanel.userName = rec.get('name');
							st.proxy.url = './libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListYearsByUser',
								user: rec.get('name')
							};
							st.load({
								node: st.getRootNode(),
								callback: function (recs, ope, success) {
									if (success) {
										ope.node.expand();
									}
								}
							});
						}
						else {
							// todo
						}
					},
					load: function () {
						var treepanel = Ext.getCmp('treepanel-taskMemberName');
						treepanel.expandAll();
					}
				}
			},
			{
				xtype: 'mytask-tasktable',
				flex: 7,
				tbar: [
					{
						text: '添加',
						id: 'button-addTask',
						icon: './resources/img/add1.png',
						name: 'button-addTask',
						handler: function () {
							var win = Ext.create('FamilyDecoration.view.taskassign.AssignTaskWin', {
							});
							win.show();
						}
					},
					{
						text: '修改',
						id: 'button-editTask',
						name: 'button-editTask',
						icon: './resources/img/edit1.png',
						disabled: true,
						handler: function () {
							var tree = Ext.getCmp('treepanel-taskNameByUser'),
								task = tree.getSelectionModel().getSelection()[0];
							if (task) {
								var win = Ext.create('FamilyDecoration.view.taskassign.AssignTaskWin', {
									task: task
								});
								win.show();
							}
							else {
								showMsg('请选择任务！');
							}
						}
					}
				],
				bbar: [
					{
						text: '删除',
						id: 'button-delTask',
						name: 'button-delTask',
						icon: './resources/img/delete1.png',
						disabled: true,
						handler: function () {
							var tree = Ext.getCmp('treepanel-taskNameByUser'),
								task = tree.getSelectionModel().getSelection()[0],
								taskSt = tree.getStore(),
								memberTree = Ext.getCmp('treepanel-taskMemberName'),
								memberSt = memberTree.getStore();
							if (task) {
								Ext.Msg.warning('确定要删除当前任务吗？', function (btnId) {
									if ('yes' == btnId) {
										Ext.Ajax.request({
											url: './libs/tasklist.php?action=editTaskList',
											method: 'POST',
											params: {
												id: task.getId(),
												isDeleted: 'true'
											},
											callback: function (opts, success, res) {
												if (success) {
													var obj = Ext.decode(res.responseText);
													if (obj.status == 'successful') {
														showMsg('删除任务成功！');
														memberSt.getProxy().url = './libs/loglist.php?action=getLogListDepartments';
														memberSt.getProxy().extraParams = {
															email: false,
															fullList: true,
															individual: false
														};
														memberSt.load({
															node: memberSt.getRootNode(),
															callback: function (recs, ope, success) {
																if (success) {
																	taskSt.getProxy().extraParams = {
																		user: memberTree.getSelectionModel().getSelection()[0].get('name')
																	};
																	taskSt.getProxy().url = './libs/tasklist.php?action=getTaskListYearsByUser';
																	taskSt.load({
																		node: taskSt.getRootNode(),
																		callback: function () {
																			tree.getSelectionModel().deselectAll();
																		}
																	});
																}
															}
														});
													}
													else {
														showMsg(obj.errMsg);
													}
												}
											}
										})
									}
								});
							}
							else {
								showMsg('请选择任务！');
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});