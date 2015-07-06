Ext.define('FamilyDecoration.view.mybusiness.EditCommunity', {
	extend: 'Ext.window.Window',
	alias: 'widget.mybusiness-editcommunity',

	resizable: false,
	modal: true,
	width: 351,
	height: 140,
	autoScroll: true,
	community: null,
	bodyPadding: 10,

	initComponent: function (){
		var me = this;
		
		me.title = me.community ? '编辑小区' : '新建小区';

		me.items = [{
			id: 'textfield-communityName',
			name: 'textfield-communityName',
			allowBlank: false,
			xtype: 'textfield',
			fieldLabel: '小区名称',
			value: me.community ? me.community.get('name') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var txt = Ext.getCmp('textfield-communityName');
				if (txt.isValid()) {
					var p = {
						name: txt.getValue()
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
								var obj = Ext.decode(res.responseText),
									grid = Ext.getCmp('gridpanel-community');
								if (obj.status == 'successful') {
									me.community ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									grid.refresh();
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