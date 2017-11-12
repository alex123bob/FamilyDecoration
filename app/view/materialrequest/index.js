Ext.define('FamilyDecoration.view.materialrequest.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.materialrequest-index',
	requires: [
		'FamilyDecoration.view.materialrequest.MaterialOrder',
		'FamilyDecoration.view.materialrequest.EditMaterialOrder',
		'FamilyDecoration.store.MaterialOrderList',
		'FamilyDecoration.view.suppliermanagement.SupplierList',
		'FamilyDecoration.view.materialrequest.MaterialOrderTemplate'
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

		var st = Ext.create('FamilyDecoration.store.MaterialOrderList', {
			autoLoad: false,
			proxy: {
				url: './libs/api.php',
				extraParams: {
					billType: 'mtf',
					action: 'SupplierOrder.getWithSupplier'
				},
				type: 'rest',
				reader: {
					type: 'json',
					root: 'data',
					totalProperty: 'total'
				}
			}
		});

		function _refreshBillRecPane (){
			var resObj = _getRes();
			resObj.billRecPaneSt.loadPage(resObj.billRecPaneSt.currentPage, {
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
				needMaterialOrderCount: true,
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
						verifyPassed: tbar.down('[name="verifyPassed"]'),
						approve: tbar.down('[name="approve"]'),
						returnMaterialOrder: tbar.down('[name="returnMaterialOrder"]'),
						preview: tbar.down('[name="preview"]'),
						print: tbar.down('[name="print"]'),
						templatize: tbar.down('[name="templatize"]'),
						checkTpl: tbar.down('[name="checkTpl"]')
					}
				},
				initBtn: function () {
					var btnObj = this._getBtns(),
						resObj = _getRes();

					for (var key in btnObj) {
						if (btnObj.hasOwnProperty(key)) {
							var btn = btnObj[key];
							switch (key) {
								case 'add':
								case 'checkTpl':
									btn.setDisabled(!resObj.project || !resObj.project.get('projectName'));
									break;
								case 'edit':
								case 'del':
								case 'submit':
									btn.setDisabled(!resObj.project || !resObj.billRec || 'new' != resObj.billRec.get('status'));
									break;
								case 'verifyPassed':
									btn.setDisabled(!resObj.project || !resObj.billRec || 'chk' != resObj.billRec.get('status'));
									break;
								case 'approve':
									btn.setDisabled(!resObj.project || !resObj.billRec
										|| (
											'rdyck' != resObj.billRec.get('status')
											// && 'chk' != resObj.billRec.get('status')
											// && 'checked' != resObj.billRec.get('status')
										)
									);
									break;
								case 'returnMaterialOrder':
									// 新创建订购单和已申请付款的订购单，不支持退回上一状态
									btn.setDisabled(
										!resObj.project || !resObj.billRec || ('new' == resObj.billRec.get('status')) || ('applied' == resObj.billRec.get('status'))
									);
									break;
								case 'preview':
								case 'print':
								case 'templatize':
									btn.setDisabled(!resObj.project || !resObj.billRec);
									break;
								default:
									break;
							}
						}
					}
				},
				changeStatus: function (status, msg, successMsg, callback) {
					var resObj = _getRes(),
						st = resObj.billRecPaneSt,
						index = st.indexOf(resObj.billRec),
						selModel = resObj.billRecPaneSelModel;
					if (resObj.billRec) {
						function request(validateCode) {
							var params = {
								id: resObj.billRec.getId(),
								status: status,
								currentStatus: resObj.billRec.get('status')
							}, arr = ['id', 'currentStatus'];
							if (validateCode) {
								Ext.apply(params, {
									validateCode: validateCode
								});
								arr.push('validateCode');
							}
							ajaxUpdate('SupplierOrder.changeStatus', params, arr, function (obj) {
								Ext.defer(function () {
									Ext.Msg.success(successMsg);
									selModel.deselectAll();
									st.reload({
										callback: function (recs, ope, success) {
											if (success) {
												if (typeof callback === 'function') {
													callback();
												}
												selModel.select(index);
											}
										}
									});
								}, 500);
							}, true);
						}
						Ext.Msg.warning(msg, function (btnId) {
							if ('yes' == btnId) {
								ajaxGet('SupplierOrder', 'getLimit', {
									id: resObj.billRec.getId()
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
						showMsg('请选择申购单！');
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
													ajaxAdd('SupplierOrder', {
														projectId: resObj.project.getId(),
														projectName: resObj.project.get('projectName'),
														creator: resObj.project.get('captainName'),
														// payee: rec.get('name'),
														billType: 'mtf',
														// phoneNumber: phones.join(','),
														supplierId: rec.getId()
													}, function (obj) {
														showMsg('初始化成功！');
														var win = Ext.create('FamilyDecoration.view.materialrequest.EditMaterialOrder', {
															project: resObj.project,
															order: Ext.create('FamilyDecoration.model.MaterialOrderList', obj.data),
															callback: function () {
																_refreshBillRecPane();
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
										_refreshBillRecPane();
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
						disabled: true,
						handler: function () {
							var resObj = _getRes();
							if (resObj.billRec) {
								Ext.Msg.warning('确定要删除当前选中的申购单吗?', function (btnId) {
									if ('yes' == btnId) {
										ajaxDel('SupplierOrder', {
											id: resObj.billRec.getId()
										}, function (obj) {
											resObj.billRecPane.refresh();
											showMsg('删除成功！');
										});
									}
								});
							}
							else {
								showMsg('请选择要删除的申购单！');
							}
						}
					},
					{
						xtype: 'button',
						text: '递交审核',
						name: 'submit',
						icon: 'resources/img/material_request_submit.png',
						disabled: true,
						hidden: User.isProjectStaff() || User.isAdmin() ? false : true,
						handler: function () {
							var resObj = _getRes();
							resObj.billPane.changeStatus('+1', '递交后不可再进行修改单据，确定要递交单据吗？', '递交成功!');
						}
					},
					{
						xtype: 'button',
						text: '验收通过',
						name: 'verifyPassed',
						icon: 'resources/img/material_request_apply.png',
						hidden: User.isProjectStaff() || User.isAdmin() ? false : true,
						disabled: true,
						handler: function () {
							var resObj = _getRes();
							resObj.billPane.changeStatus('+1', '确定要将为当前申购单置为验收通过吗？', '验收已通过！');
						}
					},
					{
						// limited show
						xtype: 'button',
						text: '审核通过',
						name: 'approve',
						icon: 'resources/img/material_request_approve.png',
						disabled: true,
						hidden: User.isAdmin() || User.isProjectManager() || User.isFinanceManager() ? false : true,
						handler: function () {
							var resObj = _getRes(),
								msg, successMsg, callback = Ext.emptyFn;
							switch (resObj.billRec.get('status')) {
								case 'rdyck':
									msg = '确定要将当前账单置为审核通过吗？';
									successMsg = '审核已通过!';
									callback = function () {
										var contacts = resObj.billRec.get('phoneNumber'),
											contactArr = [];
										contacts = contacts.split(',');
										Ext.each(contacts, function (c, index, self) {
											var arr = c.split(':');
											contactArr.push({
												name: arr[0],
												value: arr[1]
											});
										});
										var win = Ext.create('Ext.window.Window', {
											modal: true,
											title: '发送短信到供应商',
											width: 300,
											height: 200,
											layout: 'fit',
											items: [
												{
													xtype: 'gridpanel',
													autoScroll: true,
													store: Ext.create('Ext.data.Store', {
														fields: ['name', 'value'],
														autoLoad: true,
														data: contactArr,
														proxy: {
															type: 'memory',
															reader: {
																type: 'json'
															}
														}
													}),
													columns: [
														{
															text: '名称',
															dataIndex: 'name',
															align: 'center',
															flex: 1
														},
														{
															text: '电话',
															dataIndex: 'value',
															align: 'center',
															flex: 1
														}
													]
												}
											],
											buttons: [
												{
													text: '确定',
													handler: function () {
														var grid = win.down('gridpanel'),
															rec = grid.getSelectionModel().getSelection()[0];
														if (rec) {
															ajaxAdd('MsgLog', {
																sender: User.getName(),
																reciever: resObj.billRec.get('supplier'),
																recieverPhone: rec.get('value'),
																content: resObj.billRec.get('projectName') + '第' + resObj.billRec.get('payedTimes') + '次申购单已经审核通过！'
															}, function (obj) {
																showMsg('短信已发送！');
																win.close();
															});
														}
														else {
															showMsg('请选择联系方式！');
														}
													}
												},
												{
													text: '取消',
													handler: function () {
														win.close();
													}
												}
											]
										});
										win.show();
									}
									break;
								default:
									break;
							}
							resObj.billPane.changeStatus('+1', msg, successMsg, callback);
						}
					},
					{
						xtype: 'button',
						text: '退回订单',
						name: 'returnMaterialOrder',
						icon: 'resources/img/return_material_order.png',
						tooltip: '将当前订单退回至上一状态',
						disabled: true,
						hidden: User.isAdmin() ? false : true,
						handler: function (){
							var resObj = _getRes();
							resObj.billPane.changeStatus('-1', '确定将订单退回到上一状态吗?', '退回成功!');
						}
					},
					{
						xtype: 'button',
						text: '打印预览',
						name: 'preview',
						icon: 'resources/img/material_request_preview.png',
						disabled: true,
						handler: function (){
							var resObj = _getRes();
							if (resObj.billRec) {
								var win = window.open('fpdf/material_order.php?id=' + resObj.billRec.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
							}
						}
					},
					{
						xtype: 'button',
						text: '打印订购单',
						name: 'print',
						icon: 'resources/img/material_request_print.png',
						disabled: true,
						handler: function (){
							var resObj = _getRes();
							if (resObj.billRec) {
								var win = window.open('fpdf/material_order.php?id=' + resObj.billRec.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
								win.print();
							}
						}
					},
					{
						xtype: 'button',
						text: '置为模板',
						name: 'templatize',
						icon: 'resources/img/material_order_insert_template.png',
						disabled: true,
						handler: function (){
							var resObj = _getRes();
							Ext.Msg.read('请输入模板名称', function (inputVal){
								ajaxUpdate('SupplierOrderTemplate.supplierOrder2template', {
									supplierOrderId: resObj.billRec.getId(),
									templateName: inputVal
								}, 'supplierOrderId', function (obj){
									showMsg('设置成功!');
									swal.close();
								}, true);
							});
						}
					},
					{
						xtype: 'button',
						text: '订单模板',
						name: 'checkTpl',
						icon: 'resources/img/material_order_template_list.png',
						disabled: true,
						handler: function (){
							var resObj = _getRes();
							var win = Ext.create('FamilyDecoration.view.materialrequest.MaterialOrderTemplate', {
								project: resObj.project,
								callback: _refreshBillRecPane
							});
							win.show();
						}
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