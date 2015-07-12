Ext.define('FamilyDecoration.view.signbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.signbusiness-index',
	requires: ['FamilyDecoration.store.Business', 'FamilyDecoration.store.BusinessDetail', 'FamilyDecoration.view.signbusiness.EditBusinessInfo'],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	checkSignBusiness: false,
	designStaff: null,
	refreshDetailedAddress: function (){
		var grid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness');
		if (this.designStaff) {
			grid.refresh();
		}
		else {
			grid.getStore().removeAll();
		}
	},

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			flex: 3,
			height: '100%',
			title: '详细地址',
			hideHeaders: true,
			id: 'gridpanel-detailedAddressForSignBusiness',
			name: 'gridpanel-detailedAddressForSignBusiness',
			style: {
				borderRightStyle: 'solid',
				borderRightWidth: '1px'
			},
			columns: [{
				text: '详细地址',
				dataIndex: 'address',
				flex: 1,
				renderer: function (val, meta, rec){
					var str = '';
					if (rec.get('applyProjectTransference') == 1) {
						str += '<img src="./resources/img/switch.png" data-qtip="申请转为工程" />';
					}
					if (rec.get('applyBudget') == 1) {
						str += '<img src="./resources/img/scroll1.png" data-qtip="申请预算" />';
					}
					str += rec.get('regionName') + ' ' + val;
					return str;
				}
			}],
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
				}
			}),
			refresh: function (){
				var grid = this;
				grid.getStore().reload({
					params: {
						action: 'getBusinessByDesigner',
						designerName: me.checkSignBusiness ? (me.designStaff ? me.designStaff.get('designerName') : '') : User.getName()
					}
				});
			},
			initBtn: function (address){
				var applyTransferBtn = Ext.getCmp('button-applyForTransferenceToProject'),
					transferProjectBtn = Ext.getCmp('button-transferToProjectForSignBusiness'),
					applyBudgetBtn = Ext.getCmp('button-applyForBudget'),
					checkBudgetBtn = Ext.getCmp('button-checkBudgetForSignBusiness');

				applyTransferBtn.setDisabled(!address);
				transferProjectBtn.setDisabled(!address);
				applyBudgetBtn.setDisabled(!address);
				checkBudgetBtn.setDisabled(!address);
			},
			listeners: {
				selectionchange: function (view, sels){
					var rec = sels[0],
						infoGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness'),
						detailedAddressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness');
					infoGrid.refresh(rec);
					detailedAddressGrid.initBtn(rec);
				}
			}
		}, {
			hideHeaders: true,
			xtype: 'gridpanel',
			id: 'gridpanel-businessInfoForSignBusiness',
			name: 'gridpanel-businessInfoForSignBusiness',
			title: '信息情况',
			height: '100%',
			flex: 7,
			autoScroll: true,
			initBtn: function (rec){
				var editBtn = Ext.getCmp('button-editBusinessInfoForSignBusiness'),
					delBtn = Ext.getCmp('button-delBusinessInfoForSignBusiness');

				editBtn.setDisabled(!rec);
				delBtn.setDisabled(!rec);
			},
			refresh: function (client){
				var clientName = Ext.getCmp('textfield-clientNameOnTopForSignBusiness'),
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
						callback: function (recs, ope, success){
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
					businessStaff.setValue(client.get('salesman'));
					businessSource.setValue(client.get('source'));
					businessDesigner.setValue(client.get('designer'));
				}
				else {
					this.getStore().removeAll();
					clientName.setValue('');
					businessStaff.setValue('');
					businessSource.setValue('');
					businessDesigner.setValue('');
				}
			},
			columns: [
		        {
		        	text: '信息内容',
					flex: 1,
					dataIndex: 'content',
					renderer: function (val, meta, rec){
						return val.replace(/\n/ig, '<br />');
					}
		        }
		    ],
		    store: Ext.create('FamilyDecoration.store.BusinessDetail', {
		    	autoLoad: false
		    }),
		    tbar: [{
				xtype: 'textfield',
				labelWidth: 60,
				width: 140,
				readOnly: true,
				id: 'textfield-clientNameOnTopForSignBusiness',
				name: 'textfield-clientNameOnTopForSignBusiness',
				fieldLabel: ' 客户姓名'
			}, {
				xtype: 'textfield',
				labelWidth: 60,
				width: 140,
				readOnly: true,
				id: 'textfield-businessStaffOnTopForSignBusiness',
				name: 'textfield-businessStaffOnTopForSignBusiness',
				fieldLabel: '业务员'
			}, {
				xtype: 'textfield',
				labelWidth: 60,
				width: 140,
				readOnly: true,
				id: 'textfield-businessDesignerOnTopForSignBusiness',
				name: 'textfield-businessDesignerOnTopForSignBusiness',
				fieldLabel: '设计师'
			}, {
				xtype: 'textfield',
				labelWidth: 60,
				width: 150,
				readOnly: true,
				id: 'textfield-businessSourceOnTopForSignBusiness',
				name: 'textfield-businessSourceOnTopForSignBusiness',
				fieldLabel: '业务来源'
			}],
		    bbar: [{
				text: '添加',
				id: 'button-addBusinessInfoForSignBusiness',
				name: 'button-addBusinessInfoForSignBusiness',
				icon: './resources/img/add2.png',
				handler: function (){
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
			}, {
				text: '修改',
				id: 'button-editBusinessInfoForSignBusiness',
				name: 'button-editBusinessInfoForSignBusiness',
				icon: './resources/img/edit3.png',
				disabled: true,
				handler: function (){
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
			}, {
				text: '删除',
				id: 'button-delBusinessInfoForSignBusiness',
				name: 'button-delBusinessInfoForSignBusiness',
				icon: './resources/img/delete2.png',
				disabled: true,
				handler: function (){
					var addressGrid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
						rec = addressGrid.getSelectionModel().getSelection()[0],
						infoGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness'),
						infoRec = infoGrid.getSelectionModel().getSelection()[0];
					Ext.Msg.warning('确定要删除当前信息吗？', function (id){
						if ('yes' == id) {
							Ext.Ajax.request({
								url: './libs/business.php?action=deleteBusinessDetail',
								method: 'POST',
								params: {
									detailId: infoRec.getId()
								},
								callback: function (opts, success, res){
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
			}, {
				text: '申请转为工程',
				id: 'button-applyForTransferenceToProject',
				name: 'button-applyForTransferenceToProject',
				icon: './resources/img/transfer.png',
				disabled: true,
				hidden: me.checkSignBusiness ? true : false,
				handler: function (){
					Ext.Ajax.request({
						url: './libs/user.php?action=view',
						method: 'GET',
						callback: function (opts, success, res){
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
										Ext.Msg.confirm('转为工程申请确认', '确定要为此业务申请转为工程吗？', function (btnId){
											if (btnId == 'yes') {
												Ext.Ajax.request({
													url: './libs/business.php?action=applyprojecttransference',
													method: 'POST',
													params: {
														businessId: detailedAddress.getId()
													},
													callback: function (opts, success, res){
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
													setTimeout((function (index){
														return function (){
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
			}, {
				text: '申请预算',
				id: 'button-applyForBudget',
				name: 'button-applyForBudget',
				disabled: true,
				icon: './resources/img/report.png',
				hidden: me.checkSignBusiness ? true : false,
				handler: function (){
					Ext.Ajax.request({
						url: './libs/user.php?action=view',
						method: 'GET',
						callback: function (opts, success, res){
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
										Ext.Msg.confirm('预算申请确认', '确定要为此业务申请预算吗？', function (btnId){
											if (btnId == 'yes') {
												Ext.Ajax.request({
													url: './libs/business.php?action=applyforbudget',
													method: 'POST',
													params: {
														businessId: detailedAddress.getId()
													},
													callback: function (opts, success, res){
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
													setTimeout((function (index){
														return function (){
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
			}, {
				text: '查看预算',
				id: 'button-checkBudgetForSignBusiness',
				name: 'button-checkBudgetForSignBusiness',
				disabled: true,
				icon: './resources/img/scroll.png',
				handler: function (){
					var grid = Ext.getCmp('gridpanel-detailedAddressForSignBusiness'),
						rec = grid.getSelectionModel().getSelection()[0];

					if (rec) {
						if (rec.get('applyBudget') == 2) {
							Ext.Ajax.request({
								url: './libs/budget.php?action=getBudgetsByBusinessId',
								params: {
									businessId: rec.getId()
								},
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText);
										if (obj.length > 0) {
											var listWin = Ext.create('Ext.window.Window', {
												title: rec.get('regionName') + ' ' + rec.get('address') + '-预算列表',
												width: 600,
												modal: true,
												height: 400,
												layout: 'fit',
												items: [{
													xtype: 'gridpanel',
													autoScroll: true,
													columns: [
														{
															text: '项目名称',
															dataIndex: 'businessAddress',
															flex: 1,
															renderer: function (val, meta, rec){
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
												}],
												buttons: [
													{
														text: '查看预算',
														handler: function (){
															var grid = listWin.down('gridpanel'),
																st = grid.getStore(),
																budgetRec = grid.getSelectionModel().getSelection()[0];
															if (budgetRec) {
																var win = window.open('./fpdf/index2.php?action=view&budgetId=' + budgetRec.getId(),'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
															}
															else {
																showMsg('请选择预算！');
															}
														}
													},
													{
														text: '取消',
														handler: function (){
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
			}, {
				text: '转为工程',
				id: 'button-transferToProjectForSignBusiness',
				name: 'button-transferToProjectForSignBusiness',
				disabled: true,
				hidden: me.checkSignBusiness ? false : true,
				icon: './resources/img/switch1.png',
				handler: function (){
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
						showMsg('请选择具体业务！')
					}
				}
			}],
		    listeners: {
		    	selectionchange: function (view, sels){
		    		var rec = sels[0],
						detailGrid = Ext.getCmp('gridpanel-businessInfoForSignBusiness');
					detailGrid.initBtn(rec);
		    	}
		    }
		}];

		this.callParent();
	}
});