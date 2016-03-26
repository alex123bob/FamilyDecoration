Ext.define('FamilyDecoration.store.BudgetTemplate', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BudgetTemplate',

	proxy: {
		type: 'rest',
    	url: './libs/budget.php',
    	extraParams: {
    		action: 'getBudgetTemplate'
    	},
        reader: {
            type: 'json'
        }
	}
});