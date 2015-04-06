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
		if (!$('#completeProcess').length) {
			$('body').append('<div class="x-hide-display" id="completeProcess"></div>');
		}

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
							return true;
						}
						else {
							return false;
						}
					},
					selectionchange: function (selModel, sels, opts){
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
								callback: function (recs, ope, success){
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
					disabled: true,
					handler: function (){
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
				}, {
					text: '删除',
					id: 'button-delTask',
					name: 'button-delTask',
					disabled: true,
					handler: function (){
						var tree = Ext.getCmp('treepanel-taskNameByUser'),
							task = tree.getSelectionModel().getSelection()[0],
							taskSt = tree.getStore(),
							memberTree = Ext.getCmp('treepanel-taskMemberName'),
							memberSt = memberTree.getStore();
						if (task) {
							Ext.Msg.warning('确定要删除当前任务吗？', function (btnId){
								if ('yes' == btnId) {
									Ext.Ajax.request({
										url: './libs/tasklist.php?action=editTaskList',
										method: 'POST',
										params: {
											id: task.getId(),
											isDeleted: 'true'
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('删除任务成功！');
													memberSt.getProxy().url = './libs/loglist.php?action=getLogListDepartments';
													memberSt.getProxy().extraParams = {};
													memberSt.load({
														node: memberSt.getRootNode(),
														callback: function (recs, ope, success){
															if (success) {
																taskSt.getProxy().extraParams = {
																	user: memberTree.getSelectionModel().getSelection()[0].get('name')
																};
																taskSt.getProxy().url = './libs/tasklist.php?action=getTaskListYearsByUser';
																taskSt.load({
																	node: taskSt.getRootNode(),
																	callback: function (){
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
						var content = rec.get('taskContent').replace(/\n/ig, '<br />');
						this.body.update(content);
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
				contentEl: 'completeProcess',
				autoScroll: true,
				refresh: function (rec){
					if (rec) {
						var completed = parseFloat(rec.get('taskProcess')),
							uncompleted = parseFloat(completed.sub(1));
						$('#completeProcess').highcharts({
					        chart: {
					            type: 'pie',
					            options3d: {
					                enabled: true,
					                alpha: 45,
					                beta: 0
					            },
					            height: 270
					        },
					        title: {
					            text: '任务完成情况'
					        },
					        tooltip: {
					            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
					        },
					        plotOptions: {
					            pie: {
					                allowPointSelect: true,
					                cursor: 'pointer',
					                depth: 30,
					                dataLabels: {
					                    enabled: true,
					                    format: '{point.name}'
					                }
					            }
					        },
					        series: [{
					            type: 'pie',
					            name: '百分比',
					            data: [
					            	['已完成', completed],
					            	['未完成', uncompleted]
					            ]
					        }]
					    });
					}
					else {
						$('#completeProcess').html('');
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