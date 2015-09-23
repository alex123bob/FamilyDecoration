Ext.define('FamilyDecoration.view.mytask.EditProcess', {
	extend: 'Ext.window.Window',
	alias: 'widget.mytask-editprocess',
	requires: ['Ext.slider.Single'],
	title: '编辑完成进度',
	width: 500,
	height: 200,
	bodyPadding: 10,
	modal: true,
	task: null,

	initComponent: function (){
		var me = this,
			process = 0;

		if (me.task) {
			process = parseFloat(me.task.get('taskProcess'));
			process = process.mul(100);
		}

		me.items = [{
			xtype: 'slider',
			autoScroll: true,
			value: process,
			increment: 1,
			minValue: 0,
			maxValue: 100,
			width: '100%',
			height: 20,
			listeners: {
				change: function (slider, newVal, thumb, opts){
					var textField = me.down('textfield');
					textField.setValue(newVal);
				}
			}
		}, {
			xtype: 'textfield',
			fieldLabel: '进度值(%)',
			readOnly: true,
			width: 300,
			value: process
		}, {
			xtype: 'checkboxfield',
			itemId: 'checkbox-sendSMS',
			name: 'checkbox-sendSMS',
			boxLabel: '短信提醒',
			hideLabel: true,
			width: '100%',
			height: 20
		}, {
			xtype: 'checkboxfield',
			itemId: 'checkbox-sendMail',
			name: 'checkbox-sendMail',
			boxLabel: '邮件提醒',
			hideLabel: true,
			width: '100%',
			height: 20
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var taskListId = me.task.getId(),
					slider = me.down('slider'),
					sliderVal = parseFloat(slider.getValue()).div(100),
					p = {
						taskProcess: sliderVal
					},
					sms = me.getComponent('checkbox-sendSMS'),
					mail = me.getComponent('checkbox-sendMail'),
					content;

				if (me.task) {
					content = User.getRealName() + '为任务"' + me.task.get('taskName')
							+ '"编辑了任务进度，当前任务进度为："' + slider.getValue() + '%"；';
					checkMsg({
						content: content,
						success: function (){
							Ext.apply(p, {
								id: me.task.getId()
							});
							Ext.Ajax.request({
								url: './libs/tasklist.php?action=editTaskList',
								params: p,
								method: 'POST',
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText);
										if (obj.status == 'successful') {
											sendMsg(User.getName(), me.task.get('taskDispatcher'), content, 'editTaskProgress', me.task.getId());
											sms.getValue() && sendSMS(User.getName(), me.task.get('taskDispatcher'),
												me.task.get('taskDispatcherPhoneNumber'), content);
											mail.getValue() && sendMail(me.task.get('taskDispatcher'), 
												me.task.get('taskDispatcherMail'), User.getRealName() + '编辑了"任务进度"', content);
											showMsg('任务进度编辑成功！');
											me.close();
											Ext.getCmp('treepanel-myTask').refresh();
										}
										else {
											showMsg(obj.errMsg);
										}
									}
								}
							});
						},
						failure: function (){

						}
					});
				}
				else {
					showMsg('没有编辑的任务！');
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