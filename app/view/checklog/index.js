Ext.define('FamilyDecoration.view.checklog.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checklog-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.view.checklog.UserLogList',
		'FamilyDecoration.store.ScrutinizeList',
		'FamilyDecoration.view.mylog.Index'
	],
	autoScroll: true,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	logListId: undefined,
	userName: undefined,

	initComponent: function () {
		var me = this;
		me.items = [
			{
				xtype: 'container',
				margin: '0 1 0 0',
				flex: 1,
				layout: 'fit',
				hidden: me.userName ? true : false,
				items: [
					{
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
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0],
									logPane = me.down('mylog-index');
								if (rec && rec.get('level') && rec.get('name')) {
									logPane.staff = rec;
									logPane.setLogContentRenderMode();
								}
								else {
									logPane.staff = undefined;
									logPane.setLogContentRenderMode();
								}
							},
							load: function () {
								var treepanel = Ext.getCmp('treepanel-memberName');
								treepanel.expandAll();
							}
						}
					}
				]
			},
			{
				xtype: 'mylog-index',
				flex: 6,
				checkMode: true,
				staff: undefined
			}
		];

		this.callParent();
	}
});