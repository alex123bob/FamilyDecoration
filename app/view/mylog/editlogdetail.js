Ext.define('FamilyDecoration.view.mylog.EditLogDetail', {
	extend: 'Ext.window.Window',
	alias: 'widget.mylog-editlogdetail',
	requires: ['Ext.grid.plugin.CellEditing', 'FamilyDecoration.view.checklog.MemberList'],

	// resizable: false,
	modal: true,
	layout: 'vbox',
	maximizable: true,
	width: 550,
	height: 340,
	logObj: null,
	logListId: undefined,

	initComponent: function (){
		var me = this;
		
		me.title = me.logObj ? '编辑日志' : '新建日志';

		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			width: '100%',
			flex: 7,
			items: [{
				id: 'textarea-logContent',
				name: 'textarea-logContent',
				xtype: 'textarea',
				allowBlank: false,
				height: '100%',
				flex: 1,
				value: me.logObj ? me.logObj.get('content') : ''
			}, {
				xtype: 'checklog-memberlist',
				id: 'treepanel-memberlistForMyLog',
				name: 'treepanel-memberlistForMyLog',
				height: '100%',
				flex: 1,
				isCheckMode: true
			}]
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			width: '100%',
			id: 'fieldcontainer-sendMsgOption',
			flex: 1,
			items: [{
				xtype: 'checkboxfield',
				itemId: 'checkbox-sendSMS',
				name: 'checkbox-sendSMS',
				boxLabel: '短信提醒',
				hideLabel: true,
				flex: 1,
				height: '100%'
			}, {
				xtype: 'checkboxfield',
				itemId: 'checkbox-sendMail',
				name: 'checkbox-sendMail',
				boxLabel: '邮件提醒',
				hideLabel: true,
				flex: 1,
				height: '100%'
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var logContent = Ext.getCmp('textarea-logContent'),
				p = {
					content: logContent.getValue(),
					logListId: me.logListId
				},
				sms = Ext.getCmp('fieldcontainer-sendMsgOption').getComponent('checkbox-sendSMS'),
				mail = Ext.getCmp('fieldcontainer-sendMsgOption').getComponent('checkbox-sendMail'),
				memberTree = Ext.getCmp('treepanel-memberlistForMyLog'),
				selMembers = memberTree.getChecked(),
				grid = Ext.getCmp('gridpanel-logDetail'),
				tree = Ext.getCmp('treepanel-logName'),
				rec = tree.getSelectionModel().getSelection()[0];

				if (logContent.isValid()) {
					if (sms.getValue() || mail.getValue()) {
						if (selMembers.length > 0) {
							me.logObj && Ext.apply(p, {
								id: me.logObj.getId()
							});
							Ext.Ajax.request({
								method: 'POST',
								url: 'libs/loglist.php?action=addOrEditLogDetail',
								params: p,
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText),
											sendContent = '';
										if (obj.status == 'successful') {
											if (me.logObj) {
												showMsg('修改成功！');
												sendContent += User.getRealName() + '修改了日志[' + rec.get('logName') + '],'
															+ '日志内容: ' + Ext.getCmp('textarea-logContent').getValue();
											}
											else {
												showMsg('增加成功！');
												sendContent += User.getRealName() + '添加了日志[' + rec.get('logName') + '],'
															+ '日志内容: ' + Ext.getCmp('textarea-logContent').getValue();
											}
											for (var i = 0; i < selMembers.length; i++) {
												var user = selMembers[i];
												sms.getValue() && sendSMS(User.getName(), user.get('name'), user.get('phone'), sendContent);
												mail.getValue() && sendMail(user.get('name'), user.get('mail'), User.getRealName() + '进行了"我的日志编辑"', sendContent);
											}
											me.close();
											grid.refresh(rec);
										}
									}
								}
							});
						}
						else {
							showMsg('请选择要发送的对象！');
						}
					}
					else {
						if (selMembers.length > 0) {
							showMsg('对已经选择的发送对象要进行何种操作，请选择！');
						}
						else {
							Ext.Ajax.request({
								method: 'POST',
								url: 'libs/loglist.php?action=addOrEditLogDetail',
								params: p,
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText);
										if (obj.status == 'successful') {
											if (me.logObj) {
												showMsg('修改成功！');
											}
											else {
												showMsg('增加成功！');
											}
											me.close();
											grid.refresh(rec);
										}
										else {
											showMsg(obj.errMsg);
										}
									}
								}
							});
						}
					}
				}
			}
		}, {
			text: '取消',
			handler: function () {
				me.close();
			}
		}]

		this.callParent();
	}
});