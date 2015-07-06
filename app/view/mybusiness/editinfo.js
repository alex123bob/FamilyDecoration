Ext.define('FamilyDecoration.view.mybusiness.EditInfo', {
	extend: 'Ext.window.Window',
	alias: 'widget.mybusiness-editinfo',

	// resizable: false,
	modal: true,
	width: 500,
	height: 200,
	infoObj: null,
	layout: 'fit',

	initComponent: function (){
		var me = this;
		
		me.title = me.infoObj ? '编辑信息' : '新建信息';

		me.items = [{
			id: 'textarea-infoContent',
			name: 'textarea-infoContent',
			xtype: 'textarea',
			fieldLabel: '信息名称',
			allowBlank: false,
			value: me.infoObj ? me.infoObj.get('content') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
					rec = clientGrid.getSelectionModel().getSelection()[0],
					area = Ext.getCmp('textarea-infoContent'),
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
									infoGrid = Ext.getCmp('gridpanel-businessInfo');
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