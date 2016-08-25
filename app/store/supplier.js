Ext.define('FamilyDecoration.store.Supplier', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Supplier',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data'
		},
		extraParams: {
			action: 'Supplier.get'
		}
	}
});