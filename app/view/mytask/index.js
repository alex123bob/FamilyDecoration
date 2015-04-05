Ext.define('FamilyDecoration.view.mytask.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mytask-index',
	requires: [
		'FamilyDecoration.view.mylog.LogList', 'FamilyDecoration.view.mylog.EditLogDetail',
		'FamilyDecoration.store.ScrutinizeList', 'FamilyDecoration.view.mylog.AskLeave'
	],
	autoScroll: true,
	layout: 'border',

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			region: 'west',
			layout: 'fit',
			width: 200,
			margin: '0 1 0 0',
			items: [{
				xtype: 'mylog-loglist',
				title: '任务查看',
				id: 'treepanel-checkTask',
				name: 'treepanel-checkTask',
				isQuarter: true,
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						
					},
					load: function (){
						var treePanel = Ext.getCmp('treepanel-checkTask');
						treePanel.expandAll();
					}
				}
			}]
		}, {
			region: 'center',
			xtype: 'container',
			layout: 'vbox',
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
					disabled: true,
					handler: function (){
						var tree = Ext.getCmp('treepanel-logName'),
							logItem = tree.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mylog.EditLogDetail', {
							logListId: logItem.getId()
						});
						win.show();
					}
				}, {
					text: '修改',
					id: 'button-editLogDetail',
					name: 'button-editLogDetail',
					disabled: true,
					handler: function (){
						var tree = Ext.getCmp('treepanel-logName'),
							grid = Ext.getCmp('gridpanel-logDetail'),
							logItem = tree.getSelectionModel().getSelection()[0],
							logDetailItem = grid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mylog.EditLogDetail', {
							logListId: logItem.getId(),
							logObj: logDetailItem
						});
						win.show();
					}
				}, {
					text: '删除',
					id: 'button-deleteLogDetail',
					name: 'button-deleteLogDetail',
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
			        	text: '创建日期', 
			        	dataIndex: 'createTime', 
			        	flex: 1
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
					dataIndex: 'userName',
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