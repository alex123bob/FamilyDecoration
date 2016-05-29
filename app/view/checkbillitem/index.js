Ext.define('FamilyDecoration.view.checkbillitem.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checkbillitem-index',
	requires: [
		'FamilyDecoration.store.ProfessionType',
		'FamilyDecoration.view.checkbillitem.AddCheckBillItem'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function (){
		var me = this;
		me.items = [
			{
				xtype: 'gridpanel',
				title: '工种列表',
				columns: [
					{
						text: '列表',
						dataIndex: 'cname',
						flex: 1
					}
				],
				store: Ext.create('FamilyDecoration.store.ProfessionType', {
					autoLoad: true
				}),
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				hideHeaders: true,
				flex: 0.2,
				height: '100%',
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							billItemGrid = Ext.getCmp('gridpanel-checkBillItemTable');
						if (rec) {
							billItemGrid.workCategory = rec.get('value');
							billItemGrid.refresh();
						}
						else {
							billItemGrid.workCategory = undefined;
							billItemGrid.refresh();
						}
					}
				}
			},
			{
				xtype: 'checkbillitem-addcheckbillitem',
				id: 'gridpanel-checkBillItemTable',
				name: 'gridpanel-checkBillItemTable',
				flex: 2,
				height: '100%',
				workCategory: undefined,
				bbar: [
					{
						text: '添加',
						icon: 'resources/img/addcheckbillitem.png',
						handler: function (){
							var billItemGrid = Ext.getCmp('gridpanel-checkBillItemTable');
							var win = Ext.create('Ext.window.Window', {
								layout: 'fit',
								maximizable: true,
								width: 500,
								height: 400,
								modal: true,
								title: '添加对账项目',
								items: {
									xtype: 'checkbillitem-addcheckbillitem',
									isEditable: true,
									header: false,
									workCategory: billItemGrid.workCategory
								},
								buttons: [
									{
										text: '确定',
										handler: function (){
											var grid = win.down('grid'),
												st = grid.getStore(),
												flag = true,
												index = 0;
											st.each(function (rec){
												index++;
												if (!rec.get('billItemName') || !rec.get('unit') 
													|| !rec.get('referenceNumber') || !rec.get('unitPrice')) {
													flag = false;
													return false;
												}
											});
											if (flag) {
												// Ext.Ajax.request({
												// 	url: './libs/api.php?'
												// });
											}
											else {
												showMsg('第' + index + '项有未填写项，请补充完整！');
											}
										}
									},
									{
										text: '取消',
										handler: function (){
											win.close();
										}
									}
								]
							});
							win.show();
						}
					},
					{
						text: '修改',
						icon: 'resources/img/editcheckbillitem.png',
						handler: function (){

						}
					},
					{
						text: '删除',
						icon: 'resources/img/deletecheckbillitem.png',
						handler: function (){

						}
					}
				]
			}
		];

		this.callParent();
	}
});