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
	afterEvent: Ext.emptyFn,

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
				forEmail: true,
				height: '100%',
				flex: 1,
				isCheckMode: true,
				listeners: {
					load: function (){
						var treepanel = Ext.getCmp('treepanel-memberlistForMyLog');
						treepanel.expandAll();
					},
					checkchange: function (node, checked, opts){
						node.cascadeBy(function(n) {
							n.set('checked', checked);
						});
						node.bubble(function (n){
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
				height: '100%',
				hidden: me.logObj ? (me.logObj.get('logType') == 1 ? true : false) : false
			}, {
				xtype: 'checkboxfield',
				itemId: 'checkbox-sendMail',
				name: 'checkbox-sendMail',
				boxLabel: '邮件提醒',
				hideLabel: true,
				flex: 1,
				height: '100%'
			}, {
				xtype: 'checkboxfield',
				itemId: 'checkbox-askLeave',
				name: 'checkbox-askLeave',
				boxLabel: '请假',
				value: me.logObj ? (me.logObj.get('logType') == 1 ? true : false) : false,
				hideLabel: true,
				flex: 1,
				height: '100%',
				listeners: {
					render: function (chk){
						Ext.QuickTips.register({
							target: chk.getEl(),
							text: '勾选此项，该日志即为请假类型'
						});
					},
					change: function (chk, newVal, oldVal){
						var ct = Ext.getCmp('fieldcontainer-sendMsgOption'),
							smsChk = ct.getComponent('checkbox-sendSMS');
						smsChk.setValue(false).setVisible(!newVal);
						if (newVal) {
							showMsg('请假会按照默认规则进行短信发送！');
						}
					}
				}
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var logContent = Ext.getCmp('textarea-logContent'),
					sendOpt = Ext.getCmp('fieldcontainer-sendMsgOption'),
					sms = sendOpt.getComponent('checkbox-sendSMS'),
					mail = sendOpt.getComponent('checkbox-sendMail'),
					leave = sendOpt.getComponent('checkbox-askLeave'),
					p = {
						content: logContent.getValue(),
						logListId: me.logListId,
						logType: leave.getValue() ? 1: 0
					},

					memberTree = Ext.getCmp('treepanel-memberlistForMyLog'),
					selMembers = memberTree.getChecked(),
					grid = Ext.getCmp('gridpanel-logDetail'),
					tree = Ext.getCmp('treepanel-logName'),
					rec = tree.getSelectionModel().getSelection()[0],
					supervisorList = [];

				function sendSMSToSupervisor (content){
					if (!User.isGeneral()) {
						// common staff
						if (!User.isManager() && !User.isAdmin()) {
							Ext.Ajax.request({
								url: 'libs/user.php?action=getuserbylevel',
								method: 'GET',
								params: {
									level: User.level.split('-')[0] + '-001'
								},
								callback: function (opts, success, res){
									if (success) {
										var userArr = Ext.decode(res.responseText),
											user;
										if (userArr.length > 0) {
											for (var i = 0; i < userArr.length; i++) {
												user = userArr[i];
												user['phone'] && sendSMS(User.getName(), user['name'], user['phone'], content);
											}
										}
									}
								}
							});
						}
						// manager of one department
						else if (User.isManager()) {

						}
						// administrator
						else {

						}
						// send to all administrative members
						Ext.Ajax.request({
							url: 'libs/user.php?action=getAdminMembers',
							method: 'GET',
							callback: function (opts, success, res){
								if (success) {
									var userArr = Ext.decode(res.responseText),
										user;
									if (userArr.length > 0) {
										for (var i = 0; i < userArr.length; i++) {
											user = userArr[i];
											user['phone'] && sendSMS(User.getName(), user['name'], user['phone'], content);
										}
									}
								}
							}
						})
					}
				}

				if (logContent.isValid()) {
					if (sms.getValue() || mail.getValue()) {
						checkMsg({
							content: logContent.getValue(),
							success: function (infoObj){
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
														if (user.isLeaf()) {
															sendMsg(User.getName(), user.get('name'), sendContent, 'editLogContent', me.logObj ? me.logObj.getId() : obj['id']);
															sms.getValue() && sendSMS(User.getName(), user.get('name'), user.get('phone'), sendContent);
															mail.getValue() && sendMail(user.get('name'), user.get('mail'), User.getRealName() + '进行了"我的日志编辑"', sendContent);
														}
													}
													leave.getValue() && sendSMSToSupervisor(sendContent);
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
							},
							failure: function (infoObj){
								// do nothing
							}
						})
					}
					else {
						if (selMembers.length > 0) {
							showMsg('对已经选择的发送对象要进行何种操作，请选择！');
						}
						else {
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
											leave.getValue() && sendSMSToSupervisor(sendContent);
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
					me.afterEvent();
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