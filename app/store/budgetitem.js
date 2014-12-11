Ext.define('FamilyDecoration.store.BudgetItem', {
	model: 'FamilyDecoration.model.BudgetItem',
	proxy: {
		type: 'rest',
		extraParams: {
			action: 'view'
		},
		reader: {
			url: './libs/budgetitem.php',
			type: 'json'
		}
	}
});