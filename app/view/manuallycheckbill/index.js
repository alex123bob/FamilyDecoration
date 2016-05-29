Ext.define('FamilyDecoration.view.manuallycheckbill.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.manuallycheckbill-index',
	requires: [
		'FamilyDecoration.store.Project',
		'Ext.layout.container.Form',
		'FamilyDecoration.view.progress.ProjectListByCaptain',
		'Ext.form.FieldSet',
		'FamilyDecoration.view.manuallycheckbill.BillTable',
		'FamilyDecoration.store.ProfessionType',
		'FamilyDecoration.view.manuallycheckbill.AddBill'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function (){
		var me = this;
		me.items = [
			{
				xtype: 'container',
				layout: 'fit',
				flex: 0.5,
				height: '100%',
				items: [{
					style: {
						borderRightStyle: 'solid',
						borderRightWidth: '1px'
					},
					xtype: 'progress-projectlistbycaptain',
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
							var pro = sels[0],
								professtionTypeGrid = Ext.getCmp('gridpanel-professionType'),
								st = professtionTypeGrid.getStore();
							if (pro && pro.get('projectName')) {
								st.load({
									params: {
										projectId: pro.getId()
									}
								});
							}
							else if (!pro) {
								st.removeAll();
							}
						}
					}
				}]
			}, 
			{
				xtype: 'gridpanel',
				title: '工种列表',
				id: 'gridpanel-professionType',
				name: 'gridpanel-professionType',
				columns: [
					{
						text: '列表',
						dataIndex: 'cname',
						flex: 1
					}
				],
				store: Ext.create('FamilyDecoration.store.ProfessionType', {
					autoLoad: false
				}),
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				hideHeaders: true,
				flex: 0.2,
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
							var win = Ext.create('FamilyDecoration.view.manuallycheckbill.AddBill', {
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
						width: '100%',
						isPreview: true
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
						columns: {
							items: [
								{
									text: '单名',
									dataIndex: 'billName'
								},
								{
									text: '单值',
									dataIndex: 'billValue'
								},
								{
									text: '是否审核',
									dataIndex: 'isChecked'
								},
								{
									text: '审核人',
									dataIndex: 'checker'
								},
								{
									text: '是否付款',
									dataIndex: 'isPaid'
								},
							],
							defaults: {
								flex: 1,
								align: 'center'
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});