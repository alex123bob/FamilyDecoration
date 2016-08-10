Ext.define('FamilyDecoration.view.targetsetting.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.targetsetting-index',
	requires: [
		'FamilyDecoration.view.targetsetting.TargetBoard'
	],
	autoScroll: true,
	refresh: Ext.emptyFn,
    title: '目标制定',
	layout: 'hbox',
	defaults: {
		height: '100%' 
	},

	initComponent: function () {
		var me = this;

		function _getRes (){
			var depaGrid = me.down('[name="gridpanel-department"]'),
				targetGrid = me.down('targetsetting-targetboard');

			return {
				depaGrid: depaGrid,
				targetGrid: targetGrid
			};
		}

		me.items = [
			{
				xtype: 'gridpanel',
				name: 'gridpanel-department',
				title: '部门',
				flex: 1,
				hideHeaders: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				columns: {
					defaults: {
						flex: 1,
						align: 'center'
					},
					items: [
						{
							text: '部门',
							dataIndex: 'name'
						}
					]
				},
				store: Ext.create('Ext.data.Store', {
					autoLoad: true,
					fields: ['name', 'value'],
					proxy: {
						type: 'memory',
						reader: {
							type: 'json'
						}
					},
					data: [
						{
							name: '市场部',
							value: 'marketDepartment'
						},
						{
							name: '设计部',
							value: 'designDepartment'
						}
					]
				}),
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var depa = sels[0],
							resObj = _getRes();
						resObj.targetGrid.depa = depa;
						resObj.targetGrid.refresh(depa ? depa.get('value') : undefined);
					}
				}
			},
			{
				xtype: 'targetsetting-targetboard',
				flex: 4,
				depa: undefined
			}
		];

		me.callParent();
	}
});