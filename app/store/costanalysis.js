Ext.define('FamilyDecoration.store.CostAnalysis', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.CostAnalysis',
	proxy: {
		type: 'rest',
		url: './libs/budget.php',
		reader: {
			type: 'json',
			root: 'total'
		},
		extraParams: {
			action: 'analysis'
		}
	}
});