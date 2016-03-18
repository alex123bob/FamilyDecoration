Ext.define('FamilyDecoration.view.mybusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mybusiness-index',
	requires: ['FamilyDecoration.view.mybusiness.EditCommunity', 'FamilyDecoration.view.mybusiness.EditClient',
			   'FamilyDecoration.view.mybusiness.TransferToProject', 'FamilyDecoration.view.mybusiness.EditInfo',
			   'FamilyDecoration.store.Community', 'FamilyDecoration.store.Business', 'FamilyDecoration.store.BusinessDetail',
			   'FamilyDecoration.store.User'],

	autoScroll: true,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	checkBusiness: false,
	businessStaff: null,

	salesmanName: undefined,
	businessId: undefined,

	refresh: function (){
		var businessGrid = Ext.getCmp('gridpanel-clientInfo'),
			deadGrid = Ext.getCmp('gridpanel-frozenBusiness');
		businessGrid.refresh();
		deadGrid.refresh();
	},

	initComponent: function (){
		var me = this;

		var businessSt = Ext.create('FamilyDecoration.store.Business', {
			autoLoad: me.checkBusiness ? false : true,
			filters: [
				function (item){
					if (me.businessId || me.salesmanName) {
						return me.businessId == item.getId();
					}
					else {
						return true;
					}
				}
			],
			proxy: {
				type: 'rest',
				url: './libs/business.php',
		        reader: {
		            type: 'json'
		        },
		        extraParams: {
		        	action: 'getBusiness',
		        	salesmanName: me.businessStaff ? me.businessStaff.get('salesmanName') : User.getName(),
		        	isFrozen: false
		        }
			}
		});

		me.items = [{
			xtype: 'container',
			flex: 2,
			layout: 'border',
			margin: '0 1 0 0',
			items: [{
				autoScroll: true,
				region: 'center',
				hideHeaders: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'gridpanel',
				title: '业务名称',
				id: 'gridpanel-clientInfo',
				name: 'gridpanel-clientInfo',
				width: '100%',
				tools: [{
					hidden: me.businessId || me.salesmanName ? true : (me.checkBusiness && User.isAdministrationManager() ? true : false),
					type: 'gear',
					disabled: true,
					id: 'tool-frozeBusiness',
					name: 'tool-frozeBusiness',
					tooltip: '转为死单',
					callback: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							rec = clientGrid.getSelectionModel().getSelection()[0],
							fronzenGrid = Ext.getCmp('gridpanel-frozenBusiness');

						Ext.Msg.warning('确定要将"' + rec.get('address') + '"转为死单吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/business.php?action=frozeBusiness&businessId=' + rec.getId(),
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('转换成功！');
												clientGrid.refresh();
												fronzenGrid.refresh();
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
				}],
				columns: [{
					text: '小区名称',
					flex: 1,
					dataIndex: 'regionName',
					renderer: function (val, meta, rec){
						return val;
					}
				}, {
					text: '门牌号',
					flex: 1,
					dataIndex: 'address',
					renderer: function (val, meta, rec){
						var level = rec.get('level');
						if (level == 'A') {
							meta.style = 'background: lightpink;';
						}
						else if (level == 'B') {
							meta.style = 'background: lightgreen;';
						}
						else if (level == 'C') {
							meta.style = 'background: cornsilk;';
						}
						else if (level == 'D') {
							meta.style = 'background: sandybrown;';
						}
						else {

						}
						if (rec.get('applyDesigner') == 1) {
							meta.style += 'color: #ffff00;';
						}
						if (level != '') {
							val = val + '[<strong><font color="blue">' + level + '</font></strong>]';
						}
						return val;
					}
				}],
				store: businessSt,
				dockedItems: [{
					dock: 'top',
					xtype: 'toolbar',
					items: [{
						xtype: 'searchfield',
						flex: 1,
						store: businessSt,
						paramName: 'address'
					}]
				}],
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editClient'),
						delBtn = Ext.getCmp('button-delClient'),
						rankBtn = Ext.getCmp('button-categorization'),
						gearBtn = Ext.getCmp('tool-frozeBusiness'),
						applyDesignerBtn = Ext.getCmp('button-applyForDesigner'),
						reminder = Ext.getCmp('button-checkBusinessRemind');

					editBtn.setDisabled(!rec);
					delBtn.setDisabled(!rec);
					gearBtn.setDisabled(!rec);
					rankBtn.setDisabled(!rec);
					reminder.setDisabled(!rec);
					if (rec && rec.get('applyDesigner') == 0) {
						applyDesignerBtn.enable();
					}
					else {
						applyDesignerBtn.disable();
					}
				},
				refresh: function (){
					var grid = this,
						st = grid.getStore(),
						rec = grid.getSelectionModel().getSelection()[0];
					st.reload({
						params: {
							action: 'getBusiness',
				        	salesmanName: me.businessStaff ? me.businessStaff.get('salesmanName') : User.getName(),
				        	isFrozen: false
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
				},
				tbar: Ext.create('Ext.toolbar.Toolbar', {
					enableOverflow: true,
					items: [{
						text: '添加',
						id: 'button-addClient',
						name: 'button-addClient',
						hidden: me.businessId || me.salesmanName ? false : (User.isAdministrationManager() && me.checkBusiness ? true : false),
						icon: './resources/img/add.png',
						handler: function (){
							var win = Ext.create('FamilyDecoration.view.mybusiness.EditClient', {
							});
							win.show();
						}
					}, {
						text: '修改',
						id: 'button-editClient',
						name: 'button-editClient',
						hidden: me.businessId || me.salesmanName ? false : (User.isAdministrationManager() && me.checkBusiness ? true : false),
						icon: './resources/img/edit2.png',
						disabled: true,
						handler: function (){
							var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
								client = clientGrid.getSelectionModel().getSelection()[0];
							if (client) {
								var win = Ext.create('FamilyDecoration.view.mybusiness.EditClient', {
									client: client
								});
								win.show();
							}
							else {
								showMsg('请选择业务！');
							}
						}
					}]
				}),
				bbar: Ext.create('Ext.toolbar.Toolbar', {
					enableOverflow: true,
					items: [{
						text: '删除',
						hidden: !(User.isAdmin() || (User.isManager() && !User.isAdministrationManager()) || (!me.checkBusiness && User.isAdministrationManager()) ),
						id: 'button-delClient',
						name: 'button-delClient',
						icon: './resources/img/delete.png',
						disabled: true,
						handler: function (){
							Ext.Msg.warning('确定要删除当前客户信息吗？', function (id){
								var grid = Ext.getCmp('gridpanel-clientInfo'),
									rec = grid.getSelectionModel().getSelection()[0];
								if (id == 'yes') {
									Ext.Ajax.request({
										url: './libs/business.php?action=deleteBusiness',
										method: 'POST',
										params: {
											id: rec.getId()
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('删除成功！');
													grid.refresh();
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
						text: '评级',
						id: 'button-categorization',
						name: 'button-categorization',
						icon: './resources/img/category.png',
						hidden: me.checkBusiness && User.isAdministrationManager() ? true : false,
						disabled: true,
						handler: function (){
							var	clientGrid = Ext.getCmp('gridpanel-clientInfo'),
								rec = clientGrid.getSelectionModel().getSelection()[0],
								fronzenGrid = Ext.getCmp('gridpanel-frozenBusiness');
							var win = Ext.create('Ext.window.Window', {
								width: 300,
								height: 200,
								padding: 10,
								modal: true,
								title: '客户类型评级',
								items: [{
									xtype: 'combobox',
									fieldLabel: '客户评级',
									editable: false,
									allowBlank: false,
									store: Ext.create('Ext.data.Store', {
										fields: ['name'],
										data: [
											{name: 'A'},
											{name: 'B'},
											{name: 'C'},
											{name: 'D'}
										]
									}),
									queryMode: 'local',
								    displayField: 'name',
								    valueField: 'name',
								    value: rec.get('level')
	 							}],
								buttons: [{
									text: '确定',
									handler: function (){
										var combo = win.down('combobox');
										if (combo.isValid()) {
											Ext.Ajax.request({
												url: './libs/business.php?action=clientRank',
												method: 'POST',
												params: {
													level: combo.getValue(),
													id: rec.getId()
												},
												callback: function (opts, success, res){
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.status == 'successful') {
															showMsg('评级成功！');
															clientGrid.refresh();
															fronzenGrid.refresh();
															win.close();
														}
														else {
															showMsg(obj.errMsg);
														}
													}
												}
											})
										}
									}
								}, {
									text: '取消',
									handler: function (){
										win.close();
									}
								}]
							});

							win.show();
						}
					}]
				}),
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							grid = Ext.getCmp('gridpanel-clientInfo'),
							detailGrid = Ext.getCmp('gridpanel-businessInfo'),
							transferBtn = Ext.getCmp('button-transferToProject'),
							distributeDesignerBtn = Ext.getCmp('button-distributeDesigner');
						grid.initBtn(rec);
						detailGrid.refresh(rec);
						transferBtn.setDisabled(!rec);
						distributeDesignerBtn.setDisabled(!rec);
					}
				}
			}, {
				autoScroll: true,
				hideHeaders: true,
				height: 200,
				region: 'south',
				hidden: me.businessId || me.salesmanName ? true : false,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'gridpanel',
				title: '死单',
				id: 'gridpanel-frozenBusiness',
				name: 'gridpanel-frozenBusiness',
				columns: [{
					text: '小区名称',
					flex: 1,
					dataIndex: 'regionName',
					renderer: function (val, meta, rec){
						return val;
					}
				}, {
					text: '门牌号',
					flex: 1,
					dataIndex: 'address',
					renderer: function (val, meta, rec){
						return val;
					}
				}],
				store: Ext.create('FamilyDecoration.store.Business', {
					autoLoad:  me.checkBusiness ? false : true,
					proxy: {
						type: 'rest',
						url: './libs/business.php',
				        reader: {
				            type: 'json'
				        },
				        extraParams: {
				        	action: 'getBusiness',
				        	isFrozen: true,
				        	salesmanName: me.businessStaff ? me.businessStaff.get('salesmanName') : User.getName()
				        }
					}
				}),
				tools: [{
					type: 'gear',
					disabled: true,
					hidden: me.checkBusiness && User.isAdministrationManager() ? true : false,
					id: 'tool-restoreBusiness',
					name: 'tool-restoreBusiness',
					tooltip: '恢复死单',
					callback: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							fronzenGrid = Ext.getCmp('gridpanel-frozenBusiness'),
							rec = fronzenGrid.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要将	"' + rec.get('address') + '"恢复吗', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/business.php?action=defrostBusiness&businessId=' + rec.getId(),
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('恢复成功！');
												clientGrid.refresh();
												fronzenGrid.refresh();
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
				}],
				refresh: function (){
					var grid = this,
						st = grid.getStore(),
						rec = grid.getSelectionModel().getSelection()[0];
					st.reload({
						params: {
							action: 'getBusiness',
				        	isFrozen: true,
				        	salesmanName: me.businessStaff ? me.businessStaff.get('salesmanName') : User.getName()
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
				},
				initBtn: function (rec){
					var gearBtn = Ext.getCmp('tool-restoreBusiness');

					gearBtn.setDisabled(!rec);
				},
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							grid = Ext.getCmp('gridpanel-frozenBusiness');
						grid.initBtn(rec);
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 5,
			layout: 'fit',
			items: [{
				hideHeaders: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'gridpanel',
				id: 'gridpanel-businessInfo',
				name: 'gridpanel-businessInfo',
				title: '信息情况',
				height: 400,
				autoScroll: true,
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editBusinessInfo'),
						delBtn = Ext.getCmp('button-delBusinessInfo');

					editBtn.setDisabled(!rec);
					delBtn.setDisabled(!rec);
				},
				refresh: function (client){
					var clientName = Ext.getCmp('textfield-clientNameOnTop'),
						businessStaff = Ext.getCmp('textfield-businessStaffOnTop'),
						businessSource = Ext.getCmp('textfield-businessSourceOnTop'),
						businessDesigner = Ext.getCmp('textfield-businessDesignerOnTop');
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
			        },
			        {
			        	text: '创建时间',
			        	flex: 1,
			        	dataIndex: 'createTime',
			        	renderer: function (val, meta, rec) {
			        		return val;
			        	}
			        }
			    ],
			    store: Ext.create('FamilyDecoration.store.BusinessDetail', {
			    	autoLoad: false
			    }),
			    tbar: Ext.create('Ext.toolbar.Toolbar', {
					enableOverflow: true,
					items: [{
						xtype: 'textfield',
						name: 'textfield-clientNameOnTop',
						id: 'textfield-clientNameOnTop',
						labelWidth: 60,
						width: 140,
						readOnly: true,
						fieldLabel: ' 客户姓名'
					}, {
						xtype: 'textfield',
						name: 'textfield-businessStaffOnTop',
						id: 'textfield-businessStaffOnTop',
						labelWidth: 60,
						width: 140,
						readOnly: true,
						fieldLabel: '业务员'
					}, {
						xtype: 'textfield',
						name: 'textfield-businessDesignerOnTop',
						id: 'textfield-businessDesignerOnTop',
						labelWidth: 60,
						width: 140,
						readOnly: true,
						fieldLabel: '设计师'
					}, {
						xtype: 'textfield',
						name: 'textfield-businessSourceOnTop',
						id: 'textfield-businessSourceOnTop',
						labelWidth: 60,
						width: 150,
						readOnly: true,
						fieldLabel: '业务来源'
					}]
				}),
			    bbar: [{
					text: '添加',
					id: 'button-addBusinessInfo',
					name: 'button-addBusinessInfo',
					icon: './resources/img/add2.png',
					hidden: me.checkBusiness && User.isAdministrationManager() ? true : false,
					handler: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							rec = clientGrid.getSelectionModel().getSelection()[0];
						if (rec) {
							var win = Ext.create('FamilyDecoration.view.mybusiness.EditInfo', {

							});

							win.show();
						}
						else {
							showMsg('请先选择地址！');
						}
					}
				}, {
					text: '修改',
					id: 'button-editBusinessInfo',
					name: 'button-editBusinessInfo',
					icon: './resources/img/edit3.png',
					hidden: me.checkBusiness && User.isAdministrationManager() ? true : false,
					disabled: true,
					handler: function (){
						var detailGrid = Ext.getCmp('gridpanel-businessInfo'),
							rec = detailGrid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mybusiness.EditInfo', {
							infoObj: rec
						});

						win.show();
					}
				}, {
					text: '删除',
					id: 'button-delBusinessInfo',
					name: 'button-delBusinessInfo',
					icon: './resources/img/delete2.png',
					hidden: me.checkBusiness && User.isAdministrationManager() ? true : false,
					disabled: true,
					handler: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							client = clientGrid.getSelectionModel().getSelection()[0],
							detailGrid = Ext.getCmp('gridpanel-businessInfo'),
							rec = detailGrid.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要删除当前信息吗？', function (id){
							if ('yes' == id) {
								Ext.Ajax.request({
									url: './libs/business.php?action=deleteBusinessDetail',
									method: 'POST',
									params: {
										detailId: rec.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												detailGrid.refresh(client);
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
					text: '转为工程',
					id: 'button-transferToProject',
					name: 'button-transferToProject',
					icon: './resources/img/transfer.png',
					disabled: true,
					// hidden: me.checkBusiness ? false : true,
					hidden: true,
					handler: function (){
						var communityGrid = Ext.getCmp('gridpanel-community'),
							clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							community = communityGrid.getSelectionModel().getSelection()[0],
							client = clientGrid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mybusiness.TransferToProject', {
							community: community,
							client: client
						});
						win.show();
					}
				}, {
					text: '申请设计师',
					id: 'button-applyForDesigner',
					name: 'button-applyForDesigner',
					disabled: true,
					hidden: me.checkBusiness ? true : false,
					icon: './resources/img/apply-designer.png',
					handler: function (){
						Ext.Ajax.request({
							url: './libs/user.php?action=view',
							method: 'GET',
							callback: function (opts, success, res){
								if (success) {
									var userArr = Ext.decode(res.responseText),
										mailObjects = [],
										addressGrid = Ext.getCmp('gridpanel-clientInfo'),
										frozenAddressGrid = Ext.getCmp('gridpanel-frozenBusiness'),
										address = addressGrid.getSelectionModel().getSelection()[0];
									for (var i = 0; i < userArr.length; i++) {
										var level = userArr[i].level;
										if (/^001-\d{3}$/i.test(level) || '004-001' == level 
											|| '002-001' == level) {
											mailObjects.push(userArr[i]);
										}
									}

									if (address) {
										if (mailObjects.length > 0) {
											Ext.Msg.confirm('设计师申请确认', '确定要为此业务申请设计师吗？', function (btnId){
												if (btnId == 'yes') {
													Ext.Ajax.request({
														url: './libs/business.php?action=applyfordesigner',
														method: 'POST',
														params: {
															businessId: address.getId()
														},
														callback: function (opts, success, res){
															if (success) {
																var obj = Ext.decode(res.responseText);
																if (obj.status == 'successful') {
																	Ext.Msg.info('申请已发送，请耐心等待！');
																}
																else {
																	showMsg(obj.errMsg);
																}
															}
														}
													});

													// announce related staffs via email
													var content = User.getRealName() + '为业务[' + address.get('regionName') + ' ' + address.get('address') + ']申请设计师，等待您确认处理。',
														subject = '申请设计师通知';
													for (i = 0; i < mailObjects.length; i++) {
														setTimeout((function (index){
															return function (){
																sendMsg(User.getName(), mailObjects[index].name, content, 'applyDesigner', address.getId());
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
										showMsg('请选择需要申请设计师的业务！');
									}
								}
							}
						});
					}
				}, {
					text: '分配设计师',
					id: 'button-distributeDesigner',
					name: 'button-distributeDesigner',
					disabled: true,
					hidden: me.checkBusiness && !User.isAdministrationManager() ? false : true,
					icon: './resources/img/add4.png',
					handler: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							infoGrid = Ext.getCmp('gridpanel-businessInfo'),
							client = clientGrid.getSelectionModel().getSelection()[0];
						var win = Ext.create('Ext.window.Window', {
							title: '[' + client.get('regionName') + ' ' + client.get('address') + ']分配设计师',
							layout: 'fit',
							modal: true,
							width: 300,
							height: 220,
							items: [{
								xtype: 'gridpanel',
								id: 'gridpanel-designerList',
								name: 'gridpanel-designerList',
								columns: [{
									text: '姓名',
									dataIndex: 'realname',
									flex: 1
								}, {
									text: '部门',
									dataIndex: 'level',
									flex: 1,
									renderer: function (val) {
										return User.renderDepartment(val);
									}
								}, {
									text: '职位',
									dataIndex: 'level',
									flex: 1,
									renderer: function (val) {
										return User.renderRole(val);
									}
								}],
								store: Ext.create('FamilyDecoration.store.User', {
									autoLoad: true,
									filters: [
										function (item){
											if (/^002-\d{3}$/i.test(item.get('level'))) {
												return true;
											}
										}
									]
								}),
								autoScroll: true
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var grid = Ext.getCmp('gridpanel-designerList'),
										rec = grid.getSelectionModel().getSelection()[0];
									if (rec) {
										Ext.Ajax.request({
											url: './libs/business.php?action=distributeDesigner',
											params: {
												businessId: client.getId(),
												designerName: rec.get('name'),
												designer: rec.get('realname')
											},
											method: 'POST',
											callback: function (opts, success, res){
												if (success) {
													var obj = Ext.decode(res.responseText),
														subject = '分配设计师',
														content = User.getRealName() + '为业务"' 
															+ client.get('regionName') + ' ' + client.get('address') + '"'
															+ '分配了设计师，设计师为"' + rec.get('realname') + '"';
													if (obj.status == 'successful') {
														showMsg('分配成功！');
														win.close();
														clientGrid.refresh();
														sendMail(rec.get('name'), rec.get('mail'), subject, content);
														sendMsg(User.getName(), rec.get('name'), content, 'assignDesigner', client.getId());
													}
												}
											}
										})
									}
									else {
										showMsg('请选择设计师！');
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}, {
					text: '提醒',
					id: 'button-checkBusinessRemind',
					name: 'button-checkBusinessRemind',
					icon: './resources/img/alarm.png',
					disabled: true,
					hidden: me.checkBusiness && !User.isAdministrationManager() ? false : true,
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '业务员提醒',
							modal: true,
							width: 500,
							height: 300,
							layout: 'vbox',
							items: [{
								flex: 7,
								width: '100%',
								xtype: 'textarea',
								autoScroll: true,
								allowBlank: false
							}, {
								xtype: 'checkbox',
								width: '100%',
								flex: 1,
								boxLabel: '短信提醒'
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var txtArea = win.down('textarea'),
										chk = win.down('checkbox'),
										clientGrid = Ext.getCmp('gridpanel-clientInfo'),
										rec = clientGrid.getSelectionModel().getSelection()[0],
										content = '', subject = '',
										business = rec.get('regionName') + ' ' + rec.get('address');
									if (txtArea.isValid()) {
										if (rec) {
											subject = '业务提醒[' + business + ']';
											content = User.getRealName() + '对[' + business 
													  + ']发送业务提醒，提醒内容为：' + txtArea.getValue();
											sendMsg(User.getName(), rec.get('salesmanName'), content, 'businessAlert', rec.getId());
											Ext.Ajax.request({
												url: './libs/user.php?action=view',
												method: 'GET',
												callback: function (opts, success, res){
													if (success) {
														var arr = Ext.decode(res.responseText),
															mail = '', phone = '';
														for (var i = 0; i < arr.length; i++) {
															if (arr[i]['name'] == rec.get('salesmanName')) {
																mail = arr[i]['mail'];
																phone = arr[i]['phone'];
																break;
															}
														}
														sendMail(rec.get('salesmanName'), mail, subject, content);
														chk.getValue() && sendSMS(User.getName(), rec.get('salesmanName'), phone, content);
														showMsg('提醒成功！');
														win.close();
													}
												}
											});
										}
										else {
											showMsg('当前业务没有业务员！');
										}
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}],
			    listeners: {
			    	selectionchange: function (view, sels){
			    		var rec = sels[0],
							detailGrid = Ext.getCmp('gridpanel-businessInfo');
						detailGrid.initBtn(rec);
			    	}
			    }
			}]
		}];

		this.callParent();
	}
});