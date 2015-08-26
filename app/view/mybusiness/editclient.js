Ext.define('FamilyDecoration.view.mybusiness.EditClient', {
	extend: 'Ext.window.Window',
	alias: 'widget.mybusiness-editclient',

	requires: ['FamilyDecoration.view.checklog.MemberList', 'FamilyDecoration.view.mybusiness.RegionList'],

	resizable: false,
	modal: true,
	width: 400,
	height: 240,
	autoScroll: true,
	client: null,
	
	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 255
	},

	initComponent: function (){
		var me = this;
		
		me.title = me.client ? '编辑客户' : '新建客户';

		me.items = [{
			id: 'textfield-clientName',
			name: 'textfield-clientName',
			xtype: 'textfield',
			fieldLabel: '客户姓名',
			value: me.client ? me.client.get('customer') : ''
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			width: '100%',
			items: [{
				id: 'textfield-regionList',
				name: 'textfield-regionList',
				xtype: 'textfield',
				allowBlank: false,
				fieldLabel: '所属小区',
				readOnly: true,
				width: 255,
				height: '100%',
				value: me.client ? me.client.get('regionName') : ''
			}, {
				xtype: 'button',
				text: '选择',
				width: 50,
				handler: function (){
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
							handler: function (){
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
							handler: function (){
								win.close();
							}
						}]
					});
					win.show();
				}
			}, {
				xtype: 'hiddenfield',
				hideLabel: true,
				name: 'hiddenfield-regionId',
				id: 'hiddenfield-regionId',
				value: me.client ? me.client.get('regionId') : ''
			}]
		}, {
			id: 'textfield-detailedAddress',
			name: 'textfield-detailedAddress',
			xtype: 'textfield',
			fieldLabel: '详细地址',
			value: me.client ? me.client.get('address') : ''
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			width: '100%',
			items: [{
				id: 'textfield-businessStaff',
				name: 'textfield-businessStaff',
				xtype: 'textfield',
				fieldLabel: '业务员',
				allowBlank: false,
				readOnly: true,
				width: 255,
				height: '100%',
				value: me.client ? me.client.get('salesman') : ''
			}, {
				xtype: 'button',
				text: '选择',
				width: 50,
				handler: function (){
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
							handler: function (){
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
							handler: function (){
								win.close();
							}
						}]
					});
					win.show();
				}
			}, {
				xtype: 'hiddenfield',
				hideLabel: true,
				name: 'hiddenfield-businessStaffName',
				id: 'hiddenfield-businessStaffName',
				value: me.client ? me.client.get('salesmanName') : ''
			}]
		}, {
			id: 'textfield-businessSource',
			name: 'textfield-businessSource',
			xtype: 'textfield',
			fieldLabel: '业务来源',
			value: me.client ? me.client.get('source') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var client = Ext.getCmp('textfield-clientName'),
					region = Ext.getCmp('textfield-regionList'),
					regionHidden = Ext.getCmp('hiddenfield-regionId'),
					address = Ext.getCmp('textfield-detailedAddress'),
					salesman = Ext.getCmp('textfield-businessStaff'),
					salesmanName = Ext.getCmp('hiddenfield-businessStaffName'),
					source = Ext.getCmp('textfield-businessSource');
				if (client.isValid() && region.isValid() && address.isValid() && salesman.isValid() && source.isValid()) {
					var p = {
						customer: client.getValue(),
						address: address.getValue(),
						regionId: regionHidden.getValue(),
						salesman: salesman.getValue(),
						salesmanName: salesmanName.getValue(),
						source: source.getValue()
					};
					me.client && Ext.apply(p, {
						id: me.client.getId(),
						isFrozen: false,
						isTransfered: false
					});
					Ext.Ajax.request({
						method: 'POST',
						url: me.client ? 'libs/business.php?action=editBusiness' : 'libs/business.php?action=addBusiness',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									grid = Ext.getCmp('gridpanel-clientInfo');
								if (obj.status == 'successful') {
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