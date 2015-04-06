Ext.define('FamilyDecoration.view.mytask.SelfAssess', {
	extend: 'Ext.window.Window',
	alias: 'widget.mytask-selfassess',
	title: '自我评价',
	width: 500,
	height: 300,
	modal: true,
	layout: 'fit',
	task: null,
	assessment: null, // it is used for edit assessment

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'textarea',
			autoScroll: true,
			hideLabel: true,
			allowBlank: false,
			value: me.assessment ? me.assessment.get('selfAssessment') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var taskListId = me.task.getId(),
					txtArea = me.down('textarea'),
					p = {
						selfAssessment: txtArea.getValue()
					};
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