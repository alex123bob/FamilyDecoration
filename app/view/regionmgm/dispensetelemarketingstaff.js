Ext.define('FamilyDecoration.view.regionmgm.DispenseTelemarketingStaff', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-dispensetelemarketingstaff',

	requires: [],

	resizable: false,
	modal: true,
	width: 400,
	height: 140,
	autoScroll: true,

	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 255
	},
    title: '分配电销人员',

    region: undefined,
    grid: undefined,
    potentialBusiness: undefined,

	initComponent: function () {
		var me = this;

		me.items = [
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [
					{
						id: 'textfield-telemarketingStaff',
						name: 'textfield-telemarketingStaff',
						xtype: 'textfield',
						fieldLabel: '电销人员',
						allowBlank: false,
						readOnly: true,
						width: 255,
						height: '100%',
						value: me.potentialBusiness ? me.potentialBusiness.get('telemarketingStaff') : ''
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
								title: '选择电销人员',
								modal: true,
								items: [{
									xtype: 'checklog-memberlist',
									id: 'memberlist-telemarketingStaffList',
									name: 'memberlist-telemarketingStaffList',
									fullList: true
								}],
								buttons: [{
									text: '确定',
									handler: function () {
										var list = Ext.getCmp('memberlist-telemarketingStaffList'),
											rec = list.getSelectionModel().getSelection()[0],
											salesmanShowField = Ext.getCmp('textfield-telemarketingStaff'),
											salesmanValueField = Ext.getCmp('hiddenfield-telemarketingStaffName');

										if (rec && rec.get('name')) {
											salesmanShowField.setValue(rec.get('realname'));
											salesmanValueField.setValue(rec.get('name'));
											win.close();
										}
										else {
											showMsg('请选择电销人员！');
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
						name: 'hiddenfield-telemarketingStaffName',
						id: 'hiddenfield-telemarketingStaffName',
						value: me.client ? me.client.get('telemarketingStaffName') : ''
					}
				]
			}
		];

		me.buttons = [{
			text: '确定',
			handler: function () {
				var telemarketingStaff = Ext.getCmp('textfield-telemarketingStaff'),
					telemarketingStaffName = Ext.getCmp('hiddenfield-telemarketingStaffName');
				if (telemarketingStaff.isValid()) {
					var p = {
						telemarketingStaff: telemarketingStaff.getValue(),
						telemarketingStaffName: telemarketingStaffName.getValue()
					};
					me.potentialBusiness && Ext.apply(p, {
						id: me.potentialBusiness.getId()
					});
					Ext.Ajax.request({
						method: 'POST',
						url: me.potentialBusiness ? 'libs/business.php?action=editPotentialBusiness' : '',
						params: p,
						callback: function (opts, success, res) {
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
                                    showMsg('分配成功！');
									me.close();
                                    me.grid.refresh(me.region);
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