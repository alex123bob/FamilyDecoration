Ext.define('FamilyDecoration.store.SupplierMaterial', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.SupplierMaterial',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total'
		},
		extraParams: {
			action: 'SupplierMaterial.get'
		}
	}
});