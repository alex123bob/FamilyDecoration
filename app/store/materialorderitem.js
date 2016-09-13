Ext.define('FamilyDecoration.store.MaterialOrderItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.MaterialOrderItem',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total'
		},
		extraParams: {
			action: 'SupplierOrderItem.get'
		}
	}
});