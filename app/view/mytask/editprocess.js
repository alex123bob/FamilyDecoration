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
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var taskListId = me.task.getId(),
					slider = me.down('slider'),
					sliderVal = parseFloat(slider.getValue()).div(100),
					p = {
						taskProcess: sliderVal
					};
				if (me.task) {
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