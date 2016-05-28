Ext.define('FamilyDecoration.view.checkbillitem.AddCheckBillItem', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.checkbillitem-addcheckbillitem',
	requires: [],
	title: '项目',
	autoScroll: true,

	initComponent: function (){
		var me = this;

		me.columns = {
			defaults: {
				flex: 1,
				align: 'center'
			},
			items: [
				{
					text: '序号'
				},
				{
					text: '项目'
				},
				{
					text: '单位'
				},
				{
					text: '数量'
				},
				{
					text: '单价(元)'
				}
			]
		};

		me.callParent();
	}
});