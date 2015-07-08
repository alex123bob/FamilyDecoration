Ext.define('FamilyDecoration.view.signbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.signbusiness-index',
	requires: [],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;

		me.items = [];

		this.callParent();
	}
});