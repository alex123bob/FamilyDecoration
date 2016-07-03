Ext.define('FamilyDecoration.store.PotentialBusinessDetail', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.PotentialBusinessDetail',

	proxy: {
		type: 'rest',
    	url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'PotentialBusinessDetail.get'
        }
	}
});