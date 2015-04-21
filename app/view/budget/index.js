Ext.define('FamilyDecoration.view.budget.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-index',
	requires: ['FamilyDecoration.view.budget.BudgetPanel'],
	layout: 'fit',

	initComponent: function () {
		var me = this;

		me.items = [
			{
				xtype: 'budget-budgetpanel',
				name: 'panel-budgetPanel',
				id: 'panel-budgetPanel',
				region: 'center'
				// isSynchronousCalculation: false
			}
		];

		me.listeners = {
		}

		this.callParent();
	}
})