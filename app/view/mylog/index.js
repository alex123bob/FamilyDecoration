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
	checkMode: undefined,
	staff: undefined,

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

		me.setLogContentRenderMode = function () {
			var logContentRenderMode,
				resObj = getRes();
			if (me.checkMode) {
				if (me.staff) {
					// market deparment
					if (/^004-\d{3}$/i.test(me.staff.get('level'))) {
						logContentRenderMode = 'market';
					}
					// design department
					else if (/^002-\d{3}$/i.test(me.staff.get('level'))) {
						logContentRenderMode = 'design';
					}
					else {
						logContentRenderMode = undefined;
					}
				}
				else {
					logContentRenderMode = undefined;
				}
			}
			else {
				if (User.isBusinessManager() || User.isBusinessStaff()) {
					logContentRenderMode = 'market';
				}
				else if (User.isDesignManager() || User.isDesignStaff()) {
					logContentRenderMode = 'design';
				}
				else {
					logContentRenderMode = undefined;
				}
			}

			if (!me.checkMode || me.staff) {
				resObj.quarterPane.getStore().reload();
				resObj.frozenPane.getStore().reload();
			}
			else {
				resObj.quarterPane.getStore().removeAll();
				resObj.frozenPane.getStore().removeAll();
			}

			resObj.logContentPane.staff = me.staff;
			resObj.logContentPane.renderMode = logContentRenderMode;
			resObj.logContentPane.rerender();
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
				width: 150,
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
							autoLoad: false,
							fields: [
								{ name: 'year', type: 'string', mapping: 'y' },
								{ name: 'month', type: 'string', mapping: 'm' },
								{ name: 'isFrozen', mapping: 'f' } // 0: not-frozen, 1: frozen
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
						title: '封存日志',
						flex: 2,
						name: 'gridpanel-frozenMonths',
						store: Ext.create('Ext.data.Store', {
							autoLoad: false,
							fields: [
								{ name: 'year', type: 'string', mapping: 'y' },
								{ name: 'month', type: 'string', mapping: 'm' },
								{ name: 'isFrozen', mapping: 'f' } // 0: not-frozen, 1: frozen
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
				renderMode: undefined,
				checkMode: me.checkMode,
				staff: me.staff
			}
		];

		me.addListener('afterrender', function (cmp, opts){
			!me.checkMode && me.setLogContentRenderMode();
		});

		this.callParent();
	}
});