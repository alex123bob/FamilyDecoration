Ext.define('FamilyDecoration.view.budget.Preview', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-preview',

	// resizable: false,
	modal: true,
	layout: 'fit',
	maximizable: true,

	requires: ['FamilyDecoration.view.budget.BudgetContent'],

	title: '预览',
	width: 520,
	height: 300,
	autoScroll: true,
	datas: undefined,
	headerInfo: undefined,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'budget-budgetcontent',
			isForPreview: true
		}];

		me.on('show', function (win){
			var panel = win.items.items[0],
				grid = panel.down('gridpanel'),
				custName = panel.down('[name="displayfield-custName"]'),
				projectName = panel.down('[name="displayfield-projectName"]'),
				st = grid.getStore();
			custName.setValue(me.headerInfo.custName);
			projectName.setValue(me.headerInfo.projectName);
			st.loadData(win.datas);
		});

		this.callParent();
	}
});