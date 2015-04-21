Ext.define('FamilyDecoration.store.TotalCost', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.TotalCost',
	proxy: {
		type: 'rest',
		url: './libs/budget.php',
		reader: {
			type: 'json',
			root: 'cost'
		},
		extraParams: {
			action: 'analysis'
		}
	}
});