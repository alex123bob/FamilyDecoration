Ext.define('FamilyDecoration.view.materialrequest.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.materialrequest-index',
	requires: [
		'FamilyDecoration.view.materialrequest.MaterialOrder',
		'FamilyDecoration.view.materialrequest.EditMaterialOrder',
		'FamilyDecoration.store.StatementBill',
		'FamilyDecoration.view.suppliermanagement.SupplierList'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
		var me = this;

		function _getRes() {
			var projectPane = me.getComponent('treepanel-projectName'),
				projectPaneSelModel = projectPane.getSelectionModel(),
				project = projectPaneSelModel.getSelection()[0],
				billPane = me.getComponent('panel-billPanel'),
				billRecPane = billPane.down('[name="gridpanel-billRecords"]'),
				billRecPaneSelModel = billRecPane.getSelectionModel(),
				billRec = billRecPaneSelModel.getSelection()[0],
				billRecPaneSt = billRecPane.getStore();

			return {
				projectPane: projectPane,
				projectPaneSelModel: projectPaneSelModel,
				project: project,
				billPane: billPane,
				billRecPane: billRecPane,
				billRecPaneSelModel: billRecPaneSelModel,
				billRec: billRec,
				billRecPaneSt: billRecPaneSt
			};
		}

		var st = Ext.create('FamilyDecoration.store.StatementBill', {
			autoLoad: false,
			proxy: {
				url: './libs/api.php',
				extraParams: {
					billType: 'mtf',
					action: 'StatementBill.getWithSupplier'
				},
				type: 'rest',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'total'
				}
			}
		});

		me.items = [
			{
				xtype: 'progress-projectlistbycaptain',
				flex: 1,
				height: '100%',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				searchFilter: true,
				title: '工程列表',
				itemId: 'treepanel-projectName',
				autoScroll: true,
				listeners: {
					selectionchange: function (selModel, sels, opts) {
						var resObj = _getRes();
						resObj.billPane.initBtn();
						resObj.billRecPane.refresh();
					}
				}
			},
			{
				xtype: 'panel',
				flex: 4,
                title: '&nbsp;',
				height: '100%',
                layout: 'vbox',
				itemId: 'panel-billPanel',
                defaults: {
                    width: '100%'
                },
				_getBtns: function () {
					var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
					return {
						add: tbar.down('[name="add"]'),
						edit: tbar.down('[name="edit"]'),
						del: tbar.down('[name="del"]'),
						submit: tbar.down('[name="submit"]'),
						applyfor: tbar.down('[name="applyfor"]'),
						approve: tbar.down('[name="approve"]'),
						preview: tbar.down('[name="preview"]'),
						print: tbar.down('[name="print"]')
					}
				},
				initBtn: function () {
					var btnObj = this._getBtns(),
						resObj = _getRes();

					for (var key in btnObj) {
						if (btnObj.hasOwnProperty(key)) {
							var btn = btnObj[key];
							if (key == 'add') {
								btn.setDisabled(!resObj.project || !resObj.project.get('projectName'));
							}
							else {
								btn.setDisabled(!resObj.project || !resObj.billRec);
							}
						}
					}
				},
				tbar: [
					{
						xtype: 'button',
						text: '添加',
						name: 'add',
						icon: 'resources/img/material_request_add.png',
						disabled: true,
						handler: function () {
							var resObj = _getRes();
							if (resObj.project) {
								var supplierListWin = Ext.create('Ext.window.Window', {
									layout: 'fit',
									title: '选择供应商',
									width: 400,
									height: 300,
									modal: true,
									items: [
										{
											xtype: 'suppliermanagement-supplierlist',
											header: false
										}
									],
									buttons: [
										{
											text: '确定',
											handler: function () {
												var grid = supplierListWin.down('gridpanel'),
													rec = grid.getSelectionModel().getSelection()[0],
													phones = rec && rec.get('phone').split(',');
												if (rec) {
													Ext.each(phones, function (item, index, self) {
														self[index] = item.split(':')[1];
													});
													ajaxAdd('StatementBill', {
														projectId: resObj.project.getId(),
														projectName: resObj.project.get('projectName'),
														creator: resObj.project.get('captainName'),
														payee: rec.get('name'),
														billType: 'mtf',
														phoneNumber: phones.join(','),
														supplierId: rec.getId()
													}, function (obj) {
														showMsg('初始化成功！');
														var win = Ext.create('FamilyDecoration.view.materialrequest.EditMaterialOrder', {
															project: resObj.project,
															order: Ext.create('FamilyDecoration.model.StatementBill', obj.data),
															callback: function () {
																var resObj = _getRes();
																resObj.billRecPaneSt.reload({
																	callback: function (recs, ope, success) {
																		if (success) {
																			var index = resObj.billRecPaneSt.indexOf(resObj.billRec);
																			if (-1 != index) {
																				resObj.billRecPaneSelModel.deselectAll();
																				resObj.billRecPaneSelModel.select(index);
																			}
																		}
																	}
																});
															}
														});
														win.show();
														supplierListWin.close();
													});
												}
												else {
													showMsg('请选择供应商！');
												}
											}
										},
										{
											text: '取消',
											handler: function () {
												supplierListWin.close();
											}
										}
									]
								});
								supplierListWin.show();
							}
							else {
								showMsg('请选择工程!');
							}
						}
					},
					{
						xtype: 'button',
						text: '编辑',
						name: 'edit',
						icon: 'resources/img/material_request_edit.png',
						disabled: true,
						handler: function () {
							var resObj = _getRes();
							if (resObj.project && resObj.billRec) {
								var win = Ext.create('FamilyDecoration.view.materialrequest.EditMaterialOrder', {
									isEdit: true,
									project: resObj.project,
									order: resObj.billRec,
									callback: function () {
										resObj.billRecPaneSt.reload({
											callback: function (recs, ope, success) {
												if (success) {
													var index = resObj.billRecPaneSt.indexOf(resObj.billRec);
													if (-1 != index) {
														resObj.billRecPaneSelModel.deselectAll();
														resObj.billRecPaneSelModel.select(index);
													}
												}
											}
										});
									}
								});
								win.show();
							}
							else {
								showMsg('未选择工程或申购单！');
							}
						}
					},
					{
						xtype: 'button',
						text: '删除',
						name: 'del',
						icon: 'resources/img/material_request_delete.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '递交审核',
						name: 'submit',
						icon: 'resources/img/material_request_submit.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '申请付款',
						name: 'applyfor',
						icon: 'resources/img/material_request_apply.png',
						disabled: true
					},
					{
						// limited show
						xtype: 'button',
						text: '审核通过',
						name: 'approve',
						icon: 'resources/img/material_request_approve.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '打印预览',
						name: 'preview',
						icon: 'resources/img/material_request_preview.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '打印订购单',
						name: 'print',
						icon: 'resources/img/material_request_print.png',
						disabled: true
					}
				],
				refresh: function () {
					var resObj = _getRes(),
						orderCt = this.down('materialrequest-materialorder');
					orderCt.project = resObj.project;
					orderCt.order = resObj.billRec;
					orderCt.refresh();
				},
                items: [
                    {
                        xtype: 'materialrequest-materialorder',
                        flex: 1,
						previewMode: true
                    },
					{
						title: '记录',
						xtype: 'gridpanel',
						name: 'gridpanel-billRecords',
						flex: 0.5,
						store: st,
						autoScroll: true,
						refresh: function () {
							var resObj = _getRes(),
								st = this.getStore(),
								proxy = st.getProxy();
							if (resObj.project) {
								Ext.apply(proxy.extraParams, {
									projectId: resObj.project.getId()
								});
								st.setProxy(proxy);
								st.loadPage(1);
							}
							else {
								st.removeAll();
							}
						},
						dockedItems: [
							{
								xtype: 'pagingtoolbar',
								store: st,
								displayInfo: true,
								dock: 'bottom'
							}
						],
						columns: {
							defaults: {
								flex: 1,
								align: 'center'
							},
							items: [
								{
									text: '序号',
									dataIndex: 'id'
								},
								{
									text: '单据名称',
									dataIndex: 'projectName',
									renderer: function (val, meta, rec) {
										return val + rec.get('supplier') + '第' + rec.get('payedTimes') + '次申购';
									}
								},
								{
									text: '总额(元)',
									dataIndex: 'totalFee'
								},
								{
									text: '单据状态', // 是否提交审核及通过，是否提交付款，是否付款,
									dataIndex: 'statusName'
								}
							]
						},
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var resObj = _getRes();
								resObj.billPane.initBtn();
								resObj.billPane.refresh();
							}
						}
					}
                ]
			}
		];

		this.callParent();
	}
});