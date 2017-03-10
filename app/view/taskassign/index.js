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
				itemId: 'treepanel-taskMemberName',
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
							taskTable = me.getComponent('taskTable'),
							cfg;
						if (rec && rec.get('name')) {
							cfg = {
								taskExecutor: rec.get('name')
							};
							taskTable.filterCfg = cfg;
							taskTable.refresh({
								params: cfg
							});
						}
						else {
							taskTable.removeAll();
						}
						// taskTable.initBtn();
					},
					load: function () {
						var treepanel = me.getComponent('treepanel-taskMemberName');
						treepanel.expandAll();
					}
				}
			},
			{
				xtype: 'mytask-tasktable',
				itemId: 'taskTable',
				flex: 7,
				needLoad: false,
				assistantEditEnabled: function (){
					return User.isAdmin();
				},
				_getBtns: function (){
					var top = this.getDockedItems('toolbar[dock="top"]')[0],
						bottom = this.getDockedItems('toolbar[dock="bottom"]')[0];
					return {
						add: top.getComponent('button-addTask'),
						edit: top.getComponent('button-editTask'),
						del: bottom.getComponent('button-delTask')
					}
				},
				initBtn: function (rec){
					var btn = this._getBtns(),
						memberTree = me.getComponent('treepanel-taskMemberName'),
						selModel = memberTree.getSelectionModel(),
						user = selModel.getSelection()[0];
					btn.add.setDisabled(!(user && user.get('name')));
					btn.edit.setDisabled(!(rec && rec.get('taskName')));
					btn.del.setDisabled(!(rec && rec.get('taskName')));
				},
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var taskTable = me.getComponent('taskTable');
						taskTable.initBtn(sels[0]);
					}
				},
				tbar: [
					{
						text: '添加',
						itemId: 'button-addTask',
						icon: './resources/img/add1.png',
						name: 'button-addTask',
						handler: function () {
							var taskTable = me.getComponent('taskTable'),
								memberTree = me.getComponent('treepanel-taskMemberName'),
								selModel = memberTree.getSelectionModel(),
								user = selModel.getSelection()[0];
							var win = Ext.create('FamilyDecoration.view.taskassign.AssignTaskWin', {
								callback: function (){
									taskTable.refresh({
										params: {
											taskExecutor: user.get('name')
										}
									});
								}
							});
							win.show();
						}
					},
					{
						text: '修改',
						itemId: 'button-editTask',
						name: 'button-editTask',
						icon: './resources/img/edit1.png',
						disabled: true,
						handler: function () {
							var taskTable = me.getComponent('taskTable'),
								memberTree = me.getComponent('treepanel-taskMemberName'),
								selModel = memberTree.getSelectionModel(),
								user = selModel.getSelection()[0],
								selModel = taskTable.getSelectionModel(),
								task = selModel.getSelection()[0];
							if (task) {
								var win = Ext.create('FamilyDecoration.view.taskassign.AssignTaskWin', {
									task: task,
									callback: function (){
										taskTable.refresh({
											params: {
												taskExecutor: user.get('name')
											}
										});
									}
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
						itemId: 'button-delTask',
						name: 'button-delTask',
						icon: './resources/img/delete1.png',
						disabled: true,
						handler: function () {
							var taskTable = me.getComponent('taskTable'),
								selModel = taskTable.getSelectionModel(),
								memberTree = me.getComponent('treepanel-taskMemberName'),
								user = memberTree.getSelectionModel().getSelection()[0],
								task = selModel.getSelection()[0];
							if (task) {
								Ext.Msg.warning('确定要删除当前任务吗？', function (btnId) {
									if ('yes' == btnId) {
										Ext.Ajax.request({
											url: './libs/tasklist.php',
											method: 'POST',
											params: {
												action: 'editTaskList',
												isDeleted: 'true',
												id: task.getId()
											},
											callback: function (opts, success, res){
												if (success) {
													var obj = Ext.decode(res.responseText);
													if (obj.status === 'successful') {
														showMsg('任务删除成功!');
														taskTable.refresh({
															params: {
																taskExecutor: user.get('name')
															}
														})
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