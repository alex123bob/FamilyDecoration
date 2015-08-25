Ext.define('FamilyDecoration.view.regionmgm.EditRegion', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-editregion',

	resizable: false,
	modal: true,
	width: 400,
	height: 240,
	autoScroll: true,
	community: null,
	bodyPadding: 10,
	defaults: {
		width: 340
	},

	initComponent: function (){
		var me = this;
		
		me.title = me.community ? '修改小区' : '新建小区';

		me.items = [{
			id: 'textfield-communityName',
			name: 'textfield-communityName',
			allowBlank: false,
			xtype: 'textfield',
			fieldLabel: '小区名称',
			value: me.community ? me.community.get('name') : ''
		}, {
			id: 'textarea-communityNameRemark',
			name: 'textarea-communityNameRemark',
			allowBlank: true,
			xtype: 'textarea',
			fieldLabel: '小区简介',
			value: me.community ? me.community.get('nameRemark') : ''
		}, {
			xtype: 'fieldcontainer',
			hidden: me.community ? false : true,
			layout: 'hbox',
			hideLabel: true,
			width: '100%',
			items: [{
				xtype: 'textfield',
				fieldLabel: '所在区域',
				allowBlank: false
			}, {
				xtype: 'button',
				text: '选择',
				handler: function (){

				}
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var txt = Ext.getCmp('textfield-communityName'),
					remark = Ext.getCmp('textfield-communityNameRemark');
				if (txt.isValid()) {
					var p = {
						name: txt.getValue(),
						nameRemark: remark.getValue()
					};
					me.community && Ext.apply(p, {
						id: me.community.getId()
					})
					Ext.Ajax.request({
						method: 'POST',
						url: me.community ? 'libs/business.php?action=editRegion' : 'libs/business.php?action=addRegion',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									me.community ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
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