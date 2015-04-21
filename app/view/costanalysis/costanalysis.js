Ext.define('FamilyDecoration.view.costanalysis.CostAnalysis', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.costanalysis-costanalysis',

	requires: ['FamilyDecoration.store.CostAnalysis'],

	title: '成本分析',

	refresh: function (){
		var me = this,
			st = me.getStore();
		st.load();
	},

	initComponent: function (){
		var me = this;

		me.store = Ext.create('FamilyDecoration.store.CostAnalysis', {
			autoLoad: false
		});

		me.columns = [
			{
				text: '工种\\成本',
				dataIndex: 'name',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 1,
				sortable: false,
				renderer: function (val){
					return FamilyDecoration.store.WorkCategory.renderer(val);
				}
			},
			{
				text: '人工',
				dataIndex: 'manpowerCost',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 1,
				sortable: false
			},
			{
				text: '主材',
				dataIndex: 'mainMaterialCost',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 1,
				sortable: false
			}
		];

		me.callParent();
	}
});