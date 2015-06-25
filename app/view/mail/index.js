Ext.define('FamilyDecoration.view.mail.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mail-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.store.Mail',
		'FamilyDecoration.view.mail.NewMail',
	],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			margin: '0 1 0 0',
			flex: 1,
			layout: 'fit',
			items: [{
				xtype: 'checklog-memberlist',
				title: '成员列表',
				id: 'treepanel-memberNameForMail',
				name: 'treepanel-memberNameForMail',
				forEmail: false,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				tbar: [{
					text: '写信',
					icon: './resources/img/mail-new.png',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.mail.NewMail', {
						});
						win.show();
					}
				}],
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('level') && rec.get('name')) {
							var received = Ext.getCmp('gridpanel-receivedBox'),
								sent = Ext.getCmp('gridpanel-sentBox');
							received.getStore().load({
								params: {
									mailUser: rec.get('name'),
									action: 'getReceivedMailByUser'
								},
								callback: function (recs, ope, success){
								}
							});
							sent.getStore().load({
								params: {
									mailUser: rec.get('name'),
									action: 'getSentMailByUser'
								},
								callback: function (recs, ope, success){
								}
							});
						}
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-memberNameForMail');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'fieldcontainer',
			flex: 4,
			layout: 'vbox',
			items: [{
				title: '收件箱',
				id: 'gridpanel-receivedBox',
				name: 'gridpanel-receivedBox',
				xtype: 'gridpanel',
				flex: 2,
				width: '100%',
				tbar: [{
					xtype: 'button',
					icon: './resources/img/preview2.png',
					text: '查看',
					handler: function (){
						var grid = Ext.getCmp('gridpanel-receivedBox'),
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
					xtype:'actioncolumn',
					flex: 0.2,
					dataIndex: 'isRead',
					items: [{
						handler: function (view, rowIndex, colIndex, item, e, rec, row){
							if (rec.get('isRead') == 'false') {
								showMsg('置为已读！');
							}
						},
						getClass: function (v, meta, rec){
							if (rec.get('isRead') == 'true') {
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
					autoLoad: false
				})
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
					autoLoad: false
				})
			}]
		}];

		this.callParent();
	}
});