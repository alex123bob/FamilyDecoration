Ext.define('FamilyDecoration.store.ProjectProgress', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.ProjectProgress',
	proxy: {
		type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data'
		},
		extraParams: {
			action: 'ProjectProgress.get'
		}
	}
});