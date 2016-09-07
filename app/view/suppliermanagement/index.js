Ext.define('FamilyDecoration.view.suppliermanagement.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.suppliermanagement-index',
	requires: [
		'FamilyDecoration.store.Supplier',
		'FamilyDecoration.view.suppliermanagement.SupplierList',
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
				supplier = supplierListSelModel.getSelection()[0],
				tabPanel = me.getComponent('tabpanel-container'),
				activeTab = tabPanel.getActiveTab();

			return {
				supplierList: supplierList,
				supplierListSelModel: supplierListSelModel,
				supplierListSt: supplierListSt,
				supplier: supplier,
				tabPanel: tabPanel,
				activeTab: activeTab
			};
		}

		me.items = [
			{
				xtype: 'suppliermanagement-supplierlist',
				flex: 1,
				itemId: 'gridpanel-supplierList',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
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
						disabled: true,
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
						disabled: true,
						icon: 'resources/img/supplier_delete.png',
						handler: function (){
							var resObj = _getRes();
							if (resObj.supplier) {
								Ext.Msg.warning('确定要删除当前的供应商吗？', function (btnId){
									if ('yes' == btnId) {
										ajaxDel('Supplier', {
											id: resObj.supplier.getId()
										}, function (obj){
											showMsg('删除成功！');
											resObj.supplierListSt.reload();
										});
									}
								});
							}
						}
					}
				],
				_initBtns: function (){
					var btnObj = this._getBtns(),
						resObj = _getRes();
					btnObj.edit.setDisabled(!resObj.supplier);
					btnObj.del.setDisabled(!resObj.supplier);
				},
				_getBtns: function (){
					var tbar = this.getDockedItems('toolbar[dock="top"]'),
						bbar = this.getDockedItems('toolbar[dock="bottom"]'),
						obj = {};
					tbar = tbar[0].items.items;
					bbar = bbar[0].items.items;
					obj[tbar[0].name] = tbar[0];
					obj[tbar[1].name] = tbar[1];
					obj[bbar[0].name] = bbar[0];
					return obj;
				},
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var resObj = _getRes();
						resObj.supplierList._initBtns();
						resObj.tabPanel.refresh();
					}
				}
			},
			{
				xtype: 'tabpanel',
				itemId: 'tabpanel-container',
				flex: 5,
				items: [
					{
						xtype: 'suppliermanagement-suppliermaterial'
					},
					{
						xtype: 'suppliermanagement-materialorderlist'
					}
				],
				refresh: function (){
					var resObj = _getRes();
					resObj.activeTab.refresh && resObj.activeTab.refresh(resObj.supplier);
				},
				listeners: {
					beforetabchange: function (tbpane, newCard, oldCard, opts){
						var resObj = _getRes();
						newCard.refresh && newCard.refresh(resObj.supplier);
					}
				}
			}
		];

		this.callParent();
	}
});