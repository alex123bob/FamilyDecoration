Ext.define('FamilyDecoration.view.manuallycheckbill.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.manuallycheckbill-index',
	requires: [
		'FamilyDecoration.store.Project',
		'Ext.layout.container.Form',
		'FamilyDecoration.view.progress.ProjectListByCaptain',
		'Ext.form.FieldSet',
		'FamilyDecoration.view.manuallycheckbill.BillTable',
		'FamilyDecoration.store.WorkCategory'
	],
	// autoScroll: true,
	layout: 'hbox',
	projectId: undefined,

	initComponent: function (){
		var me = this;
		me.items = [
			{
				hidden: me.projectId ? true : false,
				xtype: 'container',
				layout: 'fit',
				flex: 0.6,
				height: '100%',
				items: [{
					style: {
						borderRightStyle: 'solid',
						borderRightWidth: '1px'
					},
					xtype: 'progress-projectlistbycaptain',
					projectId: me.projectId,
					searchFilter: true,
					title: '工程项目名称',
					id: 'treepanel-projectNameForBillCheck',
					name: 'treepanel-projectNameForBillCheck',
					autoScroll: true,
					listeners: {
						itemclick: function (view, rec){
							return rec.get('projectName') ? true : false;
						},
						selectionchange: function (selModel, sels, opts){
							
						}
					}
				}]
			}, 
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
				flex: 0.5,
				height: '100%'
			},
			{
				xtype: 'panel',
				flex: 2,
				height: '100%',
				title: '单据细目',
				tbar: [
					{
						text: '添加单据',
						icon: 'resources/img/addbill.png',
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								layout: 'fit',
								width: 615,
								height: 410,
								title: '添加单据',
								modal: true,
								items: [
									{
										xtype: 'manuallycheckbill-billtable'
									}
								],
								tbar: [
									{
										text: '添加小项',
										icon: 'resources/img/addsmallitem.png',
										handler: function (){

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
								],
								buttons: [
									{
										text: '确定'
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
						text: '递交审核',
						icon: 'resources/img/uploadbill.png'
					},
					{
						text: '预览单据',
						icon: 'resources/img/previewbill.png'
					},
					{
						text: '打印单据',
						icon: 'resources/img/printbill.png'
					}
				],
				layout: 'vbox',
				items: [
					{
						xtype: 'manuallycheckbill-billtable',
						flex: 1,
						width: '100%'
					},
					{
						xtype: 'gridpanel',
						title: '单据列表',
						width: '100%',
						flex: 0.5,
						autoScroll: true,
						tools: [
							{
								type: 'close',
								tooltip: '删除单据',
								itemId: 'deleteBill',
								callback: function (){

								}
							}
						],
						columns: [
							{
								text: '单名',
								dataIndex: 'billName',
								flex: 1
							},
							{
								text: '单值',
								dataIndex: 'billValue',
								flex: 1
							},
							{
								text: '是否审核',
								dataIndex: 'isChecked',
								flex: 1
							},
							{
								text: '审核人',
								dataIndex: 'checker',
								flex: 1
							},
							{
								text: '是否付款',
								dataIndex: 'isPaid',
								flex: 1
							},
						]
					}
				]
			}
		];

		this.callParent();
	}
});