Ext.define('FamilyDecoration.view.mytask.SelfAssess', {
	extend: 'Ext.window.Window',
	alias: 'widget.mytask-selfassess',
	title: '自我评价',
	width: 500,
	height: 300,
	modal: true,
	layout: 'vbox',
	task: null,
	assessment: null, // it is used for edit assessment

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'textarea',
			autoScroll: true,
			hideLabel: true,
			allowBlank: false,
			width: '100%',
			flex: 13,
			value: me.assessment ? me.assessment.get('selfAssessment') : ''
		}, {
			xtype: 'checkboxfield',
			itemId: 'checkbox-sendSMS',
			name: 'checkbox-sendSMS',
			boxLabel: '短信提醒',
			hideLabel: true,
			flex: 1,
			width: '100%'
		}, {
			xtype: 'checkboxfield',
			itemId: 'checkbox-sendMail',
			name: 'checkbox-sendMail',
			boxLabel: '邮件提醒',
			hideLabel: true,
			flex: 1,
			width: '100%'
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var taskListId = me.task.getId(),
					txtArea = me.down('textarea'),
					p = {
						selfAssessment: txtArea.getValue()
					},
					sms = me.getComponent('checkbox-sendSMS'),
					mail = me.getComponent('checkbox-sendMail');
				if (me.assessment) {
					Ext.apply(p, {
						id: me.assessment.getId()
					});
				}
				else {
					Ext.apply(p, {
						taskListId: taskListId
					});
				}
				if (txtArea.isValid()) {
					Ext.Ajax.request({
						url: me.assessment ? './libs/tasklist.php?action=editTaskAssessment' : './libs/tasklist.php?action=addTaskAssessment',
						params: p,
						method: 'POST',
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									var content = User.getRealName() + '为任务"' + me.task.get('taskName') + '"编写了自我评价，评价内容："' + txtArea.getValue() + '"；';
									sendMsg(User.getName(), me.task.get('taskDispatcher'), content);
									sms.getValue() && sendSMS(User.getName(), me.task.get('taskDispatcher'), me.task.get('taskDispatcherPhoneNumber'), content);
									mail.getValue() && sendMail(me.task.get('taskDispatcher'), 
										me.task.get('taskDispatcherMail'), User.getRealName() + '填写了"自我评价"', content);
									showMsg('编写成功！');
									me.close();
									Ext.getCmp('panel-selfAssessment').refresh(me.task);
								}
								else {
									showMsg(obj.errMsg);
								}
							}
						}
					});
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		me.callParent();
	}
})