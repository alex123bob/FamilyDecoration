Ext.define('FamilyDecoration.view.suppliermanagement.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.suppliermanagement-index',
	requires: [
		'FamilyDecoration.store.Supplier',
		'FamilyDecoration.view.suppliermanagement.EditSupplier',
		'FamilyDecoration.view.suppliermanagement.SupplierMaterial',
		'FamilyDecoration.view.suppliermanagement.MaterialOrderList'
	],
	layout: 'hbox',
	defaults: {
		height: '100%'
	},

	initComponent: function () {
		var me = this;
		
		function _getRes (){
			var supplierList = me.getComponent('gridpanel-supplierList'),
				supplierListSelModel = supplierList.getSelectionModel(),
				supplierListSt = supplierList.getStore(),
				supplier = supplierListSelModel.getSelection()[0];

			return {
				supplierList: supplierList,
				supplierListSelModel: supplierListSelModel,
				supplierListSt: supplierListSt,
				supplier: supplier
			};
		}

		me.items = [
			{
				xtype: 'gridpanel',
				flex: 1,
				title: '供应商列表',
				itemId: 'gridpanel-supplierList',
				autoScroll: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				store: Ext.create('FamilyDecoration.store.Supplier', {
					autoLoad: true
				}),
				columns: [
					{
						text: '姓名',
						flex: 1,
						align: 'center',
						dataIndex: 'name'
					}
				],
				hideHeaders: true,
				tbar: [
					{
						xtype: 'button',
						text: '增加',
						name: 'add',
						icon: 'resources/img/supplier_add.png',
						handler: function (){
							var resObj = _getRes();
							var win = Ext.create('FamilyDecoration.view.suppliermanagement.EditSupplier', {
								callback: function (){
									resObj.supplierListSt.reload();
								}
							});

							win.show();
						}
					},
					{
						xtype: 'button',
						text: '修改',
						name: 'edit',
						icon: 'resources/img/supplier_edit.png',
						handler: function (){
							var resObj = _getRes();
							var win = Ext.create('FamilyDecoration.view.suppliermanagement.EditSupplier', {
								supplier: resObj.supplier,
								callback: function (){
									resObj.supplierListSt.reload({
										callback: function (recs, ope, success){
											if (success) {
												var index = resObj.supplierListSt.indexOf(resObj.supplier);
												resObj.supplierListSelModel.deselectAll();
												if (index != -1) {
													resObj.supplierListSelModel.select(index);
												}
											}
										}
									});
								}
							});

							win.show();
						}
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
						xtype: 'suppliermanagement-suppliermaterial'
					},
					{
						xtype: 'suppliermanagement-materialorderlist'
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