Ext.define('FamilyDecoration.store.PotentialBusiness', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.PotentialBusiness',

	proxy: {
		type: 'rest',
    	url: './libs/business.php?action=getAllPotentialBusiness',
        reader: {
            type: 'json'
        }
	}
});