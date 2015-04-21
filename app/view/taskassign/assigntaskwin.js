Ext.define('FamilyDecoration.view.taskassign.AssignTaskWin', {
	extend: 'Ext.window.Window',
	requires: ['FamilyDecoration.view.taskassign.UserTaskList', 'FamilyDecoration.view.checklog.MemberList'],
	alias: 'widget.taskassign-assigntaskwin',
	width: 500,
	height: 300,
	title: '分配任务',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	modal: true,
	task: null,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'container',
			flex: 2,
			layout: 'border',
			items: [{
				xtype: 'textfield',
				id: 'textfield-taskName',
				name: 'textfield-taskName',
				region: 'north',
				width: '100%',
				height: 20,
				margin: '0 0 1 0',
				emptyText: '任务名称',
				value: me.task ? me.task.get('taskName') : '',
				allowBlank: false
			}, {
				xtype: 'textarea',
				id: 'textarea-taskContent',
				name: 'textarea-taskContent',
				region: 'center',
				width: '100%',
				margin: 0,
				autoScroll: true,
				emptyText: '任务内容',
				allowBlank: false,
				value: me.task ? me.task.get('taskContent') : ''
			}]
		}, {
			xtype: 'checklog-memberlist',
			title: '任务分配人员',
			id: 'treepanel-taskassignee',
			name: 'treepanel-taskassignee',
			isCheckMode: true,
			flex: 1,
			assignees: me.task ? me.task.get('taskExecutor').split(',') : undefined,
			listeners: {
				load: function (){
					var treepanel = Ext.getCmp('treepanel-taskassignee');
					treepanel.expandAll();
				},
				checkchange: function (node, checked, opts){

				}
			}
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var name = Ext.getCmp('textfield-taskName'),
					content = Ext.getCmp('textarea-taskContent'),
					tree = Ext.getCmp('treepanel-taskassignee'),
					executor = [], 
					p = {
						taskName: name.getValue(),
						taskContent: content.getValue()
					},
					memberList = Ext.getCmp('treepanel-taskMemberName'),
					memberSt = memberList.getStore(),
					taskList = Ext.getCmp('treepanel-taskNameByUser'),
					taskSt = taskList.getStore();
				if (name.isValid() && content.isValid()) {
					var assignees = tree.getChecked();
					if (assignees.length > 0) {
						for (var i = 0; i < assignees.length; i++) {
							executor.push(assignees[i].get('name'));
						}
						executor = executor.join(',');
						Ext.apply(p, {
							taskExecutor: executor
						});
						if (me.task) {
							Ext.apply(p, {
								id: me.task.getId()
							});
						};
						Ext.Ajax.request({
							url: me.task ? './libs/tasklist.php?action=editTaskList' : './libs/tasklist.php?action=addTaskList',
							method: 'POST',
							params: p,
							callback: function (opts, success, res){
								if (success) {
									if (me.task) {
										sendMsg(User.getName(), executor, User.getRealName() + '编辑了任务，任务名称：' + name.getValue() + '，任务内容：' + content.getValue() + '；');
									}
									else {
										sendMsg(User.getName(), executor, User.getRealName() + '给您分配了任务，任务名称：' + name.getValue() + '，任务内容：' + content.getValue() + '；');
									}

									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										me.task ? showMsg('任务编辑成功！') : showMsg('任务分配成功！');
										memberSt.getProxy().url = './libs/loglist.php?action=getLogListDepartments';
										memberSt.getProxy().extraParams = {};
										memberSt.load({
											node: memberSt.getRootNode(),
											callback: function (recs, ope, success){
												if (success) {
													taskSt.getProxy().extraParams = {
														user: memberList.getSelectionModel().getSelection()[0].get('name')
													};
													taskSt.getProxy().url = './libs/tasklist.php?action=getTaskListYearsByUser';
													taskSt.load({
														node: taskSt.getRootNode(),
														callback: function (){
															taskList.getSelectionModel().deselectAll();
														}
													});												
												}
											}
										});
										me.close();
									}
									else {
										showMsg(obj.errMsg);
									}
								}
							}
						})
					}
					else {
						showMsg('请选择任务分配人员！');
					}
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];

		this.callParent();
	}
});