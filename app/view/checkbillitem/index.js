Ext.define('FamilyDecoration.view.checkbillitem.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checkbillitem-index',
	requires: [
		'FamilyDecoration.store.WorkCategory',
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
						dataIndex: 'name',
						flex: 1
					}
				],
				store: FamilyDecoration.store.WorkCategory,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				hideHeaders: true,
				flex: 0.2,
				height: '100%'
			},
			{
				xtype: 'checkbillitem-addcheckbillitem',
				flex: 2,
				height: '100%',
				bbar: [
					{
						text: '添加',
						icon: 'resources/img/addcheckbillitem.png',
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								layout: 'fit',
								maximizable: true,
								width: 500,
								height: 400,
								modal: true,
								title: '添加对账项目',
								items: {
									xtype: 'checkbillitem-addcheckbillitem',
									header: false
								},
								buttons: [
									{
										text: '确定',
										handler: function (){

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