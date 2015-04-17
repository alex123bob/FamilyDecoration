Ext.define('FamilyDecoration.view.budget.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-index',
	requires: ['FamilyDecoration.view.budget.BudgetPanel', 'FamilyDecoration.view.budget.EditBudgetHeader'],
	layout: 'fit',

	initComponent: function () {
		var me = this;

		me.items = [
			{
				xtype: 'budget-budgetpanel',
				name: 'panel-budgetPanel',
				id: 'panel-budgetPanel',
				// bbar: [{
				// 	text: '导出预算',
				// 	handler: function (){
				// 		var header = Ext.getCmp('gridpanel-budgetheader'),
				// 			headerSt = header.getStore(),
				// 			projectName;

				// 		projectName = headerSt.getAt(1).get('content');

				// 		if (projectName) {
				// 			Ext.Ajax.request({
				// 				url: './libs/budget.php?action=list',
				// 				method: 'GET',
				// 				callback: function (opts, success, res){
				// 					if (success) {
				// 						var obj = Ext.decode(res.responseText),
				// 							flag = false,
				// 							budgetId;
				// 						Ext.each(obj, function (rec){
				// 							if (rec.projectName == projectName) {
				// 								flag = true;
				// 								budgetId = rec.budgetId;
				// 							}
				// 						});
				// 						if (!flag) {
				// 							Ext.Msg.info('请先保存预算！');
				// 						}
				// 						else {
				// 							var exportFrame = document.getElementById('exportFrame');
				// 							exportFrame.src = './fpdf/index2.php?budgetId=' + budgetId;
				// 						}
				// 					}
				// 				}
				// 			})
				// 		}
				// 		else {
				// 			Ext.Msg.info('工程地址为空！');
				// 		}
				// 	}
				// }, {
				// 	text: '打印预算',
				// 	handler: function (){
				// 		var header = Ext.getCmp('gridpanel-budgetheader'),
				// 			headerSt = header.getStore(),
				// 			projectName;

				// 		projectName = headerSt.getAt(1).get('content');

				// 		if (projectName) {
				// 			Ext.Ajax.request({
				// 				url: './libs/budget.php?action=list',
				// 				method: 'GET',
				// 				callback: function (opts, success, res){
				// 					if (success) {
				// 						var obj = Ext.decode(res.responseText),
				// 							flag = false,
				// 							budgetId;
				// 						Ext.each(obj, function (rec){
				// 							if (rec.projectName == projectName) {
				// 								flag = true;
				// 								budgetId = rec.budgetId;
				// 							}
				// 						});
				// 						if (!flag) {
				// 							Ext.Msg.info('请先保存预算！');
				// 						}
				// 						else {
				// 							var win = window.open('./fpdf/index2.php?action=view&budgetId=' + budgetId,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
				// 							win.print();
				// 						}
				// 					}
				// 				}
				// 			})
				// 		}
				// 		else {
				// 			Ext.Msg.info('工程地址为空！');
				// 		}
				// 	}
				// }, {
				// 	text: '预览预算',
				// 	handler: function (){
				// 		var panel = Ext.getCmp('panel-budgetContent'),
				// 			header = Ext.getCmp('gridpanel-budgetheader'),
				// 			grid = panel.down('gridpanel'),
				// 			headerSt = header.getStore(),
				// 			st = grid.getStore();
				// 		var win = Ext.create('FamilyDecoration.view.budget.Preview', {
				// 			datas: st.data.items,
				// 			headerInfo: {
				// 				custName: headerSt.getAt(0).get('content'),
				// 				projectName: headerSt.getAt(1).get('content')
				// 			}
				// 		});
				// 		win.show();
				// 	}
				// }],
				region: 'center'
			}
		];

		me.listeners = {
		}

		this.callParent();
	}
})