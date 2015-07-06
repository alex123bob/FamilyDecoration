Ext.define('FamilyDecoration.view.mylog.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mylog-index',
	requires: [
		'FamilyDecoration.view.mylog.LogList', 'FamilyDecoration.view.mylog.EditLogDetail',
		'FamilyDecoration.store.ScrutinizeList', 'FamilyDecoration.view.mylog.AskLeave'
	],
	layout: 'border',

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			region: 'west',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			width: 200,
			margin: '0 1 0 0',
			items: [{
				xtype: 'mylog-loglist',
				title: '本季度日志',
				id: 'treepanel-logName',
				name: 'treepanel-logName',
				isQuarter: true,
				tbar: [{
					text: '添加日志',
					icon: './resources/img/add1.png',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '新建日志',
							width: 300,
							height: 200,
							modal: true,
							items: [{
								xtype: 'datefield',
						        fieldLabel: '日志日期',
						        name: 'datefield-logDate',
						        id: 'datefield-logDate',
						        value: new Date(),
						        format: 'Y/m/d',
						        editable: false,
						        allowBlank: false,
						        maxValue: new Date()
							}, {
								xtype: 'textfield',
								fieldLabel: '日志主题',
								name: 'textfield-logTheme',
								id: 'textfield-logTheme',
								allowBlank: false
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var date = Ext.getCmp('datefield-logDate'),
										theme = Ext.getCmp('textfield-logTheme');
									if (date.isValid() && theme.isValid()) {
										Ext.Ajax.request({
											url: 'libs/loglist.php?action=addLogList',
											params: {
												logName: theme.getValue(),
												userName: User.name,
												createTime: Ext.Date.format(date.getValue(), 'Y-m-d')
											},
											method: 'POST',
											callback: function (opts, success, res){
												if (success) {
													var obj = Ext.decode(res.responseText),
														tree = Ext.getCmp('treepanel-logName'),
														frozenTree = Ext.getCmp('treepanel-frozenLogName'),
														st = tree.getStore(),
														frozenSt = frozenTree.getStore(),
														delBtn = Ext.getCmp('button-deleteLog');
													if (obj.status == 'successful') {
														showMsg('日志' + theme.getValue() + '提交成功！');
														st.proxy.url = 'libs/loglist.php?action=getLogListYears&isQuarter=true';
														st.proxy.extraParams = {};
														frozenSt.proxy.url = 'libs/loglist.php?action=getLogListYears';
														frozenSt.proxy.extraParams = {};
														st.load({
															node: st.getRootNode(),
															callback: function (){
																tree.getSelectionModel().deselectAll();
																delBtn.disable();
															}
														});
														frozenSt.load({
															node: frozenSt.getRootNode(),
															callback: function (){
																frozenTree.getSelectionModel().deselectAll();
															}
														})
														win.close();
													}
												}
											}
										});
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
					text: '删除日志',
					disabled: true,
					icon: 'resources/img/delete1.png',
					name: 'button-deleteLog',
					id: 'button-deleteLog',
					handler: function (){
						var tree = Ext.getCmp('treepanel-logName'),
							grid = Ext.getCmp('gridpanel-logDetail'),
							st = tree.getStore(),
							rec = tree.getSelectionModel().getSelection()[0];
						if (rec.get('logName')) {
							Ext.Msg.warning('删除日志主题，会删除其下的所有日志。确定删除吗？', function (btn){
								if (btn == 'yes') {
									Ext.Ajax.request({
										url: 'libs/loglist.php?action=deleteLogList',
										params: {
											id: rec.getId()
										},
										method: 'POST',
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('删除' + rec.get('logName') + '成功！');
													st.proxy.url = 'libs/loglist.php?action=getLogListYears&isQuarter=true';
													st.proxy.extraParams = {};
													st.load({
														node: st.getRootNode(),
														callback: function (){
															tree.getSelectionModel().deselectAll();
															grid.refresh();
														}
													});
													Ext.Ajax.request({
														url: './libs/censorship.php?action=deleteCensorshipByLogListId',
														params: {
															logListId: rec.getId()
														},
														method: 'POST',
														callback: function (opts, success, res){
															if (success) {
																var obj = Ext.decode(res.responseText);
																if (obj.status == 'successful') {
																	// showMsg('删除【' + rec.get('logName') + '】下的批阅内容成功！');
																}
															}
														}
													})
												}
											}
										}
									});
								}
							});
						}
						else {
							// todo
						}
					}
				}],
				flex: 4,
				width: '100%',
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							btnDelLog = Ext.getCmp('button-deleteLog'),
							btnAddLogDetail = Ext.getCmp('button-addLogDetail'),
							btnAskLeave = Ext.getCmp('button-askLeave'),
							gridLogContent = Ext.getCmp('gridpanel-logDetail'),
							frozenTree = Ext.getCmp('treepanel-frozenLogName'),
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
							else {
								st.removeAll();
							}
							btnDelLog.setDisabled(!rec.get('logName'));
							btnAddLogDetail.setDisabled(!rec.get('logName'));
							btnAskLeave.setDisabled(!rec.get('logName'));
							frozenTree.getSelectionModel().deselectAll();
						}
						else {
							st.removeAll();
							btnDelLog.disable();
							btnAddLogDetail.disable();
							btnAskLeave.disable();
						}
					},
					load: function (){
						var treePanel = Ext.getCmp('treepanel-logName');
						treePanel.expandAll();
					}
				}
			}, {
				xtype: 'mylog-loglist',
				id: 'treepanel-frozenLogName',
				name: 'treepanel-frozenLogName',
				title: '封存日志',
				flex: 2,
				width: '100%',
				autoScroll: true,
				listeners: {
					selectionchange: function (selModel, sels, opts){
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
			}]
		}, {
			region: 'center',
			xtype: 'container',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			items: [{
				xtype: 'gridpanel',
				id: 'gridpanel-logDetail',
				name: 'gridpanel-logDetail',
				title: '日志内容',
				flex: 4,
				width: '100%',
				refresh: function (rec){
					var grid = this,
						btnEditLogDetail = Ext.getCmp('button-editLogDetail'),
						btnDelLogDetail = Ext.getCmp('button-deleteLogDetail');
					if (rec) {
						Ext.Ajax.request({
							url: 'libs/loglist.php?action=getLogDetailsByLogListId',
							params: {
								logListId: rec.getId()
							},
							method: 'GET',
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									grid.getStore().loadData(obj);
								}
							}
						});
					}
					else {
						grid.getStore().loadData([]);
					}
					btnEditLogDetail.disable();
					btnDelLogDetail.disable();
				},
				tbar: [{
					text: '增加',
					id: 'button-addLogDetail',
					name: 'button-addLogDetail',
					icon: './resources/img/add.png',
					disabled: true,
					handler: function (){
						var tree = Ext.getCmp('treepanel-logName'),
							logItem = tree.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mylog.EditLogDetail', {
							logListId: logItem.getId(),
							afterEvent: function (){
								var logNamePanel = Ext.getCmp('treepanel-logName'),
									logDetailGrid = Ext.getCmp('gridpanel-logDetail');
								logNamePanel.getStore().load({
									node: logNamePanel.getRootNode(),
									params: {
										action: 'getLogListYears'
									},
									callback: function (recs, ope, success){
										if (success) {
											logDetailGrid.getSelectionModel().deselectAll();
										}
									}
								});
							}
						});
						win.show();
					}
				}, {
					text: '修改',
					id: 'button-editLogDetail',
					name: 'button-editLogDetail',
					icon: './resources/img/edit.png',
					disabled: true,
					handler: function (){
						var tree = Ext.getCmp('treepanel-logName'),
							grid = Ext.getCmp('gridpanel-logDetail'),
							logItem = tree.getSelectionModel().getSelection()[0],
							logDetailItem = grid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mylog.EditLogDetail', {
							logListId: logItem.getId(),
							logObj: logDetailItem,
							afterEvent: function (){
								var logNamePanel = Ext.getCmp('treepanel-logName'),
									logDetailGrid = Ext.getCmp('gridpanel-logDetail');
								logNamePanel.getStore().getProxy().extraParams = {};
								logNamePanel.getStore().load({
									node: logNamePanel.getRootNode(),
									params: {
										action: 'getLogListYears'
									},
									callback: function (recs, ope, success){
										if (success) {
											logDetailGrid.getSelectionModel().deselectAll();
										}
									}
								});

							}
						});
						win.show();
					}
				}, {
					text: '删除',
					id: 'button-deleteLogDetail',
					name: 'button-deleteLogDetail',
					icon: './resources/img/delete.png',
					disabled: true,
					handler: function (){
						var grid = Ext.getCmp('gridpanel-logDetail'),
							tree = Ext.getCmp('treepanel-logName'),
							rec = tree.getSelectionModel().getSelection()[0],
							logItem = grid.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要删除该条日志吗？', function (btn){
							if ('yes' == btn) {
								Ext.Ajax.request({
									url: 'libs/loglist.php?action=deleteLogDetail',
									params: {
										logDetailId: logItem.getId()
									},
									method: 'POST',
									logDetailId: logItem.getId(),
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												grid.refresh(rec);
											}
										}
									}
								});
							}
						})
					}
				}, {
					text: '请假申请',
					id: 'button-askLeave',
					name: 'button-askLeave',
					hidden: true,
					disabled: true,
					handler: function (){
						var tree = Ext.getCmp('treepanel-logName'),
							logItem = tree.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mylog.AskLeave', {
							logListId: logItem.getId()
						});
						win.show();
					}
				}],
				store: Ext.create('Ext.data.Store', {
					fields: ['content', 'id', 'createTime', 'logType'],
					autoLoad: false
				}),
				columns: [
			        {
			        	text: '日志内容', 
			        	dataIndex: 'content', 
			        	flex: 1,
			        	renderer: function (val, meta, rec){
			        		if (rec.get('logType') == 1) {
			        			meta.style = 'background: lightpink;';
			        		}
			        		return val.replace(/\n/g, '<br />');
			        	}
			        },
			        {
			        	text: '创建日期', 
			        	dataIndex: 'createTime', 
			        	flex: 1,
			        	renderer: function (val, meta, rec){
			        		if (rec.get('logType') == 1) {
			        			meta.style = 'background: lightpink;';
			        		}
			        		return val;
			        	}
			        }
			    ],
			    listeners: {
			    	selectionchange: function (view, sels){
			    		var rec = sels[0],
			    			btnEditLogDetail = Ext.getCmp('button-editLogDetail'),
			    			btnDelLogDetail = Ext.getCmp('button-deleteLogDetail'),
			    			tree = Ext.getCmp('treepanel-logName'),
			    			frozenTree = Ext.getCmp('treepanel-frozenLogName');
			    		if (tree.getSelectionModel().getSelection().length > 0) {
			    			btnEditLogDetail.setDisabled(!rec);
			    			btnDelLogDetail.setDisabled(!rec);
			    		}
			    		else if (frozenTree.getSelectionModel().getSelection().length > 0) {
			    			btnEditLogDetail.disable();
			    			btnDelLogDetail.disable();
			    		}
			    	}
			    }
			}, {
				xtype: 'gridpanel',
				id: 'gridpanel-scrutinize',
				name: 'gridpanel-scrutinize',
				store: Ext.create('FamilyDecoration.store.ScrutinizeList', {
					autoLoad: false
				}),
				// hideHeaders: true,
				columns: [{
					text: '批阅内容',
					dataIndex: 'scrutinizeContent',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false,
					renderer: function (val){
						return val.replace(/\n/ig, '<br />');
					}
				}, {
					text: '批阅人',
					dataIndex: 'realName',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false
				}, {
					text: '批阅时间',
					dataIndex: 'scrutinizeTime',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false
				}],
				width: '100%',
				title: '批阅内容',
				flex: 2
			}]
		}];

		this.callParent();
	}
});