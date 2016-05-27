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
						icon: ''
					},
					{
						text: '递交审核'
					},
					{
						text: '预览单据'
					},
					{
						text: '打印单据'
					}
				],
				layout: 'vbox',
				items: [
					{
						xtype: 'manuallycheckbill-billtable',
						flex: 1,
						width: '100%'
					}
				]
			}
		];

		this.callParent();
	}
});