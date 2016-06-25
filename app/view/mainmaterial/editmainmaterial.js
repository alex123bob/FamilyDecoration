Ext.define('FamilyDecoration.view.mainmaterial.EditMainMaterial', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainmaterial-editmainmaterial',
	requires: [],

	width: 500,
	height: 280,
	modal: true,

	mainmaterial: null,
	projectId: undefined,
	project: null,
	bodyPadding: 5,
	layout: 'vbox',

	defaults: {
		xtype: 'textfield',
		allowBlank: false,
		labelWidth: 200,
		width: '100%',
		flex: 1
	},

	initComponent: function () {
		var me = this,
			st = Ext.create('Ext.data.Store', {
				fields: ['id', 'value'],
				autoLoad: true,
				proxy: {
					type: 'rest',
					url: 'libs/mainmaterial.php',
					reader: {
						type: 'json',
						root: 'data'
					},
					extraParams: {
						action: 'getMaterialType'
					}
				}
			});

		me.title = (me.mainmaterial ? '编辑' : '添加') + '内容';

		me.items = [{
			fieldLabel: '产品名称',
			id: 'textfield-productName',
			name: 'textfield-productName',
			value: me.mainmaterial ? me.mainmaterial.get('productName') : ''
		}, {
				fieldLabel: '型号',
				id: 'textfield-productType',
				name: 'textfield-productType',
				value: me.mainmaterial ? me.mainmaterial.get('productType') : ''
			}, {
				fieldLabel: '数量',
				id: 'textfield-productNumber',
				name: 'textfield-productNumber',
				value: me.mainmaterial ? me.mainmaterial.get('productNumber') : ''
			}, {
				fieldLabel: '商家及联系人',
				id: 'textfield-productMerchant',
				name: 'textfield-productMerchant',
				value: me.mainmaterial ? me.mainmaterial.get('productMerchant') : ''
			}, {
				fieldLabel: '预定时间及预定人',
				id: 'textfield-productSchedule',
				name: 'textfield-productSchedule',
				value: me.mainmaterial ? me.mainmaterial.get('productSchedule') : ''
			}, {
				fieldLabel: '送货时间',
				id: 'textfield-productDeliver',
				name: 'textfield-productDeliver',
				value: me.mainmaterial ? me.mainmaterial.get('productDeliver') : ''
			}, {
				fieldLabel: '对应主材',
				xtype: 'combobox',
				queryMode: 'local',
				displayField: 'value',
				valueField: 'id',
				id: 'combobox-materialType',
				name: 'combobox-materialType',
				store: st,
				editable: false,
				value: me.mainmaterial ? me.mainmaterial.get('materialType') : ''
			}];

		me.buttons = [{
			text: '确定',
			handler: function () {
				var name = Ext.getCmp('textfield-productName'),
					type = Ext.getCmp('textfield-productType'),
					number = Ext.getCmp('textfield-productNumber'),
					merchant = Ext.getCmp('textfield-productMerchant'),
					schedule = Ext.getCmp('textfield-productSchedule'),
					deliver = Ext.getCmp('textfield-productDeliver'),
					materialType = Ext.getCmp('combobox-materialType'),
					obj = {
						projectId: me.projectId
					};
				if (name.isValid() && type.isValid() && number.isValid() && merchant.isValid() 
					&& schedule.isValid() && deliver.isValid() && materialType.isValid()) {
					me.mainmaterial && Ext.apply(obj, {
						id: me.mainmaterial.getId()
					});
					Ext.apply(obj, {
						productName: name.getValue(),
						productType: type.getValue(),
						productNumber: number.getValue(),
						productMerchant: merchant.getValue(),
						productSchedule: schedule.getValue(),
						productDeliver: deliver.getValue(),
						materialType: materialType.getValue()
					});

					Ext.Ajax.request({
						url: './libs/user.php?action=view',
						method: 'GET',
						callback: function (opts, success, res) {
							if (success) {
								var userArr = Ext.decode(res.responseText),
									mailObjects = [];
								for (var i = 0; i < userArr.length; i++) {
									var level = userArr[i].level;
									if (me.project.get('captainName') == userArr[i].name) {
										mailObjects.push(userArr[i]);
									}
								}

								Ext.Ajax.request({
									url: me.mainmaterial ? './libs/mainmaterial.php?action=editMaterial' : './libs/mainmaterial.php?action=addMaterial',
									method: 'POST',
									params: obj,
									callback: function (opts, success, res) {
										if (success) {
											var obj = Ext.decode(res.responseText),
												treepanel = Ext.getCmp('treepanel-projectNameForMainMaterial'),
												rec = treepanel.getSelectionModel().getSelection()[0],
												gridpanel = Ext.getCmp('gridpanel-mainMaterialContent');
											if (obj.status == 'successful') {
												me.mainmaterial ? showMsg('编辑成功！') : showMsg('添加成功！');
												me.close();
												gridpanel.refresh(rec);

												if (!me.mainmaterial) {
													// announce related staffs via email
													var content = User.getRealName() + '为工程"' + me.project.get('projectName') + '"添加主材订购。',
														subject = '主材订购创建通知';
													for (i = 0; i < mailObjects.length; i++) {
														setTimeout((function (index) {
															return function () {
																sendMail(mailObjects[index].name, mailObjects[index].mail, subject, content);
															}
														})(i), 1000 * (i + 1));
													}
													// end of announcement
												}
											}
											else {
												Ext.Msg.error(obj.errMsg);
											}
										}
									}
								});
							}
						}
					});
				}
			}
		}, {
				text: '取消',
				handler: function () {
					me.close();
				}
			}];

		this.callParent();
	}
});