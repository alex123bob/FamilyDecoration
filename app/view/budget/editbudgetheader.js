Ext.define('FamilyDecoration.view.budget.EditBudgetHeader', {
	extend: 'Ext.window.Window',
	requires: ['FamilyDecoration.view.budget.BudgetHeader'],
	width: 500,
	height: 300,
	layout: 'fit',
	modal: true,

	budget: null,
	budgetPanel: null,

	initComponent: function (){
		var me = this;

		me.title = me.budget ? '编辑预算头信息' : '新建预算头信息';

		me.items = [{
			header: false,
			xtype: 'budget-budgetheader',
			budget: me.budget
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var grid = me.down('budget-budgetheader');
				if (grid.isEmpty()) {
					showMsg('头信息填写不完整！');
				}
				else {
					var data = grid.getValue();
					Ext.apply(data, {
						totalFee: ''
					});
					me.budget && Ext.apply(data, {
						budgetId: me.budget['budgetId']
					});
					Ext.Ajax.request({
						url: me.budget ? './libs/budget.php?action=edit' : './libs/budget.php?action=add',
						method: 'POST',
						params: data,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									if (me.budget) {
										showMsg('编辑成功！');
									}
									else {
										showMsg('新建预算头信息成功！');
										me.budgetPanel.budgetId = obj['budgetId'];
									}
									me.close();
								}
								else {
									showMsg(obj.errMsg);
								}
							}
						}
					});
				}
			}
		}, {
			text: '取消',
			handler: function (){
				win.close();
			}
		}]

		me.callParent();
	}
})