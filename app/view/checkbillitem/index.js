Ext.define('FamilyDecoration.view.checkbillitem.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checkbillitem-index',
	requires: [
		'FamilyDecoration.store.ProfessionType',
		'FamilyDecoration.view.checkbillitem.AddCheckBillItem'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
		var me = this;
		me.items = [
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
					autoLoad: true
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
							billItemGrid = Ext.getCmp('gridpanel-checkBillItemTable');
						billItemGrid.initBtn();
						if (rec) {
							billItemGrid.workCategory = rec.get('value');
							billItemGrid.refresh();
						}
						else {
							billItemGrid.workCategory = undefined;
							billItemGrid.refresh();
						}
					}
				}
			},
			{
				xtype: 'checkbillitem-addcheckbillitem',
				id: 'gridpanel-checkBillItemTable',
				name: 'gridpanel-checkBillItemTable',
				flex: 2,
				height: '100%',
				workCategory: undefined,
				initBtn: function () {
					var professionGrid = Ext.getCmp('gridpanel-professionType'),
						checkbillItemGrid = Ext.getCmp('gridpanel-checkBillItemTable'),
						addBtn = Ext.getCmp('button-addStatementBasicItem'),
						editBtn = Ext.getCmp('button-editStatementBasicItem'),
						delBtn = Ext.getCmp('button-deleteStatementBasicItem'),
						professionTypeRec = professionGrid.getSelectionModel().getSelection()[0],
						basicItemRec = checkbillItemGrid.getSelectionModel().getSelection()[0];
					addBtn.setDisabled(!professionTypeRec);
					editBtn.setDisabled(!basicItemRec);
					delBtn.setDisabled(!basicItemRec);
				},
				bbar: [
					{
						text: '添加',
						icon: 'resources/img/addcheckbillitem.png',
						id: 'button-addStatementBasicItem',
						name: 'button-addStatementBasicItem',
						disabled: true,
						handler: function () {
							var billItemGrid = Ext.getCmp('gridpanel-checkBillItemTable');
							var win = Ext.create('Ext.window.Window', {
								layout: 'fit',
								maximizable: true,
								width: 500,
								height: 400,
								modal: true,
								title: '添加对账项目',
								items: {
									xtype: 'checkbillitem-addcheckbillitem',
									isEditable: true,
									header: false,
									workCategory: billItemGrid.workCategory
								},
								buttons: [
									{
										text: '确定',
										handler: function () {
											var grid = win.down('grid'),
												st = grid.getStore(),
												flag = true,
												index = 0,
												urlParams = [],
												failedMembers = [];
											st.each(function (rec) {
												index++;
												if (!rec.get('billItemName') || !rec.get('unit')
													|| !rec.get('referenceNumber') || !rec.get('unitPrice')) {
													flag = false;
													return false;
												}
												else {
													urlParams.push({
														billItemName: rec.get('billItemName'),
														unit: rec.get('unit'),
														referenceNumber: rec.get('referenceNumber'),
														referenceItemIds: rec.get('referenceItemIds'),
														unitPrice: rec.get('unitPrice'),
														professionType: billItemGrid.workCategory
													});
												}
											});
											if (flag) {
												function recursivelyAddStatementBasicItem(arr) {
													if (arr.length > 0) {
														var func = arguments.callee;
														var url = './libs/api.php?action=StatementBasicItem.add';
														var paramObj = arr[0];
														for (var pro in paramObj) {
															url += '&' + pro + '=' + paramObj[pro];
														}
														Ext.Ajax.request({
															url: url,
															method: 'POST',
															callback: function (opts, success, res) {
																if (success) {
																	var obj = Ext.decode(res.responseText);
																	if ('successful' == obj.status) {
																	}
																	else {
																		failedMembers.push(paramObj['billItemName']);
																	}
																	arr.splice(0, 1);
																	func(arr);
																}
																else {
																	// otherwise, pop up window showing request error info.
																}
															}
														});
													}
													else {
														if (failedMembers.length <= 0) {
															showMsg('添加成功！');
														}
														else {
															Ext.Msg.error('以下几项添加失败：<br />' + failedMembers.join('<br />'));
														}
														win.close();
														billItemGrid.refresh();
													}
												}
												recursivelyAddStatementBasicItem(urlParams);
											}
											else {
												showMsg('第' + index + '项有未填写项，请补充完整！');
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
					},
					{
						text: '修改',
						disabled: true,
						id: 'button-editStatementBasicItem',
						name: 'button-editStatementBasicItem',
						icon: 'resources/img/editcheckbillitem.png',
						handler: function () {
							var billItemGrid = Ext.getCmp('gridpanel-checkBillItemTable'),
								rec = billItemGrid.getSelectionModel().getSelection()[0];
							if (rec) {
								var win = Ext.create('Ext.window.Window', {
									layout: 'fit',
									maximizable: true,
									width: 500,
									height: 400,
									modal: true,
									title: '添加对账项目',
									items: {
										xtype: 'checkbillitem-addcheckbillitem',
										isEditable: true,
										header: false,
										workCategory: billItemGrid.workCategory,
										statementBasicItem: Ext.create('FamilyDecoration.model.StatementBasicItem', rec.data)
									},
									buttons: [
										{
											text: '编辑',
											handler: function () {
												var grid = win.down('grid'),
													st = grid.getStore(),
													rec = st.first(),
													url = './libs/api.php?action=StatementBasicItem.update',
													paramObj = {
														billItemName: rec.get('billItemName'),
														unit: rec.get('unit'),
														referenceNumber: rec.get('referenceNumber'),
														referenceItemIds: rec.get('referenceItemIds'),
														unitPrice: rec.get('unitPrice'),
														_id: rec.getId()
													};
												for (var pro in paramObj) {
													if (paramObj.hasOwnProperty(pro)) {
														var value = paramObj[pro];
														url += '&' + pro + '=' + value;
													}
												}
												Ext.Ajax.request({
													url: url,
													method: 'POST',
													callback: function (opts, success, res) {
														if (success) {
															var obj = Ext.decode(res.responseText);
															if ('successful' == obj.status) {
																showMsg('编辑成功！');
																win.close();
																billItemGrid.refresh();
															}
															else {
																showMsg(obj.errMsg);
															}
														}
													}
												});
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
							else {
								showMsg('请选择编辑项目!');
							}
						}
					},
					{
						text: '删除',
						disabled: true,
						id: 'button-deleteStatementBasicItem',
						name: 'button-deleteStatementBasicItem',
						icon: 'resources/img/deletecheckbillitem.png',
						handler: function () {
							var billItemGrid = Ext.getCmp('gridpanel-checkBillItemTable'),
								rec = billItemGrid.getSelectionModel().getSelection()[0];
							if (rec) {
								Ext.Msg.warning('确认要删除当前项吗？', function (btnId) {
									if ('yes' == btnId) {
										Ext.Ajax.request({
											url: './libs/api.php?action=StatementBasicItem.update&_id=' + rec.getId() + '&isDeleted=true',
											method: 'POST',
											callback: function (opts, success, res) {
												if (success) {
													var obj = Ext.decode(res.responseText);
													if ('successful' == obj.status) {
														showMsg('删除成功！');
														billItemGrid.refresh();
													}
													else {
														showMsg(obj.errMsg);
													}
												}
											}
										})
									}
								});
							}
							else {
								showMsg('请选择删除项！');
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});