Ext.define('FamilyDecoration.store.Community', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Community',

	proxy: {
		type: 'rest',
    	url: './libs/business.php',
        reader: {
            type: 'json'
        },
        extraParams: {
    		action: 'getRegionList'
    	}
	}
});