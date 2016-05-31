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
		'FamilyDecoration.view.manuallycheckbill.AddBill',
		'FamilyDecoration.store.StatementBill'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
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
						itemclick: function (view, rec) {
							return rec.get('projectName') ? true : false;
						},
						selectionchange: function (selModel, sels, opts) {
							var pro = sels[0],
								professionTypeGrid = Ext.getCmp('gridpanel-professionType'),
								st = professionTypeGrid.getStore();
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
						flex: 1,
						renderer: function (val, meta, rec) {
							var num = parseInt(rec.get('billNumber'), 10);
							var numStr = '<font style="color: ' + (num > 0 ? 'blue; text-shadow: #8F7 ' : 'white; text-shadow: black ')
								+ '0.1em 0.1em 0.2em;"><strong>[' + num + ']</strong></font>';
							return val + numStr;
						}
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
				height: '100%',
				listeners: {
					selectionchange: function (selModel, sels, opts) {
						var rec = sels[0],
							projectGrid = Ext.getCmp('treepanel-projectNameForBillCheck'),
							project = projectGrid.getSelectionModel().getSelection()[0],
							billList = Ext.getCmp('gridpanel-billList'),
							blSt = billList.getStore();
						if (project && rec) {
							blSt.load({
								params: {
									projectId: project.getId(),
									professionType: rec.get('value')
								}
							});
						}
						else {
							blSt.removeAll();
						}
					}
				}
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
						handler: function () {
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
						isPreview: true,
						id: 'billtable-previewTable',
						name: 'billtable-previewTable'
					},
					{
						xtype: 'gridpanel',
						title: '单据列表',
						id: 'gridpanel-billList',
						name: 'gridpanel-billList',
						width: '100%',
						flex: 0.5,
						autoScroll: true,
						tools: [
							{
								type: 'close',
								tooltip: '删除单据',
								itemId: 'deleteBill',
								callback: function () {

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
									dataIndex: 'isChecked',
									renderer: function (val, meta, rec) {
										if ('false' == val) {
											return '未审核';
										}
										else {
											return '已审核';
										}
									}
								},
								{
									text: '审核人',
									dataIndex: 'checker'
								},
								{
									text: '是否付款',
									dataIndex: 'isPaid',
									renderer: function (val, meta, rec) {
										if ('false' == val) {
											return '未付款';
										}
										else {
											return '已付款';
										}
									}
								},
							],
							defaults: {
								flex: 1,
								align: 'center'
							}
						},
						store: Ext.create('FamilyDecoration.store.StatementBill', {
							autoLoad: false
						}),
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0],
									billDetailPanel = Ext.getCmp('billtable-previewTable');
								billDetailPanel.refresh(rec);
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});