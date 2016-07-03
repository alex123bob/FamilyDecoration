Ext.define('FamilyDecoration.store.PotentialBusinessDetail', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.PotentialBusinessDetail',

	proxy: {
		type: 'rest',
    	url: './libs/business.php?action=getAllPotentialBusinessDetail',
        reader: {
            type: 'json'
        }
	}
});