Ext.define('FamilyDecoration.view.deadbusiness.EditDeadBusiness', {
	extend: 'Ext.window.Window',
	alias: 'widget.deadbusiness-editdeadbusiness',

	requires: [
        'FamilyDecoration.view.checklog.MemberList', 'FamilyDecoration.view.mybusiness.RegionList'
    ],

	resizable: false,
	modal: true,
	width: 400,
	height: 240,
	autoScroll: true,
    title: '编辑死单',

	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 255
	},

    deadBusiness: null,
    afterCallback: Ext.emptyFn,

	initComponent: function () {
		var me = this;

		me.items = [
			{
				id: 'textfield-clientName',
				name: 'textfield-clientName',
				xtype: 'textfield',
				fieldLabel: '客户姓名',
				value: me.deadBusiness ? me.deadBusiness.get('customer') : ''
			},
			{
				id: 'textfield-custContact',
				name: 'textfield-custContact',
				xtype: 'textfield',
				fieldLabel: '联系方式',
				value: me.deadBusiness ? me.deadBusiness.get('custContact') : ''
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
						value: me.deadBusiness ? me.deadBusiness.get('regionName') : ''
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
						value: me.deadBusiness ? me.deadBusiness.get('regionId') : ''
					}
				]
			},
			{
				id: 'textfield-detailedAddress',
				name: 'textfield-detailedAddress',
				xtype: 'textfield',
				fieldLabel: '详细地址',
				value: me.deadBusiness ? me.deadBusiness.get('address') : ''
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
						value: me.deadBusiness ? me.deadBusiness.get('salesman') : ''
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
						value: me.deadBusiness ? me.deadBusiness.get('salesmanName') : ''
					}
				]
			},
			{
				id: 'textfield-businessSource',
				name: 'textfield-businessSource',
				xtype: 'textfield',
				fieldLabel: '业务来源',
				value: me.deadBusiness ? me.deadBusiness.get('source') : ''
			}
		];

		me.buttons = [{
			text: '确定',
			handler: function () {
				var client = Ext.getCmp('textfield-clientName'),
					custContact = Ext.getCmp('textfield-custContact'),
					region = Ext.getCmp('textfield-regionList'),
					regionHidden = Ext.getCmp('hiddenfield-regionId'),
					address = Ext.getCmp('textfield-detailedAddress'),
					salesman = Ext.getCmp('textfield-businessStaff'),
					salesmanName = Ext.getCmp('hiddenfield-businessStaffName'),
					source = Ext.getCmp('textfield-businessSource');
				if (client.isValid() && custContact.isValid() && region.isValid() && address.isValid() && salesman.isValid() && source.isValid()) {
					var p = {
						customer: client.getValue(),
						custContact: custContact.getValue(),
						address: address.getValue(),
						regionId: regionHidden.getValue(),
						salesman: salesman.getValue(),
						salesmanName: salesmanName.getValue(),
						source: source.getValue()
					};
					me.deadBusiness && Ext.apply(p, {
						id: me.deadBusiness.getId(),
						isFrozen: false,
						isTransfered: false
					});
					Ext.Ajax.request({
						method: 'POST',
						url: me.deadBusiness ? 'libs/business.php?action=editBusiness' : 'libs/business.php?action=addBusiness',
						params: p,
						callback: function (opts, success, res) {
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									me.deadBusiness ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
                                    me.afterCallback();
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