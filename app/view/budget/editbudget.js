Ext.define('FamilyDecoration.view.budget.EditBudget', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-editbudget',
	requires: ['FamilyDecoration.store.BudgetItem'],

	header: false,

	initComponent: function (){
		var me = this;

		var store = Ext.create('FamilyDecoration.store.BudgetItem');

		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'hbox'
		}]
	}
})