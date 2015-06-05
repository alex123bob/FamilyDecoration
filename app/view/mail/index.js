Ext.define('FamilyDecoration.view.mail.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mail-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList'
	],
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
				id: 'treepanel-memberNameForMail',
				name: 'treepanel-memberNameForMail',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('level') && rec.get('name')) {
							
						}
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-memberNameForMail');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 4,
			layout: 'border',
			items: [{
				title: '发送平台',
				xtype: 'panel',
				region: 'center',
				html: '开发中'
			}]
		}];

		this.callParent();
	}
});