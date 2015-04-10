Ext.define('FamilyDecoration.view.mainmaterial.EditMainMaterial', {
	extend: 'Ext.window.Window',
	alias: 'widget.mainmaterial-editmainmaterial',
	requires: [],

	width: 500,
	height: 350,
	modal: true,

	mainmaterial: null,
	projectId: undefined,

	defaults: {
		xtype: 'textfield',
		allowBlank: false,
		labelWidth: 200,
		width: '100%'
	},

	initComponent: function (){
		var me = this;

		me.title = (me.mainmaterial ? '编辑' : '添加') + '内容',

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
			fieldLabel: '商家',
			id: 'textfield-productMerchant',
			name: 'textfield-productMerchant',
			value: me.mainmaterial ? me.mainmaterial.get('productMerchant') : ''
		}, {
			fieldLabel: '联系人及联系人号码',
			id: 'textfield-productContact',
			name: 'textfield-productContact',
			value: me.mainmaterial ? me.mainmaterial.get('productContact') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var name = Ext.getCmp('textfield-productName'),
					type = Ext.getCmp('textfield-productType'),
					number = Ext.getCmp('textfield-productNumber'),
					merchant = Ext.getCmp('textfield-productMerchant'),
					contact = Ext.getCmp('textfield-productContact'),
					obj = {
						projectId: me.projectId
					};
				if (name.isValid() && type.isValid() && number.isValid() && merchant.isValid() && contact.isValid()) {
					me.mainmaterial && Ext.apply(obj, {
						id: me.mainmaterial.getId()
					});
					Ext.apply(obj, {
						productName: name.getValue(),
						productType: type.getValue(),
						productNumber: number.getValue(),
						productMerchant: merchant.getValue(),
						productContact: contact.getValue()
					});
					Ext.Ajax.request({
						url: me.mainmaterial ? './libs/mainmaterial.php?action=editMaterial' : './libs/mainmaterial.php?action=addMaterial',
						method: 'POST',
						params: obj,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									treepanel = Ext.getCmp('treepanel-projectNameForMainMaterial'),
									rec = treepanel.getSelectionModel().getSelection()[0],
									gridpanel = Ext.getCmp('gridpanel-mainMaterialContent');
								if (obj.status == 'successful') {
									me.mainmaterial ? showMsg('编辑成功！') : showMsg('添加成功！');
									me.close();
									gridpanel.refresh(rec);
								}
								else {
									Ext.Msg.error(obj.errMsg);
								}
							}
						}
					});
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];

		this.callParent();
	}
});