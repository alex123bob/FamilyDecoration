Ext.define('FamilyDecoration.store.MaterialOrderList', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.MaterialOrderList',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total'
		},
		extraParams: {
			action: 'StatementBill.getWithSupplier',
			billType: 'mtf'
		}
	}
});