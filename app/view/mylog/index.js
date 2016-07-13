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
		var me = this,
			logContentRenderMode;

		function getRes (){
			var logContentPane = me.down('mylog-logcontent'),
				quarterPane = me.down('[name="gridpanel-quarterMonths"]');

			return {
				quarterPane: quarterPane,
				logContentPane: logContentPane
			};
		}
		
		if (User.isBusinessManager() || User.isBusinessStaff()) {
			logContentRenderMode = 'market';
		}
		else if (User.isDesignManager() || User.isDesignStaff()) {
			logContentRenderMode = 'design';
		}
		else {
			logContentRenderMode = undefined;
		}

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
					{
						xtype: 'gridpanel',
						flex: 2,
						autoScroll: true,
						width: '100%',
						title: '季度月份',
						name: 'gridpanel-quarterMonths',
						columns: [
							{
								text: '年份',
								dataIndex: 'year',
								flex: 1,
								align: 'center'
							},
							{
								text: '月份',
								dataIndex: 'month',
								flex: 1,
								align: 'center'
							}
						],
						store: Ext.create('Ext.data.Store', {
							autoLoad: true,
							fields: ['year', 'month'],
							proxy: {
								type: 'rest',
								reader: {
									type: 'json'
								},
								url: './libs/api.php?action=LogList.getMonths'
							}
						}),
						hideHeaders: true,
						listeners: {
							selectionchange: function (selModel, sels, opts){
								var rec = sels[0],
									resObj = getRes();
								resObj.logContentPane.refresh(rec);
							}
						}
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
				renderMode: logContentRenderMode
			}
		];

		this.callParent();
	}
});