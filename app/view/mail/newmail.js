Ext.define('FamilyDecoration.view.mail.NewMail', {
	extend: 'Ext.window.Window',
	title: '写邮件',
	alias: 'widget.mail-newmail',

	requires: [
		'FamilyDecoration.view.checklog.MemberList'
	],

	previewRec: null,
	forPreview: false,
	modal: true,
	width: 604,
	height: 400,
	maximizable: true,

	layout: 'hbox',

	initComponent: function (){
		var me = this;

		me.items = [{
			flex: 3,
			bodyPadding: 2,
			height: '100%',
			id: 'form-newMail',
			name: 'form-newMail',
			xtype: 'form',
			defaultType: 'textfield',
			layout: 'anchor',
			defaults: {
				allowBlank: false
			},
			items: [{
				id: 'textfield-mailReceiver',
				name: 'mailReceiver',
				readOnly: true,
				fieldLabel: '收件人',
				anchor: '100% 10%',
				value: me.forPreview ? me.previewRec.get('mailReceiver') : '',
			}, {
				xtype: 'hiddenfield',
				id: 'hiddenfield-receiverAddress',
				name: 'receiverAddress'
			}, {
				name: 'mailSubject',
				fieldLabel: '主题',
				anchor: '100% 10%',
				value: me.forPreview ? me.previewRec.get('mailSubject') : '',
				readOnly: me.forPreview ? true : false
			}, {
				name: 'mailContent',
				fieldLabel: '内容',
				xtype: 'textarea',
				autoScroll: true,
				anchor: '100% 80%',
				value: me.forPreview ? me.previewRec.get('mailContent') : '',
				readOnly: me.forPreview ? true : false
			}]
		}, {
			disabled: me.forPreview ? true : false,
			flex: 1,
			height: '100%',
			id: 'memberlist-receiverList',
			name: 'memberlist-receiverList',
			xtype: 'checklog-memberlist',
			fullList: true,
			isCheckMode: true,
			listeners: {
				itemclick: function (view, rec){
					if (rec.get('level') && rec.get('name')) {
						
					}
				},
				load: function (){
					var treepanel = Ext.getCmp('memberlist-receiverList');
					treepanel.expandAll();
				},
				checkchange: function (node, checked, opts){
					var receiverText = Ext.getCmp('textfield-mailReceiver'),
						receiverList = receiverText.getValue(),
						senderField = Ext.getCmp('hiddenfield-receiverAddress'),
						senderList = senderField.getValue(),
						val = '',
						hiddenVal = '',
						index;

					if (!node.get('mail')) {
						node.suspendEvents(false); // Stop all events. 
						                                 //Be careful with it. Dont forget resume events!
						node.set('checked', !checked); // invert value
						node.resumeEvents(); // resume events
						showMsg('该用户没有邮箱！');
					}
					else {
						if (receiverList != '' && checked) {
							senderList = senderList.split(',');
							receiverList = receiverList.split(',');

							senderList.push(node.get('name'));
							receiverList.push(node.get('mail'));

							hiddenVal = senderList.join(',');
							val = receiverList.join(',');
						}
						else if (receiverList != '' && !checked) {
							senderList = senderList.split(',');
							receiverList = receiverList.split(',');

							index = receiverList.indexOf(node.get('mail'));

							senderList.splice(index, 1);
							receiverList.splice(index, 1);

							hiddenVal = senderList.join(',');
							val = receiverList.join(',');
						}
						else if (receiverList == '' && checked) {
							receiverList = [];
							senderList = [];

							receiverList.push(node.get('mail'));
							senderList.push(node.get('name'));

							hiddenVal = senderList.join(',');
							val = receiverList.join(',');
						}
						else if (receiverList == '' && !checked) {

						}
						receiverText.setValue(val);
						senderField.setValue(hiddenVal);
					}
				}
			}
		}];

		if (!me.forPreview) {
			me.buttons = [{
				text: '发送',
				handler: function (){
					var form = Ext.getCmp('form-newMail');
					if (form.isValid()) {
						var val = form.getValues(),
							receiveGrid = Ext.getCmp('gridpanel-receivedBox'),
							sendGrid = Ext.getCmp('gridpanel-sentBox');
						var p = {
							mailReceiver: val['receiverAddress'],
							receiverAddress: val['mailReceiver'],
							mailSubject: val['mailSubject'],
							mailContent: val['mailContent'],
							mailSender: User.getName(),
							senderAddress: User.getEmail()
						};
						Ext.Ajax.request({
							url: './libs/mail.php?action=sendMail',
							params: p,
							method: 'POST',
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										showMsg('发送成功！');
										receiveGrid.getStore().reload();
										sendGrid.getStore().reload();
										me.close();
									}
									else {
										showMsg(obj.errMsg);
									}
								}
							}
						})
					}
				}
			}, {
				text: '取消',
				handler: function (){
					me.close();
				}
			}];
		}
		else {
			me.buttons = [{
				text: '关闭',
				handler: function (){
					me.close();
				}
			}]
		}

		me.callParent();
	}
});