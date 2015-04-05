Ext.define('FamilyDecoration.view.taskassign.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.taskassign-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.view.taskassign.UserTaskList',
		'FamilyDecoration.store.TaskScrutinize',
		'FamilyDecoration.view.taskassign.AssignTaskWin'
	],
	autoScroll: true,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			margin: '0 1 0 0',
			flex: 1,
			layout: 'fit',
			items: [{
				xtype: 'checklog-memberlist',
				title: '成员列表',
				id: 'treepanel-taskMemberName',
				name: 'treepanel-taskMemberName',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('level') && rec.get('name')) {
							var userTaskPanel = Ext.getCmp('treepanel-taskNameByUser'),
								st = userTaskPanel.getStore(),
								taskDetailPanel = Ext.getCmp('panel-taskDetailByUser');

							userTaskPanel.getSelectionModel().deselectAll();

							userTaskPanel.userName = rec.get('name');
							st.proxy.url = './libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListYearsByUser',
								user: rec.get('name')
							};
							st.load({
								node: st.getRootNode(),
								callback: function (recs, ope, success){
									if (success) {
										ope.node.expand();
									}
								}
							});
						}
						else {
						}
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-taskMemberName');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 1,
			layout: 'fit',
			margin: '0 1 0 0',
			items: [{
				xtype: 'taskassign-usertasklist',
				title: '任务目录',
				id: 'treepanel-taskNameByUser',
				name: 'treepanel-taskNameByUser',
				isQuarter: true,
				flex: 4,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				bbar: [{
					text: '添加',
					id: 'button-addTask',
					name: 'button-addTask',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.taskassign.AssignTaskWin', {

						});
						win.show();
					}
				}, {
					text: '修改',
					id: 'button-editTask',
					name: 'button-editTask',
					disabled: true
				}, {
					text: '删除',
					id: 'button-delTask',
					name: 'button-delTask',
					disabled: true
				}],
				width: '100%',
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('taskName')) {
							return true;
						}
						else {
							return false;
						}
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							userTaskPanel = Ext.getCmp('panel-taskDetailByUser'),
							userTaskProcessPanel = Ext.getCmp('panel-taskProcess'),
							scrutinizeGrid = Ext.getCmp('gridpanel-scrutinizeForCheckTask'),
							st = scrutinizeGrid.getStore(),
							
							editTaskBtn = Ext.getCmp('button-editTask'),
							delTaskBtn = Ext.getCmp('button-delTask');
						
						if (rec) {
							userTaskPanel.refresh(rec);
							userTaskProcessPanel.refresh(rec);
							st.load({
								params: {
									taskListId: rec.getId()
								}
							});
							editTaskBtn.setDisabled(!rec.get('taskName'));
							delTaskBtn.setDisabled(!rec.get('taskName'));
						}
						else {
							userTaskPanel.refresh();
							userTaskProcessPanel.refresh();
							st.removeAll();
							editTaskBtn.disable();
							delTaskBtn.disable();
						}
						
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-taskNameByUser');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 4,
			layout: 'border',
			items: [{
				xtype: 'panel',
				id: 'panel-taskDetailByUser',
				name: 'panel-taskDetailByUser',
				title: '任务内容',
				autoRender: true,
				width: 300,
				height: 320,
				autoScroll: true,
				margin: '0 1 0 0',
				region: 'west',
				refresh: function (rec){
					if (rec) {
						this.body.update(rec.get('taskContent'));
					}
					else {
						this.body.update('');
					}
				}
			}, {
				xtype: 'panel',
				title: '完成情况',
				region: 'center',
				id: 'panel-taskProcess',
				name: 'panel-taskProcess',
				refresh: function (rec){
					if (rec) {
						this.body.update(rec.get('taskProcess'));
					}
					else {
						this.body.update('');
					}
				}
			}, {
				xtype: 'gridpanel',
				id: 'gridpanel-scrutinizeForCheckTask',
				name: 'gridpanel-scrutinizeForCheckTask',
				store: Ext.create('FamilyDecoration.store.TaskScrutinize', {
					autoLoad: false
				}),
				autoScroll: true,
				region: 'south',
				columns: [{
					text: '批阅内容',
					dataIndex: 'scrutinizeContent',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false,
					renderer: function (val){
						return val.replace(/\n/ig, '<br />');
					}
				}, {
					text: '批阅人',
					dataIndex: 'realName',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false
				}, {
					text: '批阅时间',
					dataIndex: 'scrutinizeTime',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false
				}],
				bbar: [{
					text: '批阅',
					handler: function (){
						var taskTree = Ext.getCmp('treepanel-taskNameByUser'),
							task = taskTree.getSelectionModel().getSelection()[0],
							taskCheckGrid = Ext.getCmp('gridpanel-scrutinizeForCheckTask');

						if (task) {
							var win = Ext.create('Ext.window.Window', {
								title: '任务批阅',
								modal: true,
								width: 500,
								height: 400,
								layout: 'fit',
								items: [{
									xtype: 'textarea',
									autoScroll: true,
								}],
								buttons: [{
									text: '批阅',
									handler: function (){
										var content = win.down('textarea').getValue();

										if (task) {
											Ext.Ajax.request({
												url: './libs/taskscrutinize.php?action=mark',
												method: 'POST',
												params: {
													taskListId: task.getId(),
													content: content
												},
												callback: function (opts, success, res){
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.status == 'successful') {
															showMsg('批阅成功！');
															win.close();
															taskCheckGrid.getStore().reload();
														}
														else {
															showMsg(obj.errMsg);
														}
													}
												}
											});
										}
										else {
											showMsg('请选择要批阅的任务！');
										}
									}
								}, {
									text: '取消',
									handler: function (){
										win.close();
									}
								}]
							});
							win.show();
						}
						else {
							showMsg('请选择要批阅的任务！');
						}
					}
				}],
				width: '100%',
				height: 300,
				title: '批阅内容'
			}]
		}];

		this.callParent();
	}
});