Ext.define('FamilyDecoration.view.targetsetting.Index', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.targetsetting-index',
	requires: [
	],
	autoScroll: true,
	refresh: Ext.emptyFn,
    title: '目标制定',

	initComponent: function () {
		var me = this;

		me.columns = [];

		me.callParent();
	}
});