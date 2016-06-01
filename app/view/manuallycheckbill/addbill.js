Ext.define('FamilyDecoration.view.manuallycheckbill.AddBill', {
	extend: 'Ext.window.Window',
	alias: 'widget.manuallycheckbill-addbill',

	requires: [
		'FamilyDecoration.store.StatementBasicItem'
	],

	layout: 'fit',
	width: 615,
	height: 410,
	modal: true,
	title: '添加单据',
	maximizable: true,
	
	project: undefined,
	professionType: undefined,

	initComponent: function (){
		var me = this;
		
		me.items = [
			{
				xtype: 'manuallycheckbill-billtable',
				project: me.project,
				professionType: me.professionType
			}
		];
		me.tbar = [
			{
				text: '添加小项',
				icon: 'resources/img/addsmallitem.png',
				handler: function (){
					var win = Ext.create('Ext.window.Window', {
						title: '项目',
						modal: true,
						width: 500,
						height: 400,
						layout: 'fit',
						maximizable: true,

						items: [
							{
								xtype: 'gridpanel',
								columns: {
									defaults: {
										align: 'center'
									},
									items: [
										{
											text: '名称',
											dataIndex: 'billItemName',
											flex: 1
										}
									]
								},
								store: Ext.create('FamilyDecoration.store.StatementBasicItem', {
									autoLoad: false
								}),
								selModel: {
									mode: 'SIMPLE'
								},
								selType: 'checkboxmodel',
								// hideHeaders: true,
								autoScroll: true,
								listeners: {
									afterrender: function (cmp, opts){
										cmp.getStore().load({
											params: {
												professionType: me.professionType.get('value')
											}
										});
									}
								}
							}
						],
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
				text: '添加空白项',
				icon: 'resources/img/addblankitem.png',
				handler: function (){

				}
			},
			{
				text: '添加预付',
				icon: 'resources/img/addprepay.png',
				handler: function (){

				}
			}
		];
		me.buttons = [
			{
				text: '确定',
				handler: function (){

				}
			},
			{
				text: '取消',
				handler: function (){
					me.close();
				}
			}
		]

		this.callParent();
	}
});