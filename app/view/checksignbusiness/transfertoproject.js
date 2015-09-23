Ext.define('FamilyDecoration.view.checksignbusiness.TransferToProject', {
	extend: 'Ext.window.Window',
	alias: 'widget.checksignbusiness-transfertoproject',

	requires: ['FamilyDecoration.view.checklog.MemberList'],

	resizable: false,
	modal: true,
	width: 600,
	height: 380,
	autoScroll: true,

	client: null,
	clientGrid: null,
	
	layout: 'vbox',
	title: '创建工程',
	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 334
	},

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			width: '100%',
			flex: 7,
			items: [{
				xtype: 'fieldcontainer',
				height: '100%',
				flex: 3,
				items: [{
					id: 'textfield-clientNameForCheckSign',
					name: 'textfield-clientNameForCheckSign',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '客户姓名',
					value: me.client.get('customer')
				}, {
					id: 'textfield-projectAddressForCheckSign',
					name: 'textfield-projectAddressForCheckSign',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '工程地址',
					value: me.client.get('regionName') + ' ' + me.client.get('address')
				}, {
					id: 'datefield-createTimeForCheckSign',
					name: 'datefield-createTimeForCheckSign',
					xtype: 'datefield',
					fieldLabel: '工程创建日期',
					editable: false,
					allowBlank: false
				}, {
					xtype: 'fieldcontainer',
					layout: 'hbox',
					width: '100%',
					items: [{
						id: 'textfield-projectCaptain',
						name: 'textfield-projectCaptain',
						xtype: 'textfield',
						readOnly: true,
						fieldLabel: '项目经理',
						allowBlank: false
					}, {
						xtype: 'button',
						text: '选择',
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								title: '选择项目经理',
								layout: 'fit',
								modal: true,
								width: 500,
								height: 400,
								items: [{
									xtype: 'gridpanel',
									autoScroll: true,
									columns: [{
										text: '姓名',
										flex: 1,
										dataIndex: 'realname'
									}, {
										text: '用户名',
										flex: 1,
										dataIndex: 'name'
									}, {
										text: '部门',
										flex: 1,
										dataIndex: 'level',
										renderer: function (val){
											return User.renderDepartment(val);
										}
									}, {
										text: '等级',
										flex: 1,
										dataIndex: 'level',
										renderer: function (val){
											return User.renderRole(val);
										}
									}],
									store: Ext.create('FamilyDecoration.store.User', {
										autoLoad: true,
										filters: [
											function (item) {
												return /^003-\d{3}$/i.test(item.get('level'));
											}
										]
									})
								}],
								buttons: [{
									text: '确定',
									handler: function (){
										var grid = win.down('grid'),
											captain = Ext.getCmp('textfield-projectCaptain'),
											hidden = Ext.getCmp('hidden-projectCaptainForCheckSign'),
											rec = grid.getSelectionModel().getSelection()[0];
										if (rec) {
											captain.setValue(rec.get('realname'));
											hidden.setValue(rec.get('name'));
											win.close();
										}
										else {
											showMsg('请选择成员！');
										}
									}
								}, {
									text: '取消',
									handler: function (){
										win.close();
									}
								}]
							});

							win.show();
						}
					}, {
						xtype: 'hidden',
						name: 'hidden-projectCaptainForCheckSign',
						id: 'hidden-projectCaptainForCheckSign',
						hideLabel: true
					}]
				}, {
					xtype: 'fieldcontainer',
					layout: 'hbox',
					width: '100%',
					items: [{
						id: 'textfield-projectSupervisorForCheckSign',
						name: 'textfield-projectSupervisorForCheckSign',
						xtype: 'textfield',
						readOnly: true,
						fieldLabel: '项目监理',
						allowBlank: false
					}, {
						xtype: 'button',
						text: '选择',
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								title: '选择项目监理',
								width: 500,
								height: 300,
								layout: 'fit',
								modal: true,
								items: [{
									xtype: 'checklog-memberlist',
									listeners: {
										itemclick: function (view, rec){
											if (!rec.get('name')) {
												return false;
											}
										}
									}
								}],
								buttons: [{
									text: '确定',
									handler: function (){
										var memberlist = win.down('treepanel'),
											supervisorTxt = Ext.getCmp('textfield-projectSupervisorForCheckSign'),
											supervisorHidden = Ext.getCmp('hidden-projectSupervisorForCheckSign'),
											member = memberlist.getSelectionModel().getSelection()[0];

										if (member && member.get('name')) {
											supervisorTxt.setValue(member.get('realname'));
											supervisorHidden.setValue(member.get('name'));
											win.close();
										}
										else {
											showMsg('请选择成员！');
										}
									}
								}, {
									text: '取消',
									handler: function (){
										win.close();
									}
								}]
							});

							win.show();
						}
					}, {
						xtype: 'hidden',
						name: 'hidden-projectSupervisorForCheckSign',
						id: 'hidden-projectSupervisorForCheckSign',
						hideLabel: true
					}]
				}, {
					xtype: 'fieldset',
					collasible: false,
					layout: 'anchor',
					title: '工期',
					width: '100%',
					margin: 0,
					defaults: {
						anchor: '100%'
					},
					items: [{
						xtype: 'datefield',
						fieldLabel: '开始',
						editable: false,
						flex: 1,
						labelWidth: 40,
						name: 'datefield-projectStartTimeForCheckSign',
						id: 'datefield-projectStartTimeForCheckSign',
						allowBlank: false
					}, {
						margin: '0 0 0 2px',
						xtype: 'datefield',
						fieldLabel: '结束',
						editable: false,
						flex: 1,
						labelWidth: 40,
						name: 'datefield-projectEndTimeForCheckSign',
						id: 'datefield-projectEndTimeForCheckSign',
						allowBlank: false
					}]
				}]
			}, {
				title: '消息提醒人',
				xtype: 'checklog-memberlist',
				id: 'treepanel-memberlistForTransference',
				name: 'treepanel-memberlistForTransference',
				forEmail: true,
				height: '100%',
				flex: 1,
				isCheckMode: true
			}]
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			width: '100%',
			id: 'fieldcontainer-sendMsgForTransference',
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
				var customer = Ext.getCmp('textfield-clientNameForCheckSign'),
					address = Ext.getCmp('textfield-projectAddressForCheckSign'),
					createTime = Ext.getCmp('datefield-createTimeForCheckSign'),
					startTime = Ext.getCmp('datefield-projectStartTimeForCheckSign'),
					endTime = Ext.getCmp('datefield-projectEndTimeForCheckSign'),
					captain = Ext.getCmp('textfield-projectCaptain'),
					captainName = Ext.getCmp('hidden-projectCaptainForCheckSign'),
					supervisor = Ext.getCmp('textfield-projectSupervisorForCheckSign'),
					supervisorName = Ext.getCmp('hidden-projectSupervisorForCheckSign'),
					sms = Ext.getCmp('fieldcontainer-sendMsgForTransference').getComponent('checkbox-sendSMS'),
					mail = Ext.getCmp('fieldcontainer-sendMsgForTransference').getComponent('checkbox-sendMail'),
					memberTree = Ext.getCmp('treepanel-memberlistForTransference'),
					selMembers = memberTree.getChecked(),
					sendContent = User.getRealName() + '将客户"' + me.client.get('customer') + '"的"'
								  + me.client.get('regionName') + ' ' + me.client.get('address') + '"'
								  + '转为了工程';

				if (customer.isValid() && address.isValid() && createTime.isValid() && startTime.isValid() 
					&& endTime.isValid() && captain.isValid() && supervisor.isValid()) {

					if (startTime.getValue() - endTime.getValue() > 0) {
						showMsg('开始时间不能大于结束时间');
						return;
					}

					if (selMembers.length > 0) {
						if (!sms.getValue() && !mail.getValue()) {
							showMsg('对已经选择的发送对象要进行何种操作，请选择！');
							return;
						}
						else {
							var p = {
								businessId: me.client.getId(),
								customer: customer.getValue(),
								projectName: address.getValue(),
								createTime: Ext.Date.format(createTime.getValue(), 'Y-m-d'),
								startTime: Ext.Date.format(startTime.getValue(), 'Y-m-d'),
								endTime: Ext.Date.format(endTime.getValue(), 'Y-m-d'),
								salesman: me.client.get('salesman'),
								salesmanName: me.client.get('salesmanName'),
								captain: captain.getValue(),
								captainName: captainName.getValue(),
								supervisor: supervisor.getValue(),
								supervisorName: supervisorName.getValue(),
								designer: me.client.get('designer'),
								designerName: me.client.get('designerName')
							};

							Ext.Ajax.request({
								method: 'POST',
								url: 'libs/business.php?action=transferBusinessToProject',
								params: p,
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText);
										if (obj.status == 'successful') {
											showMsg('转换成功！');
											me.close();
											me.clientGrid.refresh();
											checkMsg({
												content: sendContent,
												success: function (){
													for (var i = 0; i < selMembers.length; i++) {
														var user = selMembers[i];
														sendMsg(User.getName(), user.get('name'), sendContent, 'transferBusinessToProject', obj['projectId']);
														sms.getValue() && sendSMS(User.getName(), user.get('name'), user.get('phone'), sendContent);
														mail.getValue() && sendMail(user.get('name'), user.get('mail'), User.getRealName() + '进行了"业务转工程"', sendContent);
													}
												},
												failure: function (){
													
												}
											});
										}
										else {
											showMsg(obj.errMsg);
										}
									}
								}
							});
						}
					}
					else {
						if (sms.getValue() || mail.getValue()) {
							showMsg('请选择成员！')
							return;
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