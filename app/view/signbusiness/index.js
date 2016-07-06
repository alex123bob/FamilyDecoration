Ext.define('FamilyDecoration.view.signbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.signbusiness-index',
	requires: [
		'FamilyDecoration.store.Business',
		'FamilyDecoration.store.BusinessDetail',
		'FamilyDecoration.view.signbusiness.EditBusinessInfo',
		'FamilyDecoration.view.signbusiness.GradeSignBusiness',
		'FamilyDecoration.store.User',
		'FamilyDecoration.view.signbusiness.EditDesignStatus',
		'FamilyDecoration.view.mybusiness.IndividualReminder'
	],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	checkSignBusiness: false,
	designStaff: null,
	refreshDetailedAddress: function () {
		var grid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness');
		if (this.designStaff) {
			grid.refresh();
		}
		else {
			grid.getStore().removeAll();
		}
	},
	refreshWaitingList: function () {
		var grid = this.getComponent('gridpanel-waitingList');
		if (this.designStaff) {
			grid.refresh();
		}
		else {
			grid.getStore().removeAll();
		}
	},
	designer: undefined,
	businessId: undefined,

	initComponent: function () {
		var me = this;

		me.items = [
			{
				xtype: 'gridpanel',
				flex: 0.7,
				height: '100%',
				title: '待转业务',
				itemId: 'gridpanel-waitingList',
				cls: 'gridpanel-waitingList',
				hideHeaders: true,
				columns: [
					{
						text: '详细地址',
						dataIndex: 'address',
						flex: 1,
						renderer: function (val, meta, rec) {
							var str = '';
							if (val) {
								str += rec.get('regionName') + ' ' + val;
							}
							return str;
						}
					}
				],
				refresh: function () {
					var grid = this;
					grid.getStore().reload({
						params: {
							action: 'getBusinessByDesigner',
							isWaiting: true,
							designerName: me.checkSignBusiness ? (me.designStaff ? me.designStaff.get('designerName') : '') : User.getName()
						}
					});
				},
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				store: Ext.create('FamilyDecoration.store.Business', {
					autoLoad: me.checkSignBusiness ? false : true,
					proxy: {
						type: 'rest',
						url: './libs/business.php',
						reader: {
							type: 'json'
						},
						extraParams: {
							action: 'getBusinessByDesigner',
							isWaiting: true,
							designerName: me.checkSignBusiness ? (me.designStaff ? me.designStaff.get('designerName') : '') : User.getName()
						}
					},
					filters: [
						function (item) {
							if (me.businessId || me.designer) {
								return me.businessId == item.getId();
							}
							else {
								return true;
							}
						}
					]
				}),
				bbar: [
					{
						text: '接收',
						name: 'button-accept',
						disabled: true,
						icon: 'resources/img/accept.png',
						handler: function () {
							var waitingList = me.getComponent('gridpanel-waitingList'),
								business = waitingList.getSelectionModel().getSelection()[0],
								detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness');
							if (business) {
								var win = Ext.create('FamilyDecoration.view.signbusiness.EditDesignStatus', {
									business: business,
									waitingList: waitingList,
									detailedAddressGrid: detailedAddressGrid
								});
								win.show();
							}
							else {
								showMsg('请选择业务！');
							}
						}
					},
					{
						text: '退回',
						name: 'button-refuse',
						disabled: true,
						icon: 'resources/img/returnback.png',
						handler: function () {
							var waitingList = me.getComponent('gridpanel-waitingList'),
								business = waitingList.getSelectionModel().getSelection()[0];
							if (business) {
								Ext.Msg.warning('确定要退回当前业务吗？', function () {
									Ext.Ajax.request({
										url: './libs/business.php?action=returnBusiness',
										method: 'POST',
										params: {
											id: business.getId()
										},
										callback: function (opts, success, res) {
											if (success) {
												var obj = Ext.decode(res.responseText);
												if ('successful' == obj.status) {
													showMsg('退回成功！');
													waitingList.getStore().reload();
												}
											}
										}
									});
								});
							}
							else {
								showMsg('请选择业务！');
							}
						}
					}
				],
				initBtn: function (address) {
					var waitingList = me.getComponent('gridpanel-waitingList'),
						acceptBtn = waitingList.down('[name="button-accept"]'),
						refuseBtn = waitingList.down('[name="button-refuse"]');

					acceptBtn.setDisabled(!address);
					refuseBtn.setDisabled(!address);
				},
				listeners: {
					selectionchange: function (view, sels) {
						var rec = sels[0],
							waitingList = me.getComponent('gridpanel-waitingList');
						waitingList.initBtn(rec);
					}
				}
			},
			{
				xtype: 'gridpanel',
				flex: 1.6,
				height: '100%',
				title: '详细地址',
				hideHeaders: true,
				id: 'gridpanel-detailedAddressForSignBusiness',
				name: 'gridpanel-detailedAddressForSignBusiness',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				bbar: [
					{
						text: '评级',
						id: 'button-gradeSignBusiness',
						name: 'button-gradeSignBusiness',
						icon: './resources/img/business.png',
						handler: function () {
							var grid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
								signbusiness = grid.getSelectionModel().getSelection()[0];
							if (signbusiness) {
								var win = Ext.create('FamilyDecoration.view.signbusiness.GradeSignBusiness', {
									signbusiness: signbusiness,
									grid: grid
								});
								win.show();
							}
							else {
								showMsg('请选择签单业务！');
							}
						}
					},
					{
						text: '调整设计师',
						id: 'button-changeDesigner',
						name: 'button-changeDesigner',
						icon: './resources/img/modify.png',
						handler: function () {
							var grid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
								signbusiness = grid.getSelectionModel().getSelection()[0];
							if (signbusiness) {
								var win = Ext.create('Ext.window.Window', {
									title: '调整设计师',
									resizable: false,
									width: 184,
									height: 120,
									bodyPadding: 10,
									modal: true,
									items: [
										{
											xtype: 'combo',
											store: Ext.create('FamilyDecoration.store.User', {
												autoLoad: true,
												filters: [
													function (item) {
														return item.get('level') == '002-002' || item.get('level') == '002-001';
													}
												]
											}),
											value: signbusiness.get('designerName'),
											editable: false,
											displayField: 'realname',
											valueField: 'name',
											queryMode: 'local'
										}
									],
									buttons: [
										{
											text: '确定',
											handler: function () {
												var combo = win.down('combo'),
													designerName = combo.getValue(),
													designerRealName = combo.getDisplayValue();
												Ext.Ajax.request({
													url: './libs/business.php?action=editBusiness',
													method: 'POST',
													params: {
														id: signbusiness.getId(),
														designerName: designerName,
														designer: designerRealName
													},
													callback: function (opts, success, res) {
														if (success) {
															var obj = Ext.decode(res.responseText);
															if (obj.status == 'successful') {
																showMsg('设计师更改成功！');
																grid.refresh();
																win.close();
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
								showMsg('请选择签单业务！');
							}
						}
					}],
				columns: [
					{
						text: '详细地址',
						dataIndex: 'address',
						flex: 1,
						renderer: function (val, meta, rec) {
							var str = '',
								signBusinessLevel = rec.get('signBusinessLevel'),
								requestDead = rec.get('requestDead');
							switch (signBusinessLevel) {
								case "A":
									meta.style = 'background: lightpink;';
									break;
								case "B":
									meta.style = 'background: lightgreen;';
									break;
								case "C":
									meta.style = 'background: cornsilk;';
									break;
								case "D":
									meta.style = 'background: sandybrown;';
									break;
								default:
									break;
							}
							if (rec.get('applyProjectTransference') == 1) {
								str += '<img src="./resources/img/switch.png" data-qtip="申请转为工程" />';
							}
							if (rec.get('applyBudget') == 1) {
								str += '<img src="./resources/img/scroll1.png" data-qtip="申请预算" />';
							}
							str += rec.get('regionName') + ' ' + val;
							if (signBusinessLevel != '') {
								str += '[<strong><font color="blue">' + signBusinessLevel + '</font></strong>]';
							}
							if (requestDead == '1') {
								str += '[<strong><font color="red">申请废单</font></strong>]';
							}
							return str;
						}
					},
					{
						text: '时间',
						dataIndex: 'createTime',
						flex: 0.7,
						renderer: function (val, meta, rec) {
							if (val) {
								return val.slice(0, val.indexOf(' '));
							}
							else {
								return '';
							}
						}
					}
				],
				store: Ext.create('FamilyDecoration.store.Business', {
					autoLoad: me.checkSignBusiness ? false : true,
					proxy: {
						type: 'rest',
						url: './libs/business.php',
						reader: {
							type: 'json'
						},
						extraParams: {
							action: 'getBusinessByDesigner',
							designerName: me.checkSignBusiness ? (me.designStaff ? me.designStaff.get('designerName') : '') : User.getName()
						}
					},
					filters: [
						function (item) {
							if (me.businessId || me.designer) {
								return me.businessId == item.getId();
							}
							else {
								return true;
							}
						}
					]
				}),
				refresh: function () {
					var grid = this,
						selModel = grid.getSelectionModel(),
						rec = selModel.getSelection()[0];
					grid.getStore().reload({
						params: {
							action: 'getBusinessByDesigner',
							designerName: me.checkSignBusiness ? (me.designStaff ? me.designStaff.get('designerName') : '') : User.getName()
						},
						callback: function (recs, ope, success) {
							if (success) {
								if (rec) {
									selModel.deselectAll();
									selModel.select(grid.getStore().indexOf(rec));
								}
							}
						}
					});
				},
				initBtn: function (address) {
					var applyTransferBtn = Ext.getCmp('button-applyForTransferenceToProject'),
						transferProjectBtn = Ext.getCmp('button-transferToProjectForSignBusiness'),
						applyBudgetBtn = Ext.getCmp('button-applyForBudget'),
						checkBudgetBtn = Ext.getCmp('button-checkBudgetForSignBusiness'),
						requestBtn = Ext.getCmp('button-requestDisableBusiness'),
						editDesignStatusBtn = Ext.getCmp('button-editDesignStatus'),
						confirmDesignStatusBtn = Ext.getCmp('button-confirmDesignStatus'),
						reminderBtn = Ext.getCmp('tool-individualReminder');

					applyTransferBtn.setDisabled(!address);
					transferProjectBtn.setDisabled(!address);
					applyBudgetBtn.setDisabled(!address);
					checkBudgetBtn.setDisabled(!address);
					requestBtn.setDisabled(!address);
					editDesignStatusBtn.setDisabled(!address);
					confirmDesignStatusBtn.setDisabled(!address);
					reminderBtn.setDisabled(!address);
				},
				listeners: {
					selectionchange: function (view, sels) {
						var rec = sels[0],
							infoGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness'),
							detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
							designStatus = Ext.ComponentQuery.query('[name="panel-designStatus"]')[0];
						infoGrid.refresh(rec);
						infoGrid.appendRemindingInfo(rec);
						detailedAddressGrid.initBtn(rec);
						designStatus.refresh(rec);
					}
				}
			},
			{
				xtype: 'container',
				flex: 4,
				height: '100%',
				layout: 'vbox',
				items: [
					{
						hideHeaders: true,
						xtype: 'gridpanel',
						id: 'gridpanel-businessInfoForSignBusiness',
						name: 'gridpanel-businessInfoForSignBusiness',
						title: '信息情况',
						flex: 1,
						width: '100%',
						autoScroll: true,
						initBtn: function (rec) {
							var editBtn = Ext.getCmp('button-editBusinessInfoForSignBusiness'),
								delBtn = Ext.getCmp('button-delBusinessInfoForSignBusiness');

							editBtn.setDisabled(!rec);
							delBtn.setDisabled(!rec);
						},
						appendRemindingInfo: function (rec) {
							var title = '信息情况',
								marquee = '<marquee scrollamount="6" onMouseOver="this.stop()" onMouseOut="this.start()"><font color="#cccccc;"><strong>信息中心:   ',
								grid = this;
							if (rec) {
								Ext.Ajax.request({
									url: './libs/message.php?action=get',
									method: 'GET',
									params: {
										isReminding: true,
										receiver: rec.get('designerName'),
										isRead: false,
										type: 'business_individual_remind',
										extraId: rec.getId()
									},
									callback: function (opts, success, res) {
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.length > 0) {
												Ext.Array.each(obj, function (item, index) {
													marquee += (index + 1) + '. ' + item.content + '  ';
												});
												marquee += '</strong></font></marquee>';
												grid.setTitle(title + marquee);
											}
											else {
												grid.setTitle(title);
											}
										}
									}
								});
							}
							else {
								grid.setTitle(title);
							}
						},
						refresh: function (client) {
							var clientName = Ext.getCmp('textfield-clientNameOnTopForSignBusiness'),
								custContact = Ext.getCmp('textfield-custContactOnTopForSignBusiness'),
								businessStaff = Ext.getCmp('textfield-businessStaffOnTopForSignBusiness'),
								businessSource = Ext.getCmp('textfield-businessSourceOnTopForSignBusiness'),
								businessDesigner = Ext.getCmp('textfield-businessDesignerOnTopForSignBusiness');
							if (client) {
								var grid = this,
									st = grid.getStore(),
									rec = grid.getSelectionModel().getSelection()[0];
								st.reload({
									params: {
										businessId: client.getId()
									},
									callback: function (recs, ope, success) {
										if (success) {
											grid.getSelectionModel().deselectAll();
											if (rec) {
												var index = st.indexOf(rec);
												grid.getSelectionModel().select(index);
											}
										}
									}
								});
								clientName.setValue(client.get('customer'));
								custContact.setValue(client.get('custContact'));
								businessStaff.setValue(client.get('salesman'));
								businessSource.setValue(client.get('source'));
								businessDesigner.setValue(client.get('designer'));
							}
							else {
								this.getStore().removeAll();
								clientName.setValue('');
								custContact.setValue('');
								businessStaff.setValue('');
								businessSource.setValue('');
								businessDesigner.setValue('');
							}
						},
						columns: {
							defaults: {
								align: 'center'
							},
							items: [
								{
									text: '信息内容',
									flex: 1,
									dataIndex: 'content',
									align: 'left',
									renderer: function (val, meta, rec) {
										return val.replace(/\n/ig, '<br />');
									}
								},
								{
									text: '创建时间',
									flex: 1,
									dataIndex: 'createTime',
									renderer: function (val, meta, rec) {
										return val;
									}
								},
								{
									text: '经办人',
									flex: 0.5,
									dataIndex: 'committerRealName',
									renderer: function (val, meta, rec) {
										if (val) {
											return val;
										}
										else {
											return '';
										}
									}
								}
							]
						},
						store: Ext.create('FamilyDecoration.store.BusinessDetail', {
							autoLoad: false
						}),
						tbar: [
							{
								xtype: 'textfield',
								labelWidth: 60,
								width: 140,
								readOnly: true,
								id: 'textfield-clientNameOnTopForSignBusiness',
								name: 'textfield-clientNameOnTopForSignBusiness',
								fieldLabel: ' 客户姓名'
							},
							{
								xtype: 'textfield',
								labelWidth: 60,
								width: 140,
								readOnly: true,
								id: 'textfield-custContactOnTopForSignBusiness',
								name: 'textfield-custContactOnTopForSignBusiness',
								fieldLabel: ' 联系方式'
							},
							{
								xtype: 'textfield',
								labelWidth: 60,
								width: 140,
								readOnly: true,
								id: 'textfield-businessStaffOnTopForSignBusiness',
								name: 'textfield-businessStaffOnTopForSignBusiness',
								fieldLabel: '业务员'
							},
							{
								xtype: 'textfield',
								labelWidth: 60,
								width: 140,
								readOnly: true,
								id: 'textfield-businessDesignerOnTopForSignBusiness',
								name: 'textfield-businessDesignerOnTopForSignBusiness',
								fieldLabel: '设计师'
							},
							{
								xtype: 'textfield',
								labelWidth: 60,
								width: 150,
								readOnly: true,
								id: 'textfield-businessSourceOnTopForSignBusiness',
								name: 'textfield-businessSourceOnTopForSignBusiness',
								fieldLabel: '业务来源'
							}
						],
						bbar: [
							{
								text: '添加',
								id: 'button-addBusinessInfoForSignBusiness',
								name: 'button-addBusinessInfoForSignBusiness',
								icon: './resources/img/add2.png',
								handler: function () {
									var addressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										rec = addressGrid.getSelectionModel().getSelection()[0],
										infoGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness');
									if (rec) {
										var win = Ext.create('FamilyDecoration.view.signbusiness.EditBusinessInfo', {
											rec: rec,
											infoGrid: infoGrid
										});
										win.show();
									}
									else {
										showMsg('请选择详细地址！');
									}
								}
							},
							{
								text: '修改',
								id: 'button-editBusinessInfoForSignBusiness',
								name: 'button-editBusinessInfoForSignBusiness',
								icon: './resources/img/edit3.png',
								disabled: true,
								handler: function () {
									var addressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										rec = addressGrid.getSelectionModel().getSelection()[0],
										infoGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness'),
										obj = infoGrid.getSelectionModel().getSelection()[0];
									if (rec) {
										if (obj) {
											var win = Ext.create('FamilyDecoration.view.signbusiness.EditBusinessInfo', {
												rec: rec,
												infoObj: obj,
												infoGrid: infoGrid
											});
											win.show();
										}
										else {
											showMsg('请选择一条信息进行编辑！');
										}
									}
									else {
										showMsg('请选择详细地址！');
									}
								}
							},
							{
								text: '删除',
								id: 'button-delBusinessInfoForSignBusiness',
								name: 'button-delBusinessInfoForSignBusiness',
								icon: './resources/img/delete2.png',
								disabled: true,
								handler: function () {
									var addressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										rec = addressGrid.getSelectionModel().getSelection()[0],
										infoGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness'),
										infoRec = infoGrid.getSelectionModel().getSelection()[0];
									Ext.Msg.warning('确定要删除当前信息吗？', function (id) {
										if ('yes' == id) {
											Ext.Ajax.request({
												url: './libs/business.php?action=deleteBusinessDetail',
												method: 'POST',
												params: {
													detailId: infoRec.getId()
												},
												callback: function (opts, success, res) {
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.status == 'successful') {
															showMsg('删除成功！');
															infoGrid.refresh(rec);
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
							},
							{
								text: '申请转为工程',
								id: 'button-applyForTransferenceToProject',
								name: 'button-applyForTransferenceToProject',
								icon: './resources/img/transfer.png',
								disabled: true,
								hidden: me.checkSignBusiness ? true : false,
								handler: function () {
									Ext.Ajax.request({
										url: './libs/user.php?action=view',
										method: 'GET',
										callback: function (opts, success, res) {
											if (success) {
												var userArr = Ext.decode(res.responseText),
													mailObjects = [],
													detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
													detailedAddress = detailedAddressGrid.getSelectionModel().getSelection()[0];
												for (var i = 0; i < userArr.length; i++) {
													var level = userArr[i].level;
													if (/^001-\d{3}$/i.test(level) || '004-001' == level
														|| '002-001' == level) {
														mailObjects.push(userArr[i]);
													}
												}

												if (detailedAddress) {
													if (mailObjects.length > 0) {
														Ext.Msg.confirm('转为工程申请确认', '确定要为此业务申请转为工程吗？', function (btnId) {
															if (btnId == 'yes') {
																Ext.Ajax.request({
																	url: './libs/business.php?action=applyprojecttransference',
																	method: 'POST',
																	params: {
																		businessId: detailedAddress.getId()
																	},
																	callback: function (opts, success, res) {
																		if (success) {
																			var obj = Ext.decode(res.responseText);
																			if (obj.status == 'successful') {
																				Ext.Msg.info('申请已发送，请耐心等待！');
																				detailedAddressGrid.refresh();
																			}
																			else {
																				showMsg(obj.errMsg);
																			}
																		}
																	}
																});

																// announce related staffs via email
																var content = User.getRealName() + '为业务[' + detailedAddress.get('regionName')
																	+ '-' + detailedAddress.get('address') + ']申请转为工程，等待您确认处理。',
																	subject = '申请转为工程通知';
																for (i = 0; i < mailObjects.length; i++) {
																	setTimeout((function (index) {
																		return function () {
																			sendMsg(User.getName(), mailObjects[index].name, content, 'applyProjectTransference', detailedAddress.getId());
																			sendMail(mailObjects[index].name, mailObjects[index].mail, subject, content);
																		}
																	})(i), 1000 * (i + 1));
																}
																// end of announcement
															}
														});
													}
													else {
														showMsg('没有通知用户！');
													}
												}
												else {
													showMsg('请选择需要申请转为工程的业务！');
												}
											}
										}
									});
								}
							},
							{
								text: '申请预算',
								id: 'button-applyForBudget',
								name: 'button-applyForBudget',
								disabled: true,
								icon: './resources/img/report.png',
								hidden: me.checkSignBusiness ? true : false,
								handler: function () {
									Ext.Ajax.request({
										url: './libs/user.php?action=view',
										method: 'GET',
										callback: function (opts, success, res) {
											if (success) {
												var userArr = Ext.decode(res.responseText),
													mailObjects = [],
													detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
													detailedAddress = detailedAddressGrid.getSelectionModel().getSelection()[0];
												for (var i = 0; i < userArr.length; i++) {
													var level = userArr[i].level;
													// 设计主管，业务主管，最高管理层，所有预算员，财务主管
													if (/^001-\d{3}$/i.test(level) || '004-001' == level
														|| '002-001' == level || '008-004' == level
														|| '008-001' == level) {
														mailObjects.push(userArr[i]);
													}
												}

												if (detailedAddress) {
													if (mailObjects.length > 0) {
														Ext.Msg.confirm('预算申请确认', '确定要为此业务申请预算吗？', function (btnId) {
															if (btnId == 'yes') {
																Ext.Ajax.request({
																	url: './libs/business.php?action=applyforbudget',
																	method: 'POST',
																	params: {
																		businessId: detailedAddress.getId()
																	},
																	callback: function (opts, success, res) {
																		if (success) {
																			var obj = Ext.decode(res.responseText);
																			if (obj.status == 'successful') {
																				Ext.Msg.info('申请已发送，请耐心等待！');
																				detailedAddressGrid.refresh();
																			}
																			else {
																				showMsg(obj.errMsg);
																			}
																		}
																	}
																});

																// announce related staffs via email
																var content = User.getRealName() + '为业务[' + detailedAddress.get('regionName')
																	+ '-' + detailedAddress.get('address') + ']申请预算，等待您确认处理。',
																	subject = '申请预算通知';
																for (i = 0; i < mailObjects.length; i++) {
																	setTimeout((function (index) {
																		return function () {
																			sendMail(mailObjects[index].name, mailObjects[index].mail, subject, content);
																		}
																	})(i), 1000 * (i + 1));
																}
																// end of announcement
															}
														});
													}
													else {
														showMsg('没有通知用户！');
													}
												}
												else {
													showMsg('请选择需要申请预算的业务！');
												}
											}
										}
									});
								}
							},
							{
								text: '查看预算',
								id: 'button-checkBudgetForSignBusiness',
								name: 'button-checkBudgetForSignBusiness',
								disabled: true,
								icon: './resources/img/scroll.png',
								handler: function () {
									var grid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										rec = grid.getSelectionModel().getSelection()[0];

									if (rec) {
										if (rec.get('applyBudget') == 2) {
											Ext.Ajax.request({
												url: './libs/budget.php?action=getBudgetsByBusinessId',
												params: {
													businessId: rec.getId()
												},
												callback: function (opts, success, res) {
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.length > 0) {
															var listWin = Ext.create('Ext.window.Window', {
																title: rec.get('regionName') + ' ' + rec.get('address') + '-预算列表',
																width: 600,
																modal: true,
																height: 400,
																layout: 'fit',
																items: [
																	{
																		xtype: 'gridpanel',
																		autoScroll: true,
																		columns: [
																			{
																				text: '项目名称',
																				dataIndex: 'businessAddress',
																				flex: 1,
																				renderer: function (val, meta, rec) {
																					return rec.get('businessRegion') + ' ' + val;
																				}
																			},
																			{
																				text: '客户名称',
																				dataIndex: 'custName',
																				flex: 1
																			},
																			{
																				text: '预算名称',
																				dataIndex: 'budgetName',
																				flex: 2
																			},
																			{
																				text: '户型大小',
																				dataIndex: 'areaSize',
																				flex: 1
																			}
																		],
																		store: Ext.create('FamilyDecoration.store.Budget', {
																			data: obj,
																			autoLoad: false
																		})
																	}
																],
																buttons: [
																	{
																		text: '查看预算',
																		handler: function () {
																			var grid = listWin.down('gridpanel'),
																				st = grid.getStore(),
																				budgetRec = grid.getSelectionModel().getSelection()[0];
																			if (budgetRec) {
																				var win = window.open('./fpdf/index2.php?action=view&budgetId=' + budgetRec.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
																			}
																			else {
																				showMsg('请选择预算！');
																			}
																		}
																	},
																	{
																		text: '取消',
																		handler: function () {
																			listWin.close();
																		}
																	}
																]
															});
															listWin.show();
														}
													}
												}
											});
										}
										else {
											showMsg('当前签单业务没有预算！');
										}
									}
									else {
										showMsg('没有选择地址！');
									}
								}
							},
							{
								text: '转为工程',
								id: 'button-transferToProjectForSignBusiness',
								name: 'button-transferToProjectForSignBusiness',
								disabled: true,
								hidden: me.checkSignBusiness ? false : true,
								icon: './resources/img/switch1.png',
								handler: function () {
									var addressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										rec = addressGrid.getSelectionModel().getSelection()[0];

									if (rec) {
										var win = Ext.create('FamilyDecoration.view.checksignbusiness.TransferToProject', {
											client: rec,
											clientGrid: addressGrid
										});

										win.show();
									}
									else {
										showMsg('请选择具体业务！');
									}
								}
							},
							{
								text: '申请废单',
								id: 'button-requestDisableBusiness',
								name: 'button-requestDisableBusiness',
								icon: './resources/img/trashbin.png',
								disabled: true,
								handler: function () {
									var win = Ext.create('Ext.window.Window', {
										title: '申请废单',
										width: 500,
										height: 200,
										modal: true,
										bodyPadding: 4,
										layout: 'vbox',
										items: [
											{
												name: 'requestDeadBusinessReason',
												xtype: 'textarea',
												emptyText: '输入废单详情',
												fieldLabel: '详情',
												autoScroll: true,
												allowBlank: false,
												flex: 3,
												width: '100%'
											},
											{
												name: 'requestDeadBusinessTitle',
												xtype: 'combobox',
												fieldLabel: '原因',
												allowBlank: false,
												editable: false,
												displayField: 'value',
												valueField: 'name',
												flex: 1,
												width: '100%',
												store: Ext.create('Ext.data.Store', {
													fields: ['name', 'value'],
													data: [
														{
															name: 'highSpending',
															value: '资金问题'
														},
														{
															name: 'delayForSeveralYears',
															value: '想放几年'
														},
														{
															name: 'otherDecorated',
															value: '找人装修'
														},
														{
															name: 'guerrilla',
															value: '游击队'
														},
														{
															name: 'highQuotation',
															value: '报价过高'
														},
														{
															name: 'designProblem',
															value: '设计问题'
														},
														{
															name: 'initialProjectQuality',
															value: '前期工程质量'
														},
														{
															name: 'projectQuality',
															value: '工程质量'
														},
														{
															name: 'serviceAttitude',
															value: '服务态度'
														},
														{
															name: 'other',
															value: '其它'
														}
													]
												})
											}
										],
										buttons: [
											{
												text: '确定',
												handler: function () {
													var txtArea = win.down('[name="requestDeadBusinessReason"]'),
														combobox = win.down('[name="requestDeadBusinessTitle"]'),
														reason = txtArea.getValue(),
														title = combobox.getRawValue(),
														businessGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
														rec = businessGrid.getSelectionModel().getSelection()[0];

													if (rec) {
														if (txtArea.isValid() && combobox.isValid()) {
															Ext.Ajax.request({
																url: './libs/business.php?action=requestDeadBusiness',
																method: 'POST',
																params: {
																	businessId: rec.getId(),
																	requestDeadBusinessReason: reason,
																	requestDeadBusinessTitle: title
																},
																callback: function (opts, success, res) {
																	if (success) {
																		var obj = Ext.decode(res.responseText);
																		if ('successful' == obj.status) {
																			win.close();
																			showMsg('废单申请成功！');
																			businessGrid.refresh();
																			Ext.Ajax.request({
																				url: './libs/user.php?action=view',
																				method: 'GET',
																				callback: function (opts, success, res) {
																					if (success) {
																						var userArr = Ext.decode(res.responseText),
																							mailObjects = [],
																							content = '', subject = '',
																							business = rec.get('regionName') + ' ' + rec.get('address');
																						for (var i = 0; i < userArr.length; i++) {
																							var level = userArr[i].level;
																							if (/^001-\d{3}$/i.test(level) || '004-001' == level) {
																								mailObjects.push(userArr[i]);
																							}
																						}

																						// request dead business announcement
																						var content = User.getRealName() + '为业务[' + business + ']申请置为废单，\n原因为：' + title + '\n详情为: ' + reason,
																							subject = '申请废单通知';
																						for (i = 0; i < mailObjects.length; i++) {
																							setTimeout((function (index) {
																								return function () {
																									sendMsg(User.getName(), mailObjects[index].name, content, 'requestDeadBusiness', rec.getId());
																									sendMail(mailObjects[index].name, mailObjects[index].mail, subject, content);
																								}
																							})(i), 1000 * (i + 1));
																						}
																						// end of announcement
																					}
																				}
																			});
																		}
																		else {
																			showMsg(obj.errMsg);
																		}
																	}
																}
															});
														}
													}
													else {
														showMsg('请选择业务!');
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
								text: '修改设计状态',
								id: 'button-editDesignStatus',
								name: 'button-editDesignStatus',
								icon: 'resources/img/edit.png',
								disabled: true,
								handler: function () {
									var detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										business = detailedAddressGrid.getSelectionModel().getSelection()[0];
									if (business) {
										var win = Ext.create('FamilyDecoration.view.signbusiness.EditDesignStatus', {
											business: business,
											detailedAddressGrid: detailedAddressGrid
										});
										win.show();
									}
									else {
										showMsg('请选择业务！');
									}
								}
							},
							{
								text: '确认设计状态',
								id: 'button-confirmDesignStatus',
								name: 'button-confirmDesignStatus',
								icon: 'resources/img/confirm.png',
								disabled: true,
								handler: function () {
									var detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										business = detailedAddressGrid.getSelectionModel().getSelection()[0];
									if (business) {
										var win = Ext.create('FamilyDecoration.view.signbusiness.ConfirmDesignStatus', {
											business: business,
											detailedAddressGrid: detailedAddressGrid
										});
										win.show();
									}
									else {
										showMsg('请选择业务！');
									}
								}
							}
						],
						tools: [
							{
								type: 'plus',
								tooltip: '添加提醒',
								id: 'tool-individualReminder',
								name: 'tool-individualReminder',
								disabled: true,
								handler: function () {
									var addressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
										rec = addressGrid.getSelectionModel().getSelection()[0];
									if (rec) {
										var win = Ext.create('FamilyDecoration.view.mybusiness.IndividualReminder', {
											recipient: me.designStaff ? me.designStaff.get('designerName') : User.getName(),
											type: 'business_individual_remind',
											extraId: rec.getId(),
											afterClose: function () {
												addressGrid.refresh();
											}
										});
										win.show();
									}
									else {
										showMsg('请选择详细地址！');
									}
								}
							}
						],
						listeners: {
							selectionchange: function (view, sels) {
								var rec = sels[0],
									detailGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness');
								detailGrid.initBtn(rec);
							}
						}
					},
					{
						height: 118,
						width: '100%',
						title: '设计状态',
						layout: 'vbox',
						name: 'panel-designStatus',
						defaults: {
							xtype: 'fieldcontainer',
							layout: 'hbox',
							flex: 1,
							width: '100%'
						},
						refresh: function (business) {
							var txts = this.query('textfield');
							for (var i = 0; i < txts.length; i++) {
								var txt = txts[i],
									status, start, end, cur;
								if (business) {
									status = business.get(txt.name);
									if (-1 != status.indexOf('done')) {
										txt.setValue('已完成').setFieldStyle('background: green;');
									}
									else if (status && status != -1) {
										txt.setValue(status);
										start = Ext.Date.parse(status.split('~')[0], 'Y-m-d');
										end = Ext.Date.parse(status.split('~')[1], 'Y-m-d');
										cur = Ext.Date.parse(Ext.Date.format(new Date(), 'Y-m-d'), 'Y-m-d');
										if (start.getTime() > Ext.Date.now()) {
											txt.setFieldStyle('background: skyblue;');
										}
										else if (start.getTime() <= cur.getTime() && cur.getTime() <= end.getTime()) {
											txt.setFieldStyle('background: orange;');
										}
										else if (end.getTime() < cur.getTime()) {
											txt.setFieldStyle('background: pink;');
										}
									}
									else if (status && status == -1) {
										txt.setValue('未接收').setFieldStyle('background: skyblue;');
									}
									else if (!status) {
										txt.setValue('').setFieldStyle('background: white;');
									}
								}
								else {
									txt.setValue('').setFieldStyle('background: white;');
								}

							}
						},
						items: [
							{
								defaults: {
									xtype: 'textfield',
									flex: 1,
									height: '100%',
									readOnly: true,
									labelWidth: 60,
									margin: '1 2 2 2'
								},
								items: [
									{
										fieldLabel: '平面布局',
										name: 'ds_lp'
									},
									{
										fieldLabel: '立面施工',
										name: 'ds_fc'
									}
								]
							},
							{
								defaults: {
									xtype: 'textfield',
									flex: 1,
									height: '100%',
									readOnly: true,
									labelWidth: 60,
									margin: '1 2 2 2'
								},
								items: [
									{
										fieldLabel: '效果图',
										name: 'ds_bs'
									},
									{
										fieldLabel: '预算',
										name: 'ds_bp'
									}
								]
							}
						],
						collapsible: true,
						collapsed: false
					}
				]
			}
		];

		this.callParent();
	}
});