Ext.define('FamilyDecoration.view.leave.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.leave-index',
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
			layout: 'fit',
			width: 200,
			margin: '0 1 0 0',
			items: [{
				xtype: 'panel',
				title: '请假列表',
				tbar: [{
					text: '申请',
					icon: './resources/img/calendar.png',
					handler: function (){
					}
				}],
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
					},
					load: function (){
					}
				}
			}]
		}, {
			region: 'center',
			xtype: 'container',
			layout: 'fit',
			items: [{
				xtype: 'panel',
				title: '请假详情',
				refresh: function (rec){
				}
			}]
		}];

		this.callParent();
	}
});