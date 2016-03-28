Ext.define('FamilyDecoration.view.personnel.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.personnel-index',
	requires: [
		'FamilyDecoration.view.personnel.StatisticTree'
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
				xtype: 'personnel-statistictree',
				title: '成员列表',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
				}
			}],
			height: '100%'
		}, {
			xtype: 'container',
			flex: 3,
			layout: 'vbox',
			height: '100%',
			items: [{
				xtype: 'panel',
				title: '个人情况',
				width: '100%',
				flex: 1,
				autoScroll: true,
				refresh: function (rec){
					
				},
			    listeners: {
			    	selectionchange: function (view, sels){
			    	}
			    }
			}, {
				xtype: 'panel',
				width: '100%',
				flex: 1,
				autoScroll: true,
				title: '项目情况'
			}]
		}];

		this.callParent();
	}
});