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
		pageParam: false, //to remove param "page"
		startParam: false, //to remove param "start"
		limitParam: false, //to remove param "limit"
		noCache: false, //to remove param "_dc"
		extraParams: {
			action: 'ProfessionType.get'
		}
	}
});