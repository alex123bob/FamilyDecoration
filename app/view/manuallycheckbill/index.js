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
		// get all resources which used to be retrieved a lot of times. quite redundant before.
		// now we just encapsulate it.
		me.getRes = function (){
			var projectGrid = Ext.getCmp('treepanel-projectNameForBillCheck'),
				professionTypeGrid = Ext.getCmp('gridpanel-professionType'),
				billList = Ext.getCmp('gridpanel-billList'),
				billDetailPanel = Ext.getCmp('billtable-previewTable');
			return {
				projectGrid: projectGrid,
				project: projectGrid.getSelectionModel().getSelection()[0],
				professionTypeGrid: professionTypeGrid,
				professionTypeSt: professionTypeGrid.getStore(),
				professionType: professionTypeGrid.getSelectionModel().getSelection()[0],
				billList: billList,
				bill: billList.getSelectionModel().getSelection()[0],
				billDetailPanel: billDetailPanel,
				billCt: billDetailPanel.ownerCt
			}
		};
		
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
								resourceObj = me.getRes(),
								st = resourceObj.professionTypeGrid.getStore();
							if (pro && pro.get('projectName')) {
								resourceObj.professionTypeGrid.getSelectionModel().deselectAll();
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
							resourceObj = me.getRes(),
							blSt = resourceObj.billList.getStore();
						resourceObj.billList.getSelectionModel().deselectAll();
						resourceObj.billCt.initBtn();
						if (resourceObj.project && rec) {
							blSt.load({
								params: {
									projectId: resourceObj.project.getId(),
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
				getButtons: function (){
					var panel = this;
					return {
						addBill: panel.query('[name="addBill"]')[0],
						editBill: panel.query('[name="editBill"]')[0],
						submitBill: panel.query('[name="submitBill"]')[0],
						previewBill: panel.query('[name="previewBill"]')[0],
						printBill: panel.query('[name="printBill"]')[0]
					};
				},
				initBtn: function (){
					var resourceObj = me.getRes(),
						btnObj = this.getButtons();
					for (var name in btnObj) {
						if (btnObj.hasOwnProperty(name)) {
							var btn = btnObj[name];
							if (name == 'addBill') {
								btn.setDisabled(!(resourceObj.project && resourceObj.professionType));
							}
							else {
								btn.setDisabled(!(resourceObj.project && resourceObj.professionType && resourceObj.bill));
							}
						}
					}
				},
				tbar: [
					{
						text: '添加单据',
						icon: 'resources/img/addbill.png',
						name: 'addBill',
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes();
							if (resourceObj.project && resourceObj.professionType) {
								ajaxAdd('StatementBill', {
									projectId: resourceObj.project.getId(),
									professionType: resourceObj.professionType.get('value')
								}, function (obj){
									var win = Ext.create('FamilyDecoration.view.manuallycheckbill.AddBill', {
										project: resourceObj.project,
										professionType: resourceObj.professionType,
										
										bill: Ext.create('FamilyDecoration.model.StatementBill', obj.data),
										callbackAfterClose: function (){
											var resourceObj = me.getRes(),
												professionTypeId = resourceObj.professionType.getId(),
												professionTypeSelModel = resourceObj.professionTypeGrid.getSelectionModel(),
												professionTypeSt = resourceObj.professionTypeSt;
											professionTypeSelModel.deselectAll();
											professionTypeSt.reload({
												callback: function (recs, ope, success){
													if (success) {
														professionTypeSelModel.select(professionTypeSt.getById(professionTypeId));
													}
												}
											});
										}
									});
									win.show();
								});
							}
							else {
								showMsg('请选择项目和工种！');
							}
						}
					},
					{
						text: '编辑单据',
						name: 'editBill',
						disabled: true,
						icon: 'resources/img/editbill.png',
						handler: function (){
							var resourceObj = me.getRes();
							if (resourceObj.project && resourceObj.professionType) {
								var win = Ext.create('FamilyDecoration.view.manuallycheckbill.AddBill', {
									project: resourceObj.project,
									professionType: resourceObj.professionType,
									isEdit: true,
									bill: resourceObj.bill,
									callbackAfterClose: function (){
										var resourceObj = me.getRes(),
											professionTypeId = resourceObj.professionType.getId(),
											professionTypeSelModel = resourceObj.professionTypeGrid.getSelectionModel(),
											professionTypeSt = resourceObj.professionTypeSt;
										professionTypeSelModel.deselectAll();
										professionTypeSt.reload({
											callback: function (recs, ope, success){
												if (success) {
													professionTypeSelModel.select(professionTypeSt.getById(professionTypeId));
												}
											}
										});
									}
								});
								win.show();
							}
							else {
								showMsg('请选择项目和工种！');
							}
						}
					},
					{
						text: '递交审核',
						name: 'submitBill',
						disabled: true,
						icon: 'resources/img/uploadbill.png'
					},
					{
						text: '预览单据',
						name: 'previewBill',
						disabled: true,
						icon: 'resources/img/previewbill.png'
					},
					{
						text: '打印单据',
						name: 'printBill',
						disabled: true,
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
									var resourceObj = me.getRes(),
										professionType = resourceObj.professionType,
										professionTypeId = professionType.getId(),
										professionTypeSt = resourceObj.professionTypeSt,
										professionTypeSelModel = resourceObj.professionTypeGrid.getSelectionModel();
									if (resourceObj.bill) {
										Ext.Msg.warning('确定要删除当前账单吗?', function (btnId){
											if ('yes' == btnId) {
												ajaxDel('StatementBill', {
													id: resourceObj.bill.getId()
												}, function (obj){
													showMsg('删除成功！');
													professionTypeSelModel.deselectAll();
													professionTypeSt.reload({
														callback: function (recs, ope, success){
															if (success) {
																professionTypeSelModel.select(professionTypeSt.getById(professionTypeId));
															}
														}
													})
												});
											}
										});
									}
									else {
										showMsg('请选择账单！');
									}
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
									dataIndex: 'totalFee'
								},
								{
									text: '是否审核',
									dataIndex: 'isChecked',
									renderer: function (val, meta, rec) {
										if ('true' == val) {
											return '已审核';
										}
										else {
											return '未审核';
										}
									}
								},
								{
									text: '审核人',
									dataIndex: 'checkerRealName'
								},
								{
									text: '是否付款',
									dataIndex: 'isPaid',
									renderer: function (val, meta, rec) {
										if ('true' == val) {
											return '已付款';
										}
										else {
											return '未付款';
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
									resourceObj = me.getRes();
								resourceObj.billDetailPanel.bill = rec;
								resourceObj.billDetailPanel.refresh(rec);
								resourceObj.billCt.initBtn();
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});