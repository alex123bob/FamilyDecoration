Ext.define('FamilyDecoration.view.signbusiness.EditBusinessInfo', {
	extend: 'Ext.window.Window',
	alias: 'widget.signbusiness-editbusinessinfo',

	modal: true,
	width: 500,
	height: 200,
	infoObj: null,
	infoGrid: null,
	rec: null,
	layout: 'fit',

	initComponent: function (){
		var me = this;
		
		me.title = me.infoObj ? '编辑信息' : '新建信息';

		me.items = [{
			id: 'textarea-businessInfo',
			name: 'textarea-businessInfo',
			xtype: 'textarea',
			fieldLabel: '信息名称',
			allowBlank: false,
			value: me.infoObj ? me.infoObj.get('content') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var rec = me.rec,
					area = Ext.getCmp('textarea-businessInfo'),
					p = {
						content: area.getValue()
					};
				if (area.isValid()) {
					// 编辑详细信息内容
					if (me.infoObj) {
						Ext.apply(p, {
							id: me.infoObj.getId()
						})
					}
					// 增加详细信息内容
					else {
						Ext.apply(p, {
							businessId: rec.getId()
						})
					}
					Ext.Ajax.request({
						method: 'POST',
						url: me.infoObj ? 'libs/business.php?action=editBusinessDetail' : 'libs/business.php?action=addBusinessDetail',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									infoGrid = me.infoGrid;
								if (obj.status == 'successful') {
									me.infoObj ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									infoGrid.refresh(rec);
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