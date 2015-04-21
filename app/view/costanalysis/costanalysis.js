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
				dataIndex: 'workCategory',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 1,
				sortable: false
			},
			{
				text: '人工',
				dataIndex: 'manpowerTotalCostForWorkCategory',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 1,
				sortable: false
			},
			{
				text: '主材',
				dataIndex: 'mainMaterialTotalCostForWorkCategory',
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