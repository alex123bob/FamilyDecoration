Ext.define('FamilyDecoration.view.manuallycheckbill.AddBill', {
	extend: 'Ext.window.Window',
	alias: 'widget.manuallycheckbill-addbill',

	requires: [],

	layout: 'fit',
	width: 615,
	height: 410,
	modal: true,
	title: '添加单据',
	maximizable: true,

	initComponent: function (){
		var me = this;
		
		me.items = [
			{
				xtype: 'manuallycheckbill-billtable'
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
											dataIndex: 'name',
											flex: 1
										}
									]
								},
								store: Ext.create('Ext.data.Store', {
									fields: ['name'],
									data: [
										{
											name: 'test'
										},
										{
											name: 'test1'
										},
										{
											name: 'test2'
										},
										{
											name: 'test'
										},
										{
											name: 'test1'
										},
										{
											name: 'test2'
										}
									],
									proxy: {
								        type: 'memory',
								        reader: {
								            type: 'json'
								        }
								    }
								}),
								selModel: {
									mode: 'SIMPLE'
								},
								selType: 'checkboxmodel',
								hideHeaders: true,
								autoScroll: true
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