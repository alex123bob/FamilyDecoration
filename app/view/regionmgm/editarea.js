Ext.define('FamilyDecoration.view.regionmgm.EditArea', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-editarea',

	resizable: false,
	modal: true,
	width: 351,
	height: 140,
	autoScroll: true,
	area: null,
	bodyPadding: 10,
	grid: null,

	initComponent: function (){
		var me = this;
		
		me.title = me.area ? '编辑区域' : '新建区域';

		me.items = [{
			id: 'textfield-areaName',
			name: 'textfield-areaName',
			allowBlank: false,
			xtype: 'textfield',
			fieldLabel: '区域名称',
			value: me.area ? me.area.get('name') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var txt = Ext.getCmp('textfield-areaName');
				if (txt.isValid()) {
					var p = {
						name: txt.getValue(),
						nameRemark: ''
					};
					me.area && Ext.apply(p, {
						id: me.area.getId()
					})
					Ext.Ajax.request({
						method: 'POST',
						url: me.area ? 'libs/business.php?action=editRegion' : 'libs/business.php?action=addRegion',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									me.area ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									me.grid.refresh();
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