Ext.define('FamilyDecoration.view.suppliermanagement.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.suppliermanagement-index',
	requires: [
		'FamilyDecoration.store.Supplier'
	],
	layout: 'hbox',
	defaults: {
		height: '100%'
	},

	initComponent: function () {
		var me = this;
		
		function _getRes (){

		}

		me.items = [
			{
				xtype: 'gridpanel',
				flex: 1,
				title: '供应商列表',
				autoScroll: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				store: Ext.create('FamilyDecoration.store.Supplier', {
					autoLoad: false
				}),
				columns: [
					{
						text: '姓名',
						flex: 1,
						align: 'center'
					}
				],
				hideHeaders: true,
				tbar: [
					{
						xtype: 'button',
						text: '增加',
						name: 'add',
						icon: 'resources/img/supplier_add.png'
					},
					{
						xtype: 'button',
						text: '修改',
						name: 'edit',
						icon: 'resources/img/supplier_edit.png'
					}
				],
				bbar: [
					{
						xtype: 'button',
						text: '删除',
						name: 'del',
						icon: 'resources/img/supplier_delete.png'
					}
				],
				_getBtns: function (){
					var tbar = this.getDockedItems('toolbar[dock="top"]'),
						bbar = this.getDockedItems('toolbar[dock="bottom"]');
				},
				listeners: {
					afterrender: function (grid, opts){
						grid._getBtns();
					}
				}
			},
			{
				xtype: 'tabpanel',
				flex: 4,
				items: [
					{
						title: '材料'
					},
					{
						title: '订购单列表'
					},
					{
						title: '付款单审核'
					}
				]
			}
		];

		this.callParent();
	}
});