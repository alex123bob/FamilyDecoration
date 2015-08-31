Ext.define('FamilyDecoration.view.regionmgm.EditPotentialBusiness', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-editpotentialbusiness',

	resizable: false,
	modal: true,
	width: 500,
	height: 280,
	autoScroll: true,
	bodyPadding: 10,

	region: null,
	grid: null,
	potentialBusiness: null,

	initComponent: function (){
		var me = this;
		
		me.title = me.potentialBusiness ? '编辑' : '新建';

		me.items = [{
			xtype: 'form',
			defaultType: 'textfield',
			layout: 'anchor',
			defaults: {
			    anchor: '100%',
			    allowBlank: false
			},
			items: [{
				fieldLabel: '地址',
				name: 'address',
				value: me.potentialBusiness ? me.potentialBusiness.get('address') : ''
			}, {
				fieldLabel: '业主姓名',
				name: 'proprietor',
				value: me.potentialBusiness ? me.potentialBusiness.get('proprietor') : ''
			}, {
				fieldLabel: '联系方式',
				name: 'phone',
				value: me.potentialBusiness ? me.potentialBusiness.get('phone') : ''
			}, {
				fieldLabel: '状态',
				name: 'status',
				value: me.potentialBusiness ? me.potentialBusiness.get('status') : ''
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var frm = me.down('form');
				if (frm.isValid()) {
					var frmVals = frm.getValues();
					Ext.apply(frmVals, {
						regionID: me.region.getId(),
						salesman: User.getRealName(),
						salesmanName: User.getName()
					});
					if (me.potentialBusiness) {
						Ext.apply(frmVals, {
							id: me.potentialBusiness.getId()
						})
					}
					Ext.Ajax.request({
						url: me.potentialBusiness ? './libs/business.php?action=editPotentialBusiness' : './libs/business.php?action=addPotentialBusiness',
						method: 'POST',
						params: frmVals,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									me.potentialBusiness ? showMsg('编辑成功！') : showMsg('添加成功！');
									me.grid.refresh(me.region);
									me.close();
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
			handler: function () {
				me.close();
			}
		}]

		this.callParent();
	}
});