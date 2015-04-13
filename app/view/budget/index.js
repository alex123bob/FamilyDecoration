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
				html: '<iframe id="exportFrame"  src="javascript:void(0);" style="display:none"></iframe>',
				tbar: [{
					text: '编辑预算头信息',
					handler: function (){
						if (me.budgetId) {
							Ext.Ajax.request({
								url: './libs/budget.php?action=view',
								params: {
									budgetId: me.budgetId,
								},
								method: 'GET',
								callback: function (opts, success, res){
									if (success) {
										var budget = Ext.decode(res.responseText);
										budget = budget[0];
										var win = Ext.create('FamilyDecoration.view.budget.EditBudgetHeader', {
											budget: budget,
											budgetPanel: me
										});
										win.show();
									}
								}
							});
						}
						else {
							var win = Ext.create('FamilyDecoration.view.budget.EditBudgetHeader', {
								budgetPanel: me
							});
							var addBtn = Ext.getCmp('button-addBasicItem');
							me.budgetId && addBtn.enable();
							win.show();
						}
					}
				}, {
					text: '新建项目',
					disabled: true,
					id: 'button-addBasicItem',
					name: 'button-addBasicItem',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.budget.AddBasicItem', {
							grid: Ext.getCmp('panel-budgetContent').down('gridpanel'),
							budgetPanel: me
						});

						win.show();
					}
				}, {
					text: '添加到已有大项',
					id: 'button-addBasicItemToExistedOne',
					name: 'button-addBasicItemToExistedOne',
					disabled: true,
					handler: function (){

					}
				}, {
					text: '保存预算',
					disabled: true,
					id: 'button-saveBudget',
					name: 'button-saveBudget',
					handler: function (){

					}
				}],
				bbar: [{
					text: '导出预算',
					handler: function (){
						var header = Ext.getCmp('gridpanel-budgetheader'),
							headerSt = header.getStore(),
							projectName;

						projectName = headerSt.getAt(1).get('content');

						if (projectName) {
							Ext.Ajax.request({
								url: './libs/budget.php?action=list',
								method: 'GET',
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText),
											flag = false,
											budgetId;
										Ext.each(obj, function (rec){
											if (rec.projectName == projectName) {
												flag = true;
												budgetId = rec.budgetId;
											}
										});
										if (!flag) {
											Ext.Msg.info('请先保存预算！');
										}
										else {
											var exportFrame = document.getElementById('exportFrame');
											exportFrame.src = './fpdf/index2.php?budgetId=' + budgetId;
										}
									}
								}
							})
						}
						else {
							Ext.Msg.info('工程地址为空！');
						}
					}
				}, {
					text: '打印预算',
					handler: function (){
						var header = Ext.getCmp('gridpanel-budgetheader'),
							headerSt = header.getStore(),
							projectName;

						projectName = headerSt.getAt(1).get('content');

						if (projectName) {
							Ext.Ajax.request({
								url: './libs/budget.php?action=list',
								method: 'GET',
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText),
											flag = false,
											budgetId;
										Ext.each(obj, function (rec){
											if (rec.projectName == projectName) {
												flag = true;
												budgetId = rec.budgetId;
											}
										});
										if (!flag) {
											Ext.Msg.info('请先保存预算！');
										}
										else {
											var win = window.open('./fpdf/index2.php?action=view&budgetId=' + budgetId,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
											win.print();
										}
									}
								}
							})
						}
						else {
							Ext.Msg.info('工程地址为空！');
						}
					}
				}, {
					text: '预览预算',
					handler: function (){
						var panel = Ext.getCmp('panel-budgetContent'),
							header = Ext.getCmp('gridpanel-budgetheader'),
							grid = panel.down('gridpanel'),
							headerSt = header.getStore(),
							st = grid.getStore();
						var win = Ext.create('FamilyDecoration.view.budget.Preview', {
							datas: st.data.items,
							headerInfo: {
								custName: headerSt.getAt(0).get('content'),
								projectName: headerSt.getAt(1).get('content')
							}
						});
						win.show();
					}
				}, {
					text: '历史预算',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.budget.History', {

						});
						win.show();
					}
				}],
				region: 'center'
			}
		];

		me.listeners = {
		}

		this.callParent();
	}
})