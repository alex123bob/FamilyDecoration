Ext.define('FamilyDecoration.view.mylog.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mylog-index',
	requires: [
		'FamilyDecoration.view.mylog.LogList', 'FamilyDecoration.view.mylog.EditLogDetail',
		'FamilyDecoration.store.ScrutinizeList', 'FamilyDecoration.view.mylog.AskLeave',
		'FamilyDecoration.view.mylog.LogContent'
	],
	layout: 'border',
	logListId: undefined,

	initComponent: function () {
		var me = this;
		me.items = [
			{
				xtype: 'container',
				region: 'west',
				hidden: me.logListId ? true : false,
				layout: {
					type: 'vbox',
					align: 'center'
				},
				width: 200,
				margin: '0 1 0 0',
				items: [
					// {
					// 	xtype: 'mylog-loglist',
					// 	title: '本季度日志',
					// 	id: 'treepanel-logName',
					// 	name: 'treepanel-logName',
					// 	logListId: me.logListId,
					// 	isQuarter: true,
					// 	tbar: [
					// 		{
					// 			text: '添加日志',
					// 			icon: './resources/img/add1.png',
					// 			handler: function () {
					// 				var win = Ext.create('Ext.window.Window', {
					// 					title: '新建日志',
					// 					width: 300,
					// 					height: 200,
					// 					modal: true,
					// 					items: [
					// 						{
					// 							xtype: 'datefield',
					// 							fieldLabel: '日志日期',
					// 							name: 'datefield-logDate',
					// 							id: 'datefield-logDate',
					// 							value: new Date(),
					// 							format: 'Y/m/d',
					// 							editable: false,
					// 							allowBlank: false,
					// 							maxValue: new Date()
					// 						},
					// 						{
					// 							xtype: 'textfield',
					// 							fieldLabel: '日志主题',
					// 							name: 'textfield-logTheme',
					// 							id: 'textfield-logTheme',
					// 							allowBlank: false
					// 						}
					// 					],
					// 					buttons: [
					// 						{
					// 							text: '确定',
					// 							handler: function () {
					// 								var date = Ext.getCmp('datefield-logDate'),
					// 									theme = Ext.getCmp('textfield-logTheme');
					// 								if (date.isValid() && theme.isValid()) {
					// 									Ext.Ajax.request({
					// 										url: 'libs/loglist.php?action=addLogList',
					// 										params: {
					// 											logName: theme.getValue(),
					// 											userName: User.name,
					// 											createTime: Ext.Date.format(date.getValue(), 'Y-m-d')
					// 										},
					// 										method: 'POST',
					// 										callback: function (opts, success, res) {
					// 											if (success) {
					// 												var obj = Ext.decode(res.responseText),
					// 													tree = Ext.getCmp('treepanel-logName'),
					// 													frozenTree = Ext.getCmp('treepanel-frozenLogName'),
					// 													st = tree.getStore(),
					// 													frozenSt = frozenTree.getStore(),
					// 													delBtn = Ext.getCmp('button-deleteLog');
					// 												if (obj.status == 'successful') {
					// 													showMsg('日志' + theme.getValue() + '提交成功！');
					// 													st.proxy.url = 'libs/loglist.php?action=getLogListYears&isQuarter=true';
					// 													st.proxy.extraParams = {};
					// 													frozenSt.proxy.url = 'libs/loglist.php?action=getLogListYears';
					// 													frozenSt.proxy.extraParams = {};
					// 													st.load({
					// 														node: st.getRootNode(),
					// 														callback: function () {
					// 															tree.getSelectionModel().deselectAll();
					// 															delBtn.disable();
					// 														}
					// 													});
					// 													frozenSt.load({
					// 														node: frozenSt.getRootNode(),
					// 														callback: function () {
					// 															frozenTree.getSelectionModel().deselectAll();
					// 														}
					// 													})
					// 													win.close();
					// 												}
					// 											}
					// 										}
					// 									});
					// 								}
					// 							}
					// 						},
					// 						{
					// 							text: '取消',
					// 							handler: function () {
					// 								win.close();
					// 							}
					// 						}
					// 					]
					// 				});
					// 				win.show();
					// 			}
					// 		},
					// 		{
					// 			text: '删除日志',
					// 			disabled: true,
					// 			icon: 'resources/img/delete1.png',
					// 			name: 'button-deleteLog',
					// 			id: 'button-deleteLog',
					// 			handler: function () {
					// 				var tree = Ext.getCmp('treepanel-logName'),
					// 					grid = Ext.getCmp('gridpanel-logDetail'),
					// 					st = tree.getStore(),
					// 					rec = tree.getSelectionModel().getSelection()[0];
					// 				if (rec.get('logName')) {
					// 					Ext.Msg.warning('删除日志主题，会删除其下的所有日志。确定删除吗？', function (btn) {
					// 						if (btn == 'yes') {
					// 							Ext.Ajax.request({
					// 								url: 'libs/loglist.php?action=deleteLogList',
					// 								params: {
					// 									id: rec.getId()
					// 								},
					// 								method: 'POST',
					// 								callback: function (opts, success, res) {
					// 									if (success) {
					// 										var obj = Ext.decode(res.responseText);
					// 										if (obj.status == 'successful') {
					// 											showMsg('删除' + rec.get('logName') + '成功！');
					// 											st.proxy.url = 'libs/loglist.php?action=getLogListYears&isQuarter=true';
					// 											st.proxy.extraParams = {};
					// 											st.load({
					// 												node: st.getRootNode(),
					// 												callback: function () {
					// 													tree.getSelectionModel().deselectAll();
					// 													grid.refresh();
					// 												}
					// 											});
					// 											Ext.Ajax.request({
					// 												url: './libs/censorship.php?action=deleteCensorshipByLogListId',
					// 												params: {
					// 													logListId: rec.getId()
					// 												},
					// 												method: 'POST',
					// 												callback: function (opts, success, res) {
					// 													if (success) {
					// 														var obj = Ext.decode(res.responseText);
					// 														if (obj.status == 'successful') {
					// 															// showMsg('删除【' + rec.get('logName') + '】下的批阅内容成功！');
					// 														}
					// 													}
					// 												}
					// 											})
					// 										}
					// 									}
					// 								}
					// 							});
					// 						}
					// 					});
					// 				}
					// 				else {
					// 					// todo
					// 				}
					// 			}
					// 		}
					// 	],
					// 	flex: 4,
					// 	width: '100%',
					// 	autoScroll: true,
					// 	listeners: {
					// 		itemclick: function (view, rec) {
					// 		},
					// 		selectionchange: function (selModel, sels, opts) {
					// 			var rec = sels[0],
					// 				btnDelLog = Ext.getCmp('button-deleteLog'),
					// 				btnAddLogDetail = Ext.getCmp('button-addLogDetail'),
					// 				btnAskLeave = Ext.getCmp('button-askLeave'),
					// 				gridLogContent = Ext.getCmp('gridpanel-logDetail'),
					// 				frozenTree = Ext.getCmp('treepanel-frozenLogName'),
					// 				scrutinizeGrid = Ext.getCmp('gridpanel-scrutinize'),
					// 				st = scrutinizeGrid.getStore();
					// 			gridLogContent.refresh(rec);
					// 			if (rec) {
					// 				if (rec.get('logName')) {
					// 					st.reload({
					// 						params: {
					// 							logListId: rec.getId()
					// 						}
					// 					});
					// 				}
					// 				else {
					// 					st.removeAll();
					// 				}
					// 				btnDelLog.setDisabled(!rec.get('logName'));
					// 				btnAddLogDetail.setDisabled(!rec.get('logName'));
					// 				btnAskLeave.setDisabled(!rec.get('logName'));
					// 				frozenTree.getSelectionModel().deselectAll();
					// 			}
					// 			else {
					// 				st.removeAll();
					// 				btnDelLog.disable();
					// 				btnAddLogDetail.disable();
					// 				btnAskLeave.disable();
					// 			}
					// 		},
					// 		load: function () {
					// 			var treePanel = Ext.getCmp('treepanel-logName');
					// 			treePanel.expandAll(function (arr) {
					// 				var rec = treePanel.getRootNode().findChild('logListId', me.logListId, true);
					// 				if (rec) {
					// 					treePanel.getSelectionModel().select(rec);
					// 				}
					// 			});
					// 		}
					// 	}
					// },
					{
						xtype: 'gridpanel',
						flex: 2,
						autoScroll: true,
						width: '100%',
						title: '季度月份',
						columns: [
							{
								text: '月份',
								dataIndex: 'month',
								flex: 1,
								align: 'center'
							}
						],
						store: Ext.create('Ext.data.Store', {
							autoLoad: true,
							fields: ['month'],
							proxy: {
								type: 'rest',
								reader: {
									type: 'json'
								},
								url: './libs/api.php?action=LogList.getMonths'
							}
						}),
						hideHeaders: true
					},
					{
						hidden: me.logListId ? true : false,
						xtype: 'mylog-loglist',
						id: 'treepanel-frozenLogName',
						name: 'treepanel-frozenLogName',
						title: '封存日志',
						flex: 2,
						width: '100%',
						autoScroll: true,
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0],
									btnDelLog = Ext.getCmp('button-deleteLog'),
									btnAddLogDetail = Ext.getCmp('button-addLogDetail'),
									gridLogContent = Ext.getCmp('gridpanel-logDetail'),
									tree = Ext.getCmp('treepanel-logName'),
									scrutinizeGrid = Ext.getCmp('gridpanel-scrutinize'),
									st = scrutinizeGrid.getStore();
								gridLogContent.refresh(rec);
								if (rec) {
									if (rec.get('logName')) {
										st.reload({
											params: {
												logListId: rec.getId()
											}
										});
									}
									tree.getSelectionModel().deselectAll();
								}
							}
						}
					}
				]
			},
			{
				region: 'center',
				xtype: 'mylog-logcontent',
				renderMode: 'market'
			}
		];

		this.callParent();
	}
});