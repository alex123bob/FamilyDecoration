Ext.define('FamilyDecoration.store.BudgetItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BudgetItem',
	proxy: {
		type: 'rest',
		url: './libs/budget.php?action=itemlist'
	}
});