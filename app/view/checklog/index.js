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
				id: 'treepanel-memberName',
				name: 'treepanel-memberName',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('level') && rec.get('name')) {
							var userLogPanel = Ext.getCmp('treepanel-logNameByUser'),
								st = Ext.getCmp('treepanel-logNameByUser').getStore(),
								gridLogContent = Ext.getCmp('gridpanel-logDetailByUser'),
								btnCensor = Ext.getCmp('button-censorship');

							userLogPanel.getSelectionModel().deselectAll();
							gridLogContent.getStore().removeAll();
							btnCensor.disable();
							userLogPanel.userName = rec.get('name');
							st.proxy.url = './libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListYearsByUser',
								user: rec.get('name')
							};
							st.load({
								node: st.getRootNode(),
								callback: function (recs, ope, success){
									if (success) {
										ope.node.expand();
									}
								}
							});
						}
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 1,
			layout: 'fit',
			margin: '0 1 0 0',
			items: [{
				xtype: 'checklog-userloglist',
				title: '用户日志',
				id: 'treepanel-logNameByUser',
				name: 'treepanel-logNameByUser',
				isQuarter: true,
				flex: 4,
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
						}
						else {
							st.removeAll();
							btnCensor.disable();
						}
						
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 4,
			items: [{
				xtype: 'gridpanel',
				id: 'gridpanel-logDetailByUser',
				name: 'gridpanel-logDetailByUser',
				title: '日志内容',
				height: 400,
				autoScroll: true,
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
					id: 'button-censorship',
					name: 'button-censorship',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '批阅内容',
							modal: true,
							width: 500,
							height: 300,
							layout: 'fit',
							items: [{
								xtype: 'textarea',
								autoScroll: true,
								id: 'textarea-censorship',
								name: 'textarea-censorship'
							}],
							buttons: [{
								text: '批阅',
								handler: function (){
									var textarea = Ext.getCmp('textarea-censorship'),
										content = textarea.getValue(),
										logPanel = Ext.getCmp('treepanel-logNameByUser'),
										logItem = logPanel.getSelectionModel().getSelection()[0],
										scrutinizeGrid = Ext.getCmp('gridpanel-scrutinizeForCheckLog'),
										st = scrutinizeGrid.getStore();
									if (content) {
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
					fields: ['content', 'id', 'createTime'],
					autoLoad: false
				}),
				columns: [
			        {
			        	text: '日志内容', 
			        	dataIndex: 'content', 
			        	flex: 1,
			        	renderer: function (val){
			        		return val.replace(/\n/g, '<br />');
			        	}
			        },
			        {
			        	text: '创建时间', 
			        	dataIndex: 'createTime', 
			        	flex: 1
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