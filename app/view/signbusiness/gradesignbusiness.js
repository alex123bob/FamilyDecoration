Ext.define('FamilyDecoration.view.signbusiness.GradeSignBusiness', {
	extend: 'Ext.window.Window',
	alias: 'widget.signbusiness-gradesignbusiness',

	resizable: false,
	modal: true,
	width: 300,
	height: 200,
	autoScroll: true,
	bodyPadding: 10,
	title: '签单业务评级',
	signbusiness: null,
	grid: null,

	initComponent: function (){
		var me = this,
			rec = me.signbusiness,
			grid = me.grid;

		me.items = [{
			xtype: 'combobox',
			fieldLabel: '签单业务评级',
			editable: false,
			allowBlank: false,
			store: Ext.create('Ext.data.Store', {
				fields: ['name'],
				data: [
					{name: 'A'},
					{name: 'B'},
					{name: 'C'},
					{name: 'D'}
				]
			}),
			queryMode: 'local',
		    displayField: 'name',
		    valueField: 'name',
		    value: rec.get('signBusinessLevel')
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var combo = me.down('combobox');
				if (combo.isValid()) {
					Ext.Ajax.request({
						url: './libs/business.php?action=gradeBusiness',
						method: 'POST',
						params: {
							signBusinessLevel: combo.getValue(),
							id: rec.getId()
						},
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									showMsg('签单业务评级成功！');
									grid.refresh();
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
		}];

		this.callParent();
	}
});