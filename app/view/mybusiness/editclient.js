Ext.define('FamilyDecoration.view.mybusiness.EditClient', {
	extend: 'Ext.window.Window',
	alias: 'widget.mybusiness-editclient',

	requires: [
		'FamilyDecoration.view.checklog.MemberList', 'FamilyDecoration.view.mybusiness.RegionList',
		'FamilyDecoration.store.PotentialBusiness'
	],

	resizable: false,
	modal: true,
	width: 500,
	height: 450,
	autoScroll: true,
	client: null,

	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 255
	},
	potentialBusiness: undefined,

	initComponent: function () {
		var me = this,
			buildingNumber, houseNumber, unitNumber, addressArr,
			relevantRegionClientSt = Ext.create('FamilyDecoration.store.PotentialBusiness', {
				autoLoad: false,
				proxy: {
					type: 'rest',
					url: './libs/business.php?action=getAllPotentialBusiness',
					reader: {
						type: 'json',
						root: 'data',
						totalProperty: 'total'
					},
					extraParams: {
						isLocked: 'false'
					}
				}
			});

		me.title = me.client ? '编辑客户' : '新建客户';

		if (me.client) {
			addressArr = me.client.get('address').split('-');
			if (addressArr.length == 3) {
				buildingNumber = addressArr[0];
				unitNumber = addressArr[1];
				houseNumber = addressArr[2];
			}
			else if (addressArr.length == 2) {
				buildingNumber = addressArr[0];
				unitNumber = '';
				houseNumber = addressArr[1];
			}
			else {
				buildingNumber = '';
				unitNumber = '';
				houseNumber = me.client.get('address');
			}
		}
		else {
			buildingNumber = '';
			unitNumber = '';
			houseNumber = '';
		}

		function filterPotentialBusiness() {
			var buildingNumber = Ext.getCmp('textfield-buildingNumber'),
				unitNumber = Ext.getCmp('textfield-unitNumber'),
				houseNumber = Ext.getCmp('textfield-houseNumber'),
				hiddenField = Ext.getCmp('hiddenfield-regionId'),
				grid = Ext.getCmp('gridpanel-relevantRegionClient'),
				st = grid.getStore(),
				proxy = st.getProxy(),
				address = [];
			if (buildingNumber.getValue() != '') {
				address.push(buildingNumber.getValue());
			}
			if (unitNumber.getValue() != '') {
				address.push(unitNumber.getValue());
			}
			if (houseNumber.getValue() != '') {
				address.push(houseNumber.getValue());
			}
			if (address.length > 0) {
				address = address.join('-');
				Ext.apply(proxy.extraParams, {
					address: address
				});
			}
			else {
				delete proxy.extraParams.address;
			}
			if (hiddenField.getValue()) {
				Ext.apply(proxy.extraParams, {
					regionID: hiddenField.getValue()
				});
			}
			else {
				delete proxy.extraParams.regionID;
			}
			st.setProxy(proxy);
			if (!proxy.extraParams.address && !proxy.extraParams.regionID) {
				st.removeAll();
				grid.collapse();
			}
			else {
				st.loadPage(1);
				grid.expand();
			}
		}

		function initByPotentialBusiness(rec) {
			var client = Ext.getCmp('textfield-clientName'),
				custContact = Ext.getCmp('textfield-custContact'),
				region = Ext.getCmp('textfield-regionList'),
				regionHidden = Ext.getCmp('hiddenfield-regionId'),
				buildingNumber = Ext.getCmp('textfield-buildingNumber'),
				unitNumber = Ext.getCmp('textfield-unitNumber'),
				houseNumber = Ext.getCmp('textfield-houseNumber'),
				salesman = Ext.getCmp('textfield-businessStaff'),
				salesmanName = Ext.getCmp('hiddenfield-businessStaffName'),
				source = Ext.getCmp('textfield-businessSource'),
				address = rec.get('address').split('-'),
				bn, un, hn;
			client.setValue(rec.get('proprietor')).setReadOnly(true);
			custContact.setValue(rec.get('phone')).setReadOnly(true);
			region.setValue(rec.get('regionName')).nextSibling().disable();
			regionHidden.setValue(rec.get('regionID'));
			salesman.setValue(rec.get('salesman'));
			salesmanName.setValue(rec.get('salesmanName'));
			if (address.length == 3) {
				bn = address[0];
				un = address[1];
				hn = address[2];
			}
			else if (address.length == 2) {
				bn = address[0];
				un = '';
				hn = address[1];
			}
			else {
				bn = '';
				un = '';
				hn = rec.get('address');
			}
			buildingNumber.setValue(bn).setReadOnly(true);
			buildingNumber.clearListeners();
			unitNumber.setValue(un).setReadOnly(true);
			unitNumber.clearListeners();
			houseNumber.setValue(hn).setReadOnly(true);
			houseNumber.clearListeners();
		}

		me.items = [
			{
				id: 'textfield-clientName',
				name: 'textfield-clientName',
				xtype: 'textfield',
				fieldLabel: '客户姓名',
				value: me.client ? me.client.get('customer') : ''
			},
			{
				id: 'textfield-custContact',
				name: 'textfield-custContact',
				xtype: 'textfield',
				fieldLabel: '联系方式',
				value: me.client ? me.client.get('custContact') : ''
			},
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [
					{
						id: 'textfield-regionList',
						name: 'textfield-regionList',
						xtype: 'textfield',
						allowBlank: false,
						fieldLabel: '所属小区',
						readOnly: true,
						width: 255,
						height: '100%',
						value: me.client ? me.client.get('regionName') : ''
					},
					{
						xtype: 'button',
						text: '选择',
						width: 50,
						handler: function () {
							var win = Ext.create('Ext.window.Window', {
								width: 500,
								height: 300,
								layout: 'fit',
								title: '选择小区',
								modal: true,
								items: [{
									xtype: 'mybusiness-regionlist',
									id: 'treepanel-regionList',
									name: 'treepanel-regionList'
								}],
								buttons: [{
									text: '确定',
									handler: function () {
										var tree = Ext.getCmp('treepanel-regionList'),
											txt = Ext.getCmp('textfield-regionList'),
											hidden = Ext.getCmp('hiddenfield-regionId'),
											rec = tree.getSelectionModel().getSelection()[0];

										if (rec && rec.get('parentID') != -1) {
											txt.setValue(rec.get('name'));
											hidden.setValue(rec.getId());
											filterPotentialBusiness();
											win.close();
										}
										else {
											showMsg('请选择小区！');
										}
									}
								}, {
										text: '取消',
										handler: function () {
											win.close();
										}
									}]
							});
							win.show();
						}
					},
					{
						xtype: 'hiddenfield',
						hideLabel: true,
						name: 'hiddenfield-regionId',
						id: 'hiddenfield-regionId',
						value: me.client ? me.client.get('regionId') : ''
					}
				]
			},
			{
				id: 'textfield-buildingNumber',
				name: 'textfield-buildingNumber',
				fieldLabel: '幢',
				xtype: 'textfield',
				value: buildingNumber,
				listeners: {
					blur: function (txt, ev, opts) {
						filterPotentialBusiness();
					}
				}
			},
			{
				id: 'textfield-unitNumber',
				name: 'textfield-unitNumber',
				fieldLabel: '单元号',
				xtype: 'textfield',
				value: unitNumber,
				allowBlank: true,
				listeners: {
					blur: function (txt, ev, opts) {
						filterPotentialBusiness();
					}
				}
			},
			{
				id: 'textfield-houseNumber',
				name: 'textfield-houseNumber',
				fieldLabel: '门牌号',
				xtype: 'textfield',
				value: houseNumber,
				listeners: {
					blur: function (txt, ev, opts) {
						filterPotentialBusiness();
					}
				}
			},
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [
					{
						id: 'textfield-businessStaff',
						name: 'textfield-businessStaff',
						xtype: 'textfield',
						fieldLabel: '业务员',
						allowBlank: false,
						readOnly: true,
						width: 255,
						height: '100%',
						value: me.client ? me.client.get('salesman') : ''
					},
					{
						xtype: 'button',
						text: '选择',
						width: 50,
						handler: function () {
							var win = Ext.create('Ext.window.Window', {
								width: 500,
								height: 300,
								layout: 'fit',
								title: '选择业务员',
								modal: true,
								items: [{
									xtype: 'checklog-memberlist',
									id: 'memberlist-salesmanList',
									name: 'memberlist-salesmanList',
									fullList: true
								}],
								buttons: [{
									text: '确定',
									handler: function () {
										var list = Ext.getCmp('memberlist-salesmanList'),
											rec = list.getSelectionModel().getSelection()[0],
											salesmanShowField = Ext.getCmp('textfield-businessStaff'),
											salesmanValueField = Ext.getCmp('hiddenfield-businessStaffName');

										if (rec && rec.get('name')) {
											salesmanShowField.setValue(rec.get('realname'));
											salesmanValueField.setValue(rec.get('name'));
											win.close();
										}
										else {
											showMsg('请选择业务员！');
										}
									}
								}, {
										text: '取消',
										handler: function () {
											win.close();
										}
									}]
							});
							win.show();
						}
					},
					{
						xtype: 'hiddenfield',
						hideLabel: true,
						name: 'hiddenfield-businessStaffName',
						id: 'hiddenfield-businessStaffName',
						value: me.client ? me.client.get('salesmanName') : ''
					}
				]
			},
			{
				id: 'textfield-businessSource',
				name: 'textfield-businessSource',
				xtype: 'textfield',
				fieldLabel: '业务来源',
				value: me.client ? me.client.get('source') : ''
			},
			{
				xtype: 'gridpanel',
				id: 'gridpanel-relevantRegionClient',
				name: 'gridpanel-relevantRegionClient',
				title: '相关小区客户',
				hideHeaders: true,
				collapsible: true,
				collapsed: true,
				height: 150,
				width: 490,
				header: false,
				store: relevantRegionClientSt,
				bbar: [
					{
						xtype: 'pagingtoolbar',
						store: relevantRegionClientSt,
						displayInfo: false
					}
				],
				columns: [
					{
						text: '小区',
						dataIndex: 'regionName',
						align: 'center',
						flex: 1
					},
					{
						text: '地址',
						dataIndex: 'address',
						align: 'center',
						flex: 1
					},
					{
						xtype: 'actioncolumn',
						width: 50,
						items: [
							{
								icon: 'resources/img/lock.png',
								tooltip: '选择当前小区扫楼业务，则对应扫楼信息将初始化当前编辑的业务',
								handler: function (view, rowIndex, colIndex) {
									var rec = view.getStore().getAt(rowIndex);
									Ext.Msg.warning('确定要选择当前扫楼业务作为当前业务吗？\n点击确定后，对应扫楼业务将被锁定。', function (btnId) {
										if ('yes' == btnId) {
											initByPotentialBusiness(rec);
											view.ownerCt.collapse();
											me.potentialBusiness = rec;
										}
									});
								}
							}
						]
					}
				]

			}
		];

		me.buttons = [{
			text: '确定',
			handler: function () {
				var client = Ext.getCmp('textfield-clientName'),
					custContact = Ext.getCmp('textfield-custContact'),
					region = Ext.getCmp('textfield-regionList'),
					regionHidden = Ext.getCmp('hiddenfield-regionId'),
					buildingNumber = Ext.getCmp('textfield-buildingNumber'),
					unitNumber = Ext.getCmp('textfield-unitNumber'),
					houseNumber = Ext.getCmp('textfield-houseNumber'),
					salesman = Ext.getCmp('textfield-businessStaff'),
					salesmanName = Ext.getCmp('hiddenfield-businessStaffName'),
					source = Ext.getCmp('textfield-businessSource'),
					address;
				if (client.isValid() && custContact.isValid() && region.isValid()
					&& buildingNumber.isValid() && houseNumber.isValid() && salesman.isValid()
					&& source.isValid()) {
					var p = {
						customer: client.getValue(),
						custContact: custContact.getValue(),
						regionId: regionHidden.getValue(),
						salesman: salesman.getValue(),
						salesmanName: salesmanName.getValue(),
						source: source.getValue()
					};
					if (unitNumber.getValue() == '') {
						address = buildingNumber.getValue() + '-' + houseNumber.getValue();
					}
					else {
						address = buildingNumber.getValue() + '-' + unitNumber.getValue() + '-' + houseNumber.getValue();
					}
					Ext.apply(p, {
						address: address
					})
					me.client && Ext.apply(p, {
						id: me.client.getId(),
						isFrozen: false,
						isTransfered: false
					});
					if (me.potentialBusiness) {
						Ext.apply(p, {
							potentialBusinessId: me.potentialBusiness.getId()
						});
					}
					var originalPotentialBusinessId;
					if (me.client) {
						originalPotentialBusinessId = me.client.get('potentialBusinessId');
					}
					Ext.Ajax.request({
						method: 'POST',
						url: me.client ? 'libs/business.php?action=editBusiness' : 'libs/business.php?action=addBusiness',
						params: p,
						callback: function (opts, success, res) {
							if (success) {
								var obj = Ext.decode(res.responseText),
									grid = Ext.getCmp('gridpanel-clientInfo');
								if (obj.status == 'successful') {
									if (me.potentialBusiness) {
										// lock new potential business
										Ext.Ajax.request({
											method: 'POST',
											url: 'libs/business.php?action=editPotentialBusiness',
											params: {
												id: me.potentialBusiness.getId(),
												isLocked: 'true'
											},
											callback: function (opts, success, res) {
												if (success) {
													var obj = Ext.decode(res.responseText);
													if (obj.status == 'successful') {
														showMsg(me.potentialBusiness.get('regionName')
															+ ' ' + me.potentialBusiness.get('address')
															+ '已经被锁定！');
													}
													else {
														showMsg(obj.errMsg);
													}
												}
											}
										});
										// unlock original potential business if the original and the current are not the same.
										// of course the original potential business id should exist.
										if (originalPotentialBusinessId) {
											Ext.Ajax.request({
												url: './libs/business.php?action=editPotentialBusiness',
												method: 'POST',
												params: {
													id: originalPotentialBusinessId,
													isLocked: 'false'
												},
												callback: function (opts, success, res) {
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.status == 'successful') {
															showMsg('该业务原对应扫楼业务已被解锁！');
														}
														else {
															showMsg(obj.errMsg);
														}
													}
												}
											});
										}
									}
									me.client ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									grid.refresh(regionHidden.getId());
								}
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
			}]

		this.callParent();
	}
});