Ext.define('FamilyDecoration.store.BudgetItem', {
	model: 'FamilyDecoration.model.BudgetItem',
	proxy: {
		type: 'rest',
		url: './libs/budget.php?action=itemlist'
	}
});