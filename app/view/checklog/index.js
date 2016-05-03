Ext.define('FamilyDecoration.view.checklog.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checklog-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.view.checklog.UserLogList',
		'FamilyDecoration.store.ScrutinizeList'
	],
	autoScroll: true,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	logListId: undefined,
	userName: undefined,

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			margin: '0 1 0 0',
			flex: 1,
			layout: 'fit',
			hidden: me.userName ? true : false,
			items: [{
				xtype: 'checklog-memberlist',
				userName: me.userName,
				title: '成员列表',
				id: 'treepanel-memberName',
				name: 'treepanel-memberName',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				fullList: true,
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('level') && rec.get('name')) {
							var userLogPanel = Ext.getCmp('treepanel-logNameByUser'),
								frozenUserLogPanel = Ext.getCmp('treepanel-frozenLogNameByUser'),
								st = Ext.getCmp('treepanel-logNameByUser').getStore(),
								frozenSt = frozenUserLogPanel.getStore(),
								gridLogContent = Ext.getCmp('gridpanel-logDetailByUser'),
								btnCensor = Ext.getCmp('button-censorship');

							userLogPanel.getSelectionModel().deselectAll();
							frozenUserLogPanel.getSelectionModel().deselectAll();
							gridLogContent.getStore().removeAll();
							btnCensor.disable();
							userLogPanel.userName = rec.get('name');
							frozenUserLogPanel.userName = rec.get('name');
							st.proxy.url = './libs/loglist.php';
							frozenSt.proxy.url = './libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListYearsByUser',
								user: rec.get('name'),
								isQuarter: true
							};
							frozenSt.proxy.extraParams = {
								action: 'getLogListYearsByUser',
								user: rec.get('name'),
								isQuarter: false
							};
							st.load({
								node: st.getRootNode(),
								callback: function (recs, ope, success){
									if (success) {
										ope.node.expand();
									}
								}
							});
							frozenSt.load({
								node: frozenSt.getRootNode(),
								callback: function (recs, ope, success){
									if (success) {
										ope.node.expand();
									}
								}
							});
						}
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-memberName');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 1,
			layout: 'vbox',
			margin: '0 1 0 0',
			hidden: me.logListId ? true : false,
			items: [{
				xtype: 'checklog-userloglist',
				title: '本季度日志',
				id: 'treepanel-logNameByUser',
				name: 'treepanel-logNameByUser',
				isQuarter: true,
				flex: 2,
				logListId: me.logListId,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				width: '100%',
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							btnCensor = Ext.getCmp('button-censorship'),
							frozenLogPanel = Ext.getCmp('treepanel-frozenLogNameByUser'),
							gridLogContent = Ext.getCmp('gridpanel-logDetailByUser'),
							scrutinizeGrid = Ext.getCmp('gridpanel-scrutinizeForCheckLog'),
							st = scrutinizeGrid.getStore();
						gridLogContent.refresh(rec);
						if (rec) {
							btnCensor.setDisabled(!rec.get('logName'));
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
							frozenLogPanel.getSelectionModel().deselectAll();
						}
						else {
							st.removeAll();
							btnCensor.disable();
						}
						
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-logNameByUser');
						treepanel.expandAll();
					}
				}
			}, {
				hidden: me.userName || me.logListId ? true : false,
				xtype: 'checklog-userloglist',
				title: '封存日志',
				id: 'treepanel-frozenLogNameByUser',
				name: 'treepanel-frozenLogNameByUser',
				isQuarter: false,
				flex: 1,
				style: {
					borderRightWidth: '1px',
					borderRightStyle: 'solid'
				},
				width: '100%',
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							btnCensor = Ext.getCmp('button-censorship'),
							logPanel = Ext.getCmp('treepanel-logNameByUser'),
							gridLogContent = Ext.getCmp('gridpanel-logDetailByUser'),
							scrutinizeGrid = Ext.getCmp('gridpanel-scrutinizeForCheckLog'),
							st = scrutinizeGrid.getStore();
						gridLogContent.refresh(rec);
						if (rec) {
							btnCensor.setDisabled(!rec.get('logName'));
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
							logPanel.getSelectionModel().deselectAll();
						}
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 4,
			layout: 'vbox',
			items: [{
				xtype: 'gridpanel',
				id: 'gridpanel-logDetailByUser',
				name: 'gridpanel-logDetailByUser',
				title: '日志内容',
				autoScroll: true,
				flex: 2,
				width: '100%',
				refresh: function (rec){
					var grid = this;
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
				},
				tbar: [{
					text: '批阅',
					disabled: true,
					icon: './resources/img/comment.png',
					id: 'button-censorship',
					name: 'button-censorship',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '批阅内容',
							modal: true,
							width: 500,
							height: 300,
							layout: 'vbox',
							items: [{
								xtype: 'textarea',
								autoScroll: true,
								flex: 13,
								width: '100%',
								id: 'textarea-censorship',
								name: 'textarea-censorship'
							}, {
								xtype: 'checkboxfield',
								itemId: 'checkbox-sendSMS',
								name: 'checkbox-sendSMS',
								boxLabel: '短信提醒',
								hideLabel: true,
								flex: 1,
								width: '100%'
							}, {
								xtype: 'checkboxfield',
								itemId: 'checkbox-sendMail',
								name: 'checkbox-sendMail',
								boxLabel: '邮件提醒',
								hideLabel: true,
								flex: 1,
								width: '100%'
							}],
							buttons: [{
								text: '批阅',
								handler: function (){
									var textarea = Ext.getCmp('textarea-censorship'),
										content = textarea.getValue(),
										logPanel = Ext.getCmp('treepanel-logNameByUser'),
										logItem = logPanel.getSelectionModel().getSelection()[0],
										scrutinizeGrid = Ext.getCmp('gridpanel-scrutinizeForCheckLog'),
										st = scrutinizeGrid.getStore(),
										memberTree = Ext.getCmp('treepanel-memberName'),
										selMember = memberTree.getSelectionModel().getSelection()[0],
										sms = win.getComponent('checkbox-sendSMS'),
										mail = win.getComponent('checkbox-sendMail');
									if (content) {
										checkMsg({
											content: content,
											success: function (infoObj){
												Ext.Ajax.request({
													url: './libs/censorship.php?action=mark',
													method: 'POST',
													params: {
														content: content,
														logListId: logItem.getId()
													},
													callback: function (opts, success, res){
														if (success) {
															var obj = Ext.decode(res.responseText);
															if (obj.status == 'successful') {
																showMsg('批阅成功！');
																var sendContent = User.getRealName() + '批阅了您的日志"' + logItem.get('logName')
																	 + '"，批阅内容："' + content + '"；';
																sendMsg(User.getName(), selMember.get('name'), sendContent, 'checkLog', logItem.getId());
																sms.getValue() && sendSMS(User.getName(), selMember.get('name'), selMember.get('phone'), sendContent);
																mail.getValue() && sendMail(selMember.get('name'), selMember.get('mail'), User.getRealName() + '进行了"日志批阅"', sendContent)
																win.close();
																st.reload({
																	params: {
																		logListId: logItem.getId()
																	}
																});
															}
														}
													}
												});
											},
											failure: function (){
												
											}
										});
										
									}
									else {
										showMsg('请填写内容！');
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
			        	text: '创建时间', 
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
			    	}
			    }
			}, {
				xtype: 'gridpanel',
				id: 'gridpanel-scrutinizeForCheckLog',
				name: 'gridpanel-scrutinizeForCheckLog',
				store: Ext.create('FamilyDecoration.store.ScrutinizeList', {
					autoLoad: false
				}),
				autoScroll: true,
				flex: 1,
				width: '100%',
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
				title: '批阅内容'
			}]
		}];

		this.callParent();
	}
});