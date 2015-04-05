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
				allowBlank: false
			}]
		}, {
			xtype: 'checklog-memberlist',
			title: '任务分配人员',
			id: 'treepanel-taskassignee',
			name: 'treepanel-taskassignee',
			isCheckMode: true,
			flex: 1,
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
					executor = [];
				if (name.isValid() && content.isValid()) {
					var assignees = tree.getChecked();
					if (assignees.length > 0) {
						for (var i = 0; i < assignees.length; i++) {
							executor.push(assignees[i].get('name'));
						}
						executor = executor.join(',');
						Ext.Ajax.request({
							url: './libs/tasklist.php?action=addTaskList',
							method: 'POST',
							params: {
								taskName: name.getValue(),
								taskContent: content.getValue(),
								taskExecutor: executor
							},
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										showMsg('任务分配成功！');
										me.close();
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