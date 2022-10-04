Ext.define('FamilyDecoration.view.taskassign.AssignTaskWin', {
	extend: 'Ext.window.Window',
	requires: ['FamilyDecoration.view.taskassign.UserTaskList', 'FamilyDecoration.view.checklog.MemberList'],
	alias: 'widget.taskassign-assigntaskwin',
	width: 600,
	height: 400,
	title: '分配任务',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	modal: true,
	task: null,
	callback: Ext.emptyFn,

	initComponent: function () {
		var me = this;

		me.items = [
			{
				name: 'container-taskBody',
				xtype: 'container',
				flex: 2,
				margin: '0 1 0 0',
				padding: 2,
				defaults: {
					width: '100%'
				},
				layout: 'vbox',
				items: [
					{
						xtype: 'textfield',
						id: 'textfield-taskName',
						name: 'textfield-taskName',
						height: 20,
						margin: '0 0 1 0',
						emptyText: '任务名称',
						value: me.task ? me.task.get('taskName') : '',
						allowBlank: false
					},
					{
						xtype: 'textarea',
						id: 'textarea-taskContent',
						name: 'textarea-taskContent',
						flex: 3,
						margin: '0 0 1 0',
						autoScroll: true,
						emptyText: '任务内容',
						allowBlank: false,
						value: me.task ? me.task.get('taskContent') : ''
					},
					{
						itemId: 'timePeriod',
						xtype: 'fieldcontainer',
						layout: 'hbox',
						hideLabel: true,
						height: 24,
						margin: '0 0 1 0',
						defaults: {
							flex: 1,
							labelWidth: 60,
							editable: false,
							xtype: 'datefield',
							allowBlank: false
						},
						items: [
							{
								fieldLabel: '开始时间',
								itemId: 'startTime',
								value: me.task ? new Date(me.task.get('startTime').replace(/-/gi, '/')) : ''
							},
							{
								fieldLabel: '完成时间',
								itemId: 'endTime',
								value: me.task ? new Date(me.task.get('endTime').replace(/-/gi, '/')) : ''
							}
						]
					},
					{
						height: 20,
						itemId: 'priority',
						fieldLabel: '优先级',
						margin: '0 0 4 0',
						xtype: 'combobox',
						displayField: 'name',
						editable: false,
						valueField: 'value',
						allowBlank: false,
						value: me.task ? me.task.get('priority') : '',
						store: Ext.create('Ext.data.Store', {
							fields: ['name', 'value'],
							autoLoad: true,
							proxy: {
								type: 'memory',
								reader: {
									type: 'json'
								}
							},
							data: [
								{
									name: '普通',
									value: 1
								},
								{
									name: '一般',
									value: 2
								},
								{
									name: '紧急',
									value: 3
								}
							]
						})
					},
					{
						height: 20,
						itemId: 'filePath',
						margin: '4 0 4 0',
						xtype: 'textfield',
						emptyText: '文件位置',
						allowBlank: false,
						value: me.task ? me.task.get('filePath') : '',
					},
					{
						xtype: 'fieldcontainer',
						layout: 'hbox',
						hideLabel: true,
						disabled: me.task ? true : false,
						height: 20,
						style: {
							background: '#ffffff'
						},
						items: [
							{
								xtype: 'checkboxfield',
								itemId: 'checkbox-sendSMS',
								name: 'checkbox-sendSMS',
								boxLabel: '短信提醒',
								hideLabel: true,
								flex: 1,
								height: '100%',
								style: {
									background: '#ffffff'
								}
							},
							{
								xtype: 'checkboxfield',
								itemId: 'checkbox-sendMail',
								name: 'checkbox-sendMail',
								boxLabel: '邮件提醒',
								hideLabel: true,
								flex: 1,
								height: '100%',
								style: {
									background: '#ffffff'
								}
							}
						]
					}
				]
			},
			{
				xtype: 'checklog-memberlist',
				title: '任务分配人员',
				id: 'treepanel-taskassignee',
				name: 'treepanel-taskassignee',
				isCheckMode: true,
				flex: 1,
				fullList: true,
				disabled: me.task ? true : false,
				assignees: me.task ? me.task.get('taskExecutor').split(',') : undefined,
				listeners: {
					load: function () {
						var treepanel = Ext.getCmp('treepanel-taskassignee');
						treepanel.expandAll();
					},
					checkchange: function (node, checked, opts) {
						node.cascadeBy(function (n) {
							n.set('checked', checked);
						});
						node.bubble(function (n) {
							if (!n.isRoot() && !n.get('name')) {
								var childNodes = n.childNodes;
								var isAllCheck = true;
								for (var i = childNodes.length - 1; i >= 0; i--) {
									var el = childNodes[i];
									if (el.get('checked') == false) {
										isAllCheck = false;
										break;
									}
								}
								n.set('checked', isAllCheck);
							}
						});
					}
				}
			}
		];

		me.buttons = [{
			text: '确定',
			handler: function () {
				var name = Ext.getCmp('textfield-taskName'),
					content = Ext.getCmp('textarea-taskContent'),
					tree = Ext.getCmp('treepanel-taskassignee'),
					executor = [],
					p = {
						taskName: name.getValue(),
						taskContent: content.getValue()
					},
					sms = Ext.ComponentQuery.query('[name="checkbox-sendSMS"]')[0],
					mail = Ext.ComponentQuery.query('[name="checkbox-sendMail"]')[0],
					sendContent,
					taskBody = me.down('[name="container-taskBody"]'),
					filePath = taskBody.getComponent('filePath'),
					timePeriod = taskBody.getComponent('timePeriod'),
					startTime = timePeriod.getComponent('startTime'),
					endTime = timePeriod.getComponent('endTime'),
					priority = taskBody.getComponent('priority');
				if (name.isValid() && content.isValid() && startTime.isValid() && endTime.isValid() && priority.isValid() && filePath.isValid()) {
					if (startTime.getValue() - endTime.getValue() > 0) {
						showMsg('开始时间不能晚于完成时间！');
						return;
					}
					var assignees = tree.getChecked();
					if (assignees.length > 0) {
						for (var i = 0; i < assignees.length; i++) {
							if (assignees[i].isLeaf()) {
								executor.push(assignees[i].get('name'));
							}
						}
						executor = executor.join(',');
						Ext.apply(p, {
							filePath: filePath.getValue(),
							taskExecutor: executor,
							startTime: Ext.Date.format(startTime.getValue(), 'Y-m-d H:i:s'),
							endTime: Ext.Date.format(endTime.getValue(), 'Y-m-d H:i:s'),
							priority: priority.getValue()
						});
						if (me.task) {
							Ext.apply(p, {
								id: me.task.getId()
							});
							sendContent = User.getRealName() + '编辑了任务，任务名称：' + name.getValue() + '，任务内容：' + content.getValue() + '；';
						}
						else {
							sendContent = User.getRealName() + '给您分配了任务，任务名称：' + name.getValue() + '，任务内容：' + content.getValue() + '；';
						}
						checkMsg({
							content: sendContent,
							success: function () {
								Ext.Ajax.request({
									url: me.task ? './libs/tasklist.php?action=editTaskList' : './libs/tasklist.php?action=addTaskList',
									method: 'POST',
									params: p,
									callback: function (opts, success, res) {
										if (success) {
											var obj = Ext.decode(res.responseText);
											sendMsg(User.getName(), executor, sendContent, 'assignTask', (me.task ? me.task.getId() : obj['taskListId']));
											sms.getValue() && Ext.each(assignees, function (obj, index) {
												sendSMS(User.getName(), obj.get('name'), obj.get('phone'), sendContent);
											});
											mail.getValue() && Ext.each(assignees, function (obj, index) {
												sendMail(obj.get('name'), obj.get('mail'), User.getRealName() + '进行了"任务分配或编辑"', sendContent);
											});

											if (obj.status == 'successful') {
												me.task ? showMsg('任务编辑成功！') : showMsg('任务分配成功！');
												me.close();
												me.callback();
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								});
							},
							failure: function () {

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
			handler: function () {
				me.close();
			}
		}];

		this.callParent();
	}
});