Ext.define('FamilyDecoration.view.taskassign.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.taskassign-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.view.taskassign.UserTaskList',
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
				id: 'treepanel-taskMemberName',
				name: 'treepanel-taskMemberName',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('level') && rec.get('name')) {
							var userTaskPanel = Ext.getCmp('treepanel-taskNameByUser'),
								st = userTaskPanel.getStore(),
								taskDetailPanel = Ext.getCmp('panel-taskDetailByUser');

							userTaskPanel.getSelectionModel().deselectAll();

							userTaskPanel.userName = rec.get('name');
							st.proxy.url = './libs/tasklist.php';
							st.proxy.extraParams = {
								action: 'getTaskListYearsByUser',
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
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-taskMemberName');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 1,
			layout: 'fit',
			margin: '0 1 0 0',
			items: [{
				xtype: 'taskassign-usertasklist',
				title: '任务目录',
				id: 'treepanel-taskNameByUser',
				name: 'treepanel-taskNameByUser',
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
							userTaskPanel = Ext.getCmp('panel-taskDetailByUser'),
							userTaskProcessPanel = Ext.getCmp('panel-taskProcess'),
							scrutinizeGrid = Ext.getCmp('gridpanel-scrutinizeForCheckLog'),
							st = scrutinizeGrid.getStore();
						
						if (rec) {
							userTaskPanel.refresh(rec);
							userTaskProcessPanel.refresh(rec);
						}
						else {
							st.removeAll();
						}
						
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-taskNameByUser');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 4,
			layout: 'border',
			items: [{
				xtype: 'panel',
				id: 'panel-taskDetailByUser',
				name: 'panel-taskDetailByUser',
				title: '任务内容',
				autoRender: true,
				width: 300,
				height: 320,
				autoScroll: true,
				margin: '0 1 0 0',
				region: 'west',
				refresh: function (rec){
					if (rec) {
						this.body.update(rec.get('taskContent'));
					}
				}
			}, {
				xtype: 'panel',
				title: '完成情况',
				region: 'center',
				id: 'panel-taskProcess',
				name: 'panel-taskProcess',
				refresh: function (rec){
					if (rec) {
						this.body.update(rec.get('taskProcess'));
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
				region: 'south',
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
				height: 300,
				title: '批阅内容'
			}]
		}];

		this.callParent();
	}
});