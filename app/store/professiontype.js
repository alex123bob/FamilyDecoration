Ext.define('FamilyDecoration.store.ProfessionType', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.ProfessionType',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data'
		},
		extraParams: {
			action: 'ProfessionType.get'
		}
	}
});