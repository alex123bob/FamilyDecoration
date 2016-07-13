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

		function getRes() {
			var logContentPane = me.down('mylog-logcontent'),
				quarterPane = me.down('[name="gridpanel-quarterMonths"]'),
				frozenPane = me.down('[name="gridpanel-frozenMonths"]');

			return {
				quarterPane: quarterPane,
				logContentPane: logContentPane,
				frozenPane: frozenPane
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
				defaults: {
					xtype: 'gridpanel',
					flex: 1,
					autoScroll: true,
					width: '100%',
					hideHeaders: true,
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
					]
				},
				items: [
					{
						title: '季度月份',
						name: 'gridpanel-quarterMonths',
						store: Ext.create('Ext.data.Store', {
							autoLoad: true,
							fields: [
								{name: 'year', type: 'string', mapping: 'y'},
								{name: 'month', type: 'string', mapping: 'm'}
							],
							proxy: {
								type: 'rest',
								reader: {
									type: 'json'
								},
								url: './libs/api.php?action=LogList.getMonths'
							}
						}),
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0],
									resObj = getRes();
								if (rec) {
									resObj.frozenPane.getSelectionModel().deselectAll();
								}
								resObj.logContentPane.refresh(rec);
							}
						}
					},
					{
						name: 'gridpanel-frozenMonths',
						title: '封存日志',
						store: Ext.create('Ext.data.Store', {
							autoLoad: true,
							fields: [
								{name: 'year', type: 'string', mapping: 'y'},
								{name: 'month', type: 'string', mapping: 'm'}
							],
							proxy: {
								type: 'rest',
								reader: {
									type: 'json'
								},
								url: './libs/api.php?action=LogList.getOldMonths'
							}
						}),
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0],
									resObj = getRes();
								if (rec) {
									resObj.quarterPane.getSelectionModel().deselectAll();
								}
								resObj.logContentPane.refresh(rec);
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