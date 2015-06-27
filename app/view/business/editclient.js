Ext.define('FamilyDecoration.view.business.EditClient', {
	extend: 'Ext.window.Window',
	alias: 'widget.business-editclient',

	resizable: false,
	modal: true,
	width: 400,
	height: 210,
	autoScroll: true,

	community: null,
	client: null,
	
	bodyPadding: 4,
	defaults: {
		allowBlank: false
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
			id: 'textfield-detailedAddress',
			name: 'textfield-detailedAddress',
			xtype: 'textfield',
			fieldLabel: '详细地址',
			value: me.client ? me.client.get('address') : ''
		}, {
			id: 'textfield-businessStaff',
			name: 'textfield-businessStaff',
			xtype: 'textfield',
			fieldLabel: '业务员',
			value: me.client ? me.client.get('salesman') : ''
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
					address = Ext.getCmp('textfield-detailedAddress'),
					salesman = Ext.getCmp('textfield-businessStaff'),
					source = Ext.getCmp('textfield-businessSource');
				if (client.isValid() && address.isValid() && salesman.isValid() && source.isValid()) {
					var p = {
						customer: client.getValue(),
						address: address.getValue(),
						regionId: me.community.getId(),
						salesman: salesman.getValue(),
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
									grid = Ext.getCmp('gridpanel-clientInfo'),
									communityGrid = Ext.getCmp('gridpanel-community');
								if (obj.status == 'successful') {
									me.client ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									grid.refresh(me.community);
									communityGrid.refresh();
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