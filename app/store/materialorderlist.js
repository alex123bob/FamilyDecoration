Ext.define('FamilyDecoration.store.MaterialOrderList', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.MaterialOrderList',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data'
		},
		extraParams: {
			action: 'MaterialOrderList.get'
		}
	}
});