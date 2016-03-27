Ext.define('FamilyDecoration.view.mail.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mail-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.store.Mail',
		'FamilyDecoration.view.mail.NewMail',
	],
	layout: {
		type: 'fit'
	},

	initComponent: function (){
		var me = this;
		me.items = [
			{
				xtype: 'fieldcontainer',
				flex: 1,
				layout: 'vbox',
				items: [{
					title: '收件箱',
					id: 'gridpanel-receivedBox',
					name: 'gridpanel-receivedBox',
					xtype: 'gridpanel',
					flex: 2,
					width: '100%',
					bodyCls: 'pointerCursor',
					tbar: [{
						xtype: 'button',
						icon: './resources/img/preview2.png',
						text: '查看',
						id: 'button-checkReceiveMail',
						handler: function (){
							var grid = Ext.getCmp('gridpanel-receivedBox'),
								rec = grid.getSelectionModel().getSelection()[0];
							if (rec) {
								var win = Ext.create('FamilyDecoration.view.mail.NewMail', {
									forPreview: true,
									previewRec: rec
								});
								win.show();
								// after you open your mail, if it is unread, set read on it.
								if (rec.get('isRead') == 'false') {
									Ext.Ajax.request({
										url: './libs/mail.php?action=setmailread',
										method: 'POST',
										params: {
											mailId: rec.getId()
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													refreshEmailAndMsg();
													var receiveGrid = Ext.getCmp('gridpanel-receivedBox');
													receiveGrid.getStore().reload();
												}
											}
										}
									});
								}
							}
							else {
								showMsg('没有选中的邮件！');
							}
						}
					}, {
						xtype: 'button',
						icon: './resources/img/isread.png',
						text: '置为已读',
						tooltip: '将收件箱所有邮件置为已读',
						id: 'button-setReadByReceiver',
						handler: function (){
							var grid = Ext.getCmp('gridpanel-receivedBox');
							Ext.Msg.warning('确定将所有收件箱邮件置为已读吗？', function (btnId){
								if (btnId == 'yes') {
									Ext.Ajax.request({
										url: './libs/mail.php?action=setmailreadbyreceiver',
										method: 'POST',
										params: {
											mailReceiver: User.getName()
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													refreshEmailAndMsg();
													showMsg('置为已读成功！');
													grid.getStore().reload();
												}
												else {
													showMsg(obj.errMsg);
												}
											}
										}
									})
								}
							});
						}
					}],
					columns: [{
						xtype:'actioncolumn',
						flex: 0.2,
						dataIndex: 'isRead',
						items: [{
							handler: function (view, rowIndex, colIndex, item, e, rec, row){
								if (rec.get('isRead') == 'false' && rec.get('mailReceiver').indexOf(',') == -1) {
									Ext.Ajax.request({
										url: './libs/mail.php?action=setmailread',
										method: 'POST',
										params: {
											mailId: rec.getId()
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('置为已读成功！');
													refreshEmailAndMsg();
													var receiveGrid = Ext.getCmp('gridpanel-receivedBox');
													receiveGrid.getStore().reload();
												}
											}
										}
									});
								}
							},
							getClass: function (v, meta, rec){
								if (rec.get('mailReceiver').indexOf(',') != -1) {
									return 'icon-mail-multiple-receiver';
								}
								else if (rec.get('isRead') == 'true') {
	                    			return 'icon-mail-read';
								}
								else {
	                    			return 'icon-mail-unread';
								}
							}
						}]
					}, {
						text: '发件人',
						dataIndex: 'mailSender',
						flex: 2
					}, {
						text: '主题',
						dataIndex: 'mailSubject',
						flex: 4
					}, {
						text: '时间',
						dataIndex: 'mailTime',
						flex: 2
					}],
					autoScroll: true,
					store: Ext.create('FamilyDecoration.store.Mail', {
						autoLoad: true,
						proxy: {
							type: 'rest',
							extraParams: {
								mailUser: User.getName(),
								action: 'getReceivedMailByUser'
							},
							url: './libs/mail.php',
					        reader: {
					            type: 'json'
					        }
						}
					}),
					listeners: {
						itemdblclick: function (view, rec, item, index, e, opts){
							if (rec) {
								Ext.getCmp('button-checkReceiveMail').handler();
							}
						}
					}
				}, {
					title: '发件箱',
					xtype: 'gridpanel',
					id: 'gridpanel-sentBox',
					name: 'gridpanel-sentBox',
					flex: 1,
					width: '100%',
					tbar: [{
						xtype: 'button',
						icon: './resources/img/preview1.png',
						text: '查看',
						id: 'button-checkSentMail',
						handler: function (){
							var grid = Ext.getCmp('gridpanel-sentBox'),
								rec = grid.getSelectionModel().getSelection()[0];
							if (rec) {
								var win = Ext.create('FamilyDecoration.view.mail.NewMail', {
									forPreview: true,
									previewRec: rec
								});
								win.show();
							}
							else {
								showMsg('没有选中的邮件！');
							}
						}
					}],
					columns: [{
						flex: 0.2,
						dataIndex: 'isRead',
						text: '',
						renderer: function (){
							return '<img src="./resources/img/mail-read.png" />';
						}
					}, {
						text: '收件人',
						dataIndex: 'mailReceiver',
						flex: 2
					}, {
						text: '主题',
						dataIndex: 'mailSubject',
						flex: 4
					}, {
						text: '时间',
						dataIndex: 'mailTime',
						flex: 2
					}],
					autoScroll: true,
					store: Ext.create('FamilyDecoration.store.Mail', {
						autoLoad: true,
						proxy: {
							url: './libs/mail.php',
							type: 'rest',
							extraParams: {
								mailUser: User.getName(),
								action: 'getSentMailByUser'
							},
							reader: {
					            type: 'json'
					        }
						}
					}),
					listeners: {
						itemdblclick: function (view, rec, item, index, e, opts){
							if (rec) {
								Ext.getCmp('button-checkSentMail').handler();
							}
						}
					}
				}]
			}
		];

		this.callParent();
	}
});