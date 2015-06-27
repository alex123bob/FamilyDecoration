Ext.define('FamilyDecoration.view.business.TransferToProject', {
	extend: 'Ext.window.Window',
	alias: 'widget.business-transfertoproject',

	requires: ['FamilyDecoration.view.checklog.MemberList'],

	resizable: false,
	modal: true,
	width: 600,
	height: 300,
	autoScroll: true,

	community: null,
	client: null,
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
					id: 'textfield-clientNameForProject',
					name: 'textfield-clientNameForProject',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '客户姓名',
					value: me.client.get('customer')
				}, {
					id: 'textfield-projectAddress',
					name: 'textfield-projectAddress',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '工程地址',
					value: me.community.get('name') + ' ' + me.client.get('address')
				}, {
					id: 'datefield-createTime',
					name: 'datefield-createTime',
					xtype: 'datefield',
					fieldLabel: '工程创建日期',
					editable: false,
					value: me.community ? me.community.get('createTime') : ''
				}, {
					id: 'textfield-projectPeriod',
					name: 'textfield-projectPeriod',
					xtype: 'textfield',
					fieldLabel: '工期'
				}, {
					xtype: 'fieldcontainer',
					width: '100%',
					layout: 'hbox',
					items: [{
						id: 'textfield-designStaff',
						name: 'textfield-designStaff',
						xtype: 'textfield',
						allowBlank: false,
						readOnly: true,
						fieldLabel: '设计师'
					}, {
						xtype: 'button',
						text: '选择',
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								title: '选择用户',
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
									}, {
										text: '项目名称',
										flex: 1,
										dataIndex: 'projectName'
									}],
									store: Ext.create('FamilyDecoration.store.User', {
										autoLoad: true,
										filters: [
											function (item) {
												return /^002-\d{3}$/i.test(item.get('level'));
											}
										]
									})
								}],
								buttons: [{
									text: '确定',
									handler: function (){
										var grid = win.down('grid'),
											designer = Ext.getCmp('textfield-designStaff'),
											rec = grid.getSelectionModel().getSelection()[0];
										designer.setValue(rec.get('realname'));
										win.close();
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
					}]
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
									}, {
										text: '项目名称',
										flex: 1,
										dataIndex: 'projectName'
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
											rec = grid.getSelectionModel().getSelection()[0];
										captain.setValue(rec.get('realname'));
										win.close();
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
					}]
				}]
			}, {
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
				var customer = Ext.getCmp('textfield-clientNameForProject'),
					address = Ext.getCmp('textfield-projectAddress'),
					createTime = Ext.getCmp('datefield-createTime'),
					designer = Ext.getCmp('textfield-designStaff'),
					captain = Ext.getCmp('textfield-projectCaptain'),
					communityGrid = Ext.getCmp('gridpanel-community'),
					period = Ext.getCmp('textfield-projectPeriod'),
					sms = Ext.getCmp('fieldcontainer-sendMsgForTransference').getComponent('checkbox-sendSMS'),
					mail = Ext.getCmp('fieldcontainer-sendMsgForTransference').getComponent('checkbox-sendMail'),
					memberTree = Ext.getCmp('treepanel-memberlistForTransference'),
					selMembers = memberTree.getChecked(),
					sendContent = User.getRealName() + '将客户"' + me.client.get('customer') + '"的"'
								  + me.community.get('name') + ' ' + me.client.get('address') + '"'
								  + '转为了工程';

				if (customer.isValid() && address.isValid() && createTime.isValid() && period.isValid()
					&& designer.isValid() && captain.isValid()) {
					if (selMembers.length > 0) {
						if (!sms.getValue() && !mail.getValue()) {
							showMsg('对已经选择的发送对象要进行何种操作，请选择！');
							return;
						}
						else {
							for (var i = 0; i < selMembers.length; i++) {
								var user = selMembers[i];
								sendMsg(User.getName(), user.get('name'), sendContent);
								sms.getValue() && sendSMS(User.getName(), user.get('name'), user.get('phone'), sendContent);
								mail.getValue() && sendMail(user.get('name'), user.get('mail'), User.getRealName() + '进行了"业务转工程"', sendContent);
							}
						}
					}
					var p = {
						businessId: me.client.getId(),
						customer: customer.getValue(),
						projectName: address.getValue(),
						createTime: createTime.getValue(),
						designer: designer.getValue(),
						salesman: me.client.get('salesman'),
						captain: captain.getValue(),
						period: period.getValue()
					};
					Ext.Ajax.request({
						method: 'POST',
						url: 'libs/business.php?action=transferBusinessToProject',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									clientGrid = Ext.getCmp('gridpanel-clientInfo');
								if (obj.status == 'successful') {
									me.logObj ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									communityGrid.getStore().reload({
										callback: function (recs, ope, success){
											if (success) {
												clientGrid.refresh(me.community);
											}
										}
									})
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
			handler: function () {
				me.close();
			}
		}]

		this.callParent();
	}
});