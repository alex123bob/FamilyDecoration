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
		'FamilyDecoration.store.StatementBill',
		'FamilyDecoration.view.manuallycheckbill.BillRecord'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
		var me = this;
		// get all resources which used to be retrieved a lot of times. quite redundant before.
		// now we just encapsulate it.
		me.getRes = function () {
			var projectGrid = Ext.getCmp('treepanel-projectNameForBillCheck'),
				professionTypeGrid = Ext.getCmp('gridpanel-professionType'),
				billList = Ext.getCmp('gridpanel-billList'),
				billDetailPanel = Ext.getCmp('billtable-previewTable');
			return {
				projectGrid: projectGrid,
				projectSt: projectGrid.getStore(),
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

		var billListSt = Ext.create('FamilyDecoration.store.StatementBill', {
			autoLoad: false
		});

		me.items = [
			{
				xtype: 'container',
				layout: 'fit',
				flex: 1,
				height: '100%',
				items: [
					{
						style: {
							borderRightStyle: 'solid',
							borderRightWidth: '1px'
						},
						xtype: 'progress-projectlistbycaptain',
						bbar: [
							{
								text: '结算完成',
								icon: 'resources/img/settled.png',
								handler: function() {
									var resourceObj = me.getRes();
									if (resourceObj.project) {
										Ext.Msg.warning('确定将当前工程置为结算完成状态吗？', function(btnId) {
											if ('yes' == btnId) {
												ajaxUpdate('Project', {
													projectId: resourceObj.project.getId(),
													settled: 1
												}, ['projectId'], function(obj) {
													resourceObj.professionTypeSt.removeAll();
													resourceObj.projectSt.proxy.url = './libs/project.php';
													resourceObj.projectSt.proxy.extraParams = {
														action: 'getProjectsByCaptainName',
														captainName: resourceObj.project.get('captainName')
													};
													resourceObj.projectSt.load({
														node: resourceObj.project.parentNode,
														callback: function(recs, ope, success) {
															if (success) {
																var newPro;
																for (var i = 0; i < recs.length; i++) {
																	if (recs[i].getId() == resourceObj.project.getId()) {
																		newPro = recs[i];
																		break;
																	}
																}
																resourceObj.projectGrid.getSelectionModel().deselectAll()
																resourceObj.projectGrid.getSelectionModel().select(newPro);
																showMsg('结算完成！');
															}
														}
													});
												})
											}
										});
									}
									else {
										showMsg('请选择工程！');
									}
								}
							}
						],
						includeFrozen: true,
						needStatementBillCount: true,
						searchFilter: true,
						settled: 0,
						title: '工程项目名称&nbsp;&nbsp;<span style="font-size: 10px;">[<font color="pink"><strong>*</strong></font>:待一审]</span>',
						id: 'treepanel-projectNameForBillCheck',
						name: 'treepanel-projectNameForBillCheck',
						autoScroll: true,
						listeners: {
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
					}
				]
			},
			{
				xtype: 'gridpanel',
				title: '工种(一审/总)',
				id: 'gridpanel-professionType',
				name: 'gridpanel-professionType',
				columns: [
					{
						text: '列表',
						dataIndex: 'cname',
						flex: 1,
						renderer: function (val, meta, rec) {
							var billNumber = parseInt(rec.get('billNumber'), 10),
								rdyck1BillNumber = parseInt(rec.get('rdyck1BillNumber'), 10);
							var numStr = '<font>['
								+ '<strong style="color: red;">' + rdyck1BillNumber + '</strong>'
								+ '/'
								+ '<strong style="color: blue;">' + billNumber + '</strong>'
								+ ']</font>';
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
				width: 100,
				height: '100%',
				listeners: {
					selectionchange: function (selModel, sels, opts) {
						var rec = sels[0],
							resourceObj = me.getRes(),
							blSt = resourceObj.billList.getStore();
						resourceObj.billList.getSelectionModel().deselectAll();
						resourceObj.billCt.initBtn();
						if (resourceObj.project && rec) {
							blSt.setProxy({
								url: './libs/api.php',
								type: 'rest',
								extraParams: {
									projectId: resourceObj.project.getId(),
									professionType: rec.get('value'),
									action: 'StatementBill.getLaborAndPrePaid'
								},
								reader: {
									type: 'json',
									root: 'data',
									totalProperty: 'total'
								}
							});
							blSt.loadPage(1, {
								callback: function (recs, ope, success) {
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
				flex: 4,
				height: '100%',
				title: '单据细目',
				getButtons: function () {
					var panel = this;
					return {
						addBill: panel.query('[name="addBill"]')[0],
						addPrePayBill: panel.query('[name="addPrePayBill"]')[0],
						editBill: panel.query('[name="editBill"]')[0],
						submitBill: panel.query('[name="submitBill"]')[0],
						firstCheckBill: panel.query('[name="firstCheckBill"]')[0],
						returnBill: panel.query('[name="returnBill"]')[0],
						previewBill: panel.query('[name="previewBill"]')[0],
						printBill: panel.query('[name="printBill"]')[0],
						deleteBill: Ext.getCmp('gridpanel-billList').getHeader().getComponent('deleteBill')
					};
				},
				initBtn: function (rec) {
					var resourceObj = me.getRes(),
						btnObj = this.getButtons();
					for (var name in btnObj) {
						if (btnObj.hasOwnProperty(name)) {
							var btn = btnObj[name];
							if (name == 'addBill' || name == 'addPrePayBill') {
								btn.setDisabled(!(resourceObj.project && resourceObj.professionType));
							}
							else if (name == 'editBill' || name == 'deleteBill' || name == 'submitBill') {
								if (rec && (rec.get('status') != 'new')) {
									if (name == 'deleteBill'
										&& (User.isAdmin() || User.isProjectManager())) {
										btn.enable();
									}
									else {
										btn.disable();
									}
								}
								else {
									btn.setDisabled(!(resourceObj.project && resourceObj.professionType && resourceObj.bill));
								}
							}
							else if (name == 'firstCheckBill' || name == 'returnBill') {
								if ((User.isBudgetManager() || User.isBudgetStaff() || User.isAdmin()) && rec && rec.get('status') == 'rdyck1') {
									btn.enable();
								}
								else {
									btn.disable();
								}
							}
							else {
								btn.setDisabled(!(resourceObj.project && resourceObj.professionType && resourceObj.bill));
							}
						}
					}
				},
				addBillFunc: function (billType) {
					var resourceObj = me.getRes();
					Ext.Msg.read('请输入领款人，一旦输入不可修改！', function (txt) {
						swal.close();
						if (resourceObj.project && resourceObj.professionType) {
							ajaxAdd('StatementBill', {
								payee: txt,
								projectId: resourceObj.project.getId(),
								isFrozen: resourceObj.project.get('isFrozen'),
								professionType: resourceObj.professionType.get('value'),
								projectName: resourceObj.project.get('projectName'),
								billType: billType
							}, function (obj) {
								var win = Ext.create('FamilyDecoration.view.manuallycheckbill.AddBill', {
									project: resourceObj.project,
									professionType: resourceObj.professionType,

									bill: Ext.create('FamilyDecoration.model.StatementBill', obj.data),
									callbackAfterClose: function () {
										var resourceObj = me.getRes(),
											professionTypeId = resourceObj.professionType.getId(),
											professionTypeSelModel = resourceObj.professionTypeGrid.getSelectionModel(),
											professionTypeSt = resourceObj.professionTypeSt;
										professionTypeSelModel.deselectAll();
										professionTypeSt.reload({
											callback: function (recs, ope, success) {
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
					});
				},
				tbar: [
					{
						text: '添加单据',
						icon: 'resources/img/addbill.png',
						name: 'addBill',
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes();
							resourceObj.billCt.addBillFunc('reg');
						}
					},
					{
						text: '添加预付',
						icon: 'resources/img/prepay.png',
						name: 'addPrePayBill',
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes();
							resourceObj.billCt.addBillFunc('ppd');
						}
					},
					{
						text: '编辑单据',
						name: 'editBill',
						disabled: true,
						icon: 'resources/img/editbill.png',
						handler: function () {
							var resourceObj = me.getRes();
							if (resourceObj.project && resourceObj.professionType) {
								var win = Ext.create('FamilyDecoration.view.manuallycheckbill.AddBill', {
									project: resourceObj.project,
									professionType: resourceObj.professionType,
									isEdit: true,
									bill: resourceObj.bill,
									callbackAfterClose: function () {
										var resourceObj = me.getRes(),
											professionTypeId = resourceObj.professionType.getId(),
											professionTypeSelModel = resourceObj.professionTypeGrid.getSelectionModel(),
											professionTypeSt = resourceObj.professionTypeSt;
										professionTypeSelModel.deselectAll();
										professionTypeSt.reload({
											callback: function (recs, ope, success) {
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
						icon: 'resources/img/uploadbill.png',
						handler: function () {
							var resourceObj = me.getRes(),
								st = resourceObj.billList.getStore(),
								index = st.indexOf(resourceObj.bill),
								selModel = resourceObj.billList.getSelectionModel();
							Ext.Msg.warning('递交后不可再进行修改单据，确定要递交单据吗？', function (btnId) {
								if ('yes' == btnId) {
									ajaxGet('StatementBill', 'getLimit', {
										id: resourceObj.bill.getId()
									}, function (obj) {
										if (obj.type == 'checked') {
											showMsg(obj.hint);
											ajaxUpdate('StatementBill.changeStatus', {
												id: resourceObj.bill.getId(),
												status: '+1',
												currentStatus: resourceObj.bill.get('status')
											}, ['id', 'currentStatus'], function (obj) {
												Ext.defer(function () {
													Ext.Msg.success('递交成功！');
													selModel.deselectAll();
													st.reload({
														callback: function (recs, ope, success) {
															if (success) {
																selModel.select(index);
															}
														}
													});
												}, 500);
											}, true);
										}
										else {
											Ext.defer(function () {
												Ext.Msg.password(obj.hint, function (val) {
													if (obj.type == 'sms') {
													}
													else if (obj.type == 'securePass') {
														val = md5(_PWDPREFIX + val);
													}
													ajaxUpdate('StatementBill.changeStatus', {
														id: resourceObj.bill.getId(),
														status: '+1',
														validateCode: val,
														currentStatus: resourceObj.bill.get('status')
													}, ['id', 'validateCode', 'currentStatus'], function (obj) {
														Ext.defer(function () {
															Ext.Msg.success('递交成功！');
															selModel.deselectAll();
															st.reload({
																callback: function (recs, ope, success) {
																	if (success) {
																		selModel.select(index);
																	}
																}
															});
														}, 500);
													}, true);
												});
											}, 500);
										}
									});
								}
							});
						}
					},
					{
						text: '一审通过',
						name: 'firstCheckBill',
						disabled: true,
						hidden: !(User.isAdmin() || User.isBudgetManager() || User.isBudgetStaff()),
						icon: 'resources/img/first_check.png',
						handler: function () {
							var resourceObj = me.getRes(),
								bill = resourceObj.bill,
								st = resourceObj.billList.getStore(),
								index = st.indexOf(resourceObj.bill),
								selModel = resourceObj.billList.getSelectionModel();
							if (bill) {
								function request(validateCode) {
									var params = {
										id: resourceObj.bill.getId(),
										status: '+1',
										currentStatus: resourceObj.bill.get('status')
									}, arr = ['id', 'currentStatus'];
									if (validateCode) {
										Ext.apply(params, {
											validateCode: validateCode
										});
										arr.push('validateCode');
									}
									ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
										Ext.defer(function () {
											Ext.Msg.success('一审通过');
											selModel.deselectAll();
											st.reload({
												callback: function (recs, ope, success) {
													if (success) {
														selModel.select(index);
													}
												}
											});
										}, 500);
									}, true);
								}
								Ext.Msg.warning('确定要将当前账单置为一审通过吗？', function (btnId) {
									if ('yes' == btnId) {
										ajaxGet('StatementBill', 'getLimit', {
											id: resourceObj.bill.getId()
										}, function (obj) {
											if (obj.type == 'checked') {
												showMsg(obj.hint);
												request();
											}
											else {
												Ext.defer(function () {
													Ext.Msg.password(obj.hint, function (val) {
														if (obj.type == 'sms') {
														}
														else if (obj.type == 'securePass') {
															val = md5(_PWDPREFIX + val);
														}
														request(val);
													});
												}, 500);
											}
										});
									}
								});
							}
							else {
								showMsg('请选择账单！');
							}
						}
					},
					{
						text: '退回单据',
						name: 'returnBill',
						disabled: true,
						hidden: !(User.isAdmin() || User.isBudgetManager() || User.isBudgetStaff()),
						icon: 'resources/img/return_bill.png',
						handler: function () {
							var resourceObj = me.getRes(),
								bill = resourceObj.bill,
								st = resourceObj.billList.getStore(),
								index = st.indexOf(resourceObj.bill),
								selModel = resourceObj.billList.getSelectionModel();
							if (bill) {
								Ext.Msg.warning('确定要将当前账单退回到未提交状态吗？', function (btnId) {
									if ('yes' == btnId) {
										function request(validateCode) {
											var params = {
												id: resourceObj.bill.getId(),
												status: '-1',
												currentStatus: resourceObj.bill.get('status')
											},
												arr = ['id', 'currentStatus'];
											if (validateCode) {
												Ext.apply(params, {
													validateCode: validateCode
												});
												arr.push('validateCode');
											}
											ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
												Ext.defer(function () {
													Ext.Msg.success('单据已退回，单据状态置为未提交！');
													selModel.deselectAll();
													st.reload({
														callback: function (recs, ope, success) {
															if (success) {
																selModel.select(index);
															}
														}
													});
												}, 500);
											}, true);
										}
										ajaxGet('StatementBill', 'getLimit', {
											id: resourceObj.bill.getId()
										}, function (obj) {
											if (obj.type == 'checked') {
												showMsg(obj.hint);
												request();
											}
											else {
												Ext.defer(function () {
													Ext.Msg.password(obj.hint, function (val) {
														if (obj.type == 'sms') {
														}
														else if (obj.type == 'securePass') {
															val = md5(_PWDPREFIX + val);
														}
														request(val);
													});
												}, 500);
											}
										});
									}
								});
							}
							else {
								showMsg('请选择账单！');
							}
						}
					},
					{
						text: '预览单据',
						name: 'previewBill',
						disabled: true,
						icon: 'resources/img/previewbill.png',
						handler: function () {
							var resourceObj = me.getRes(),
								bill = resourceObj.bill;
							if (bill) {
								var win = window.open('./fpdf/statement_bill.php?id=' + bill.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
							}
							else {
								showMsg('没有账单！');
							}
						}
					},
					{
						text: '打印单据',
						name: 'printBill',
						disabled: true,
						hidden: true,
						icon: 'resources/img/printbill.png',
						handler: function () {
							var resourceObj = me.getRes(),
								bill = resourceObj.bill;
							if (bill) {
								var win = window.open('./fpdf/statement_bill.php?id=' + bill.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
								win.print();
							}
							else {
								showMsg('没有账单！');
							}
						}
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
						name: 'billtable-previewTable',
						html: '<iframe id="exportBill"  src="javascript:void(0);" style="display:none"></iframe>'
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
										Ext.Msg.warning('确定要删除当前账单吗?', function (btnId) {
											if ('yes' == btnId) {
												ajaxDel('StatementBill', {
													id: resourceObj.bill.getId()
												}, function (obj) {
													showMsg('删除成功！');
													professionTypeSelModel.deselectAll();
													professionTypeSt.reload({
														callback: function (recs, ope, success) {
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
									flex: 1,
									text: '单名',
									dataIndex: 'billName'
								},
								{
									flex: 1,
									text: '单值(元)',
									dataIndex: 'totalFee'
								},
								{
									flex: 1,
									text: '审核状态',
									dataIndex: 'statusName'
								},
								{
									flex: 1,
									text: '审核人',
									dataIndex: 'checkerRealName'
								},
								{
									flex: 1,
									text: '是否付款',
									dataIndex: 'status',
									renderer: function (val, meta, rec) {
										return 'paid' == val ? '已付款' : '未付款';
									}
								},
								{
									xtype: 'actioncolumn',
									width: 50,
									items: [
										{
											icon: 'resources/img/bill-history.png',
											tooltip: '查看账单历史',
											handler: function (grid, rowIndex, colIndex) {
												var rec = grid.getStore().getAt(rowIndex);
												var win = Ext.create('FamilyDecoration.view.manuallycheckbill.BillRecord', {
													bill: rec
												});
												win.show();
											}
										}
									]
								}
							],
							defaults: {
								align: 'center'
							}
						},
						store: billListSt,
						dockedItems: [
							{
								xtype: 'pagingtoolbar',
								store: billListSt,
								dock: 'bottom',
								displayInfo: true
							}
						],
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0],
									resourceObj = me.getRes();
								resourceObj.billDetailPanel.bill = rec;
								resourceObj.billDetailPanel.refresh(rec);
								resourceObj.billDetailPanel.hasPrePaidBill = (rec && rec.get('hasPrePaidBill') == 'true');
								resourceObj.billCt.initBtn(rec);
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});