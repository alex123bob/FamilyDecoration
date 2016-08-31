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
					},
					afterrender: function (grid, opts){
						var view = grid.getView();
						var tip = Ext.create('Ext.tip.ToolTip', {
							target: view.el,
							delegate: view.itemSelector,
							trackMouse: true,
							renderTo: Ext.getBody(),
							listeners: {
								beforeshow: function (tip){
									var rec = view.getRecord(tip.triggerElement),
										phone = rec.get('phone'),
										contactInfo = [],
										contact = '';
									phone = phone.split(',');
									if (phone.length > 0) {
										Ext.each(phone, function (p, i, arr){
											p = p.split(':');
											if (p.length >= 2) {
												contactInfo.push({
													desc: p[0],
													phone: p[1]
												});
											}
										});
									}
									if (contactInfo.length > 0) {
										Ext.each(contactInfo, function (c, i){
											contact += c.desc + ': ' + c.phone + '<br />';
										});
									}
									tip.update(
										'<strong>供应商:</strong> ' + rec.get('name') + '<br />'
										+ '<strong>联系人:</strong> ' + rec.get('boss') + '<br />'
										+ '<strong>地址:</strong> ' + rec.get('address') + '<br />'
										+ '<strong>联系方式:</strong> ' + '<br />'
										+ contact
									);
								}
							}
						});
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