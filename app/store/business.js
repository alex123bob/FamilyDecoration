Ext.define('FamilyDecoration.store.Business', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Business',

	proxy: {
		type: 'rest',
    	url: './libs/business.php',
        reader: {
            type: 'json'
        },
        extraParams: {
        	action: 'getBusinessByRegion'
        }
	}
});