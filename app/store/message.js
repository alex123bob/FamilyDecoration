Ext.define('FamilyDecoration.store.Message', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Message',

	proxy: {
		type: 'rest',
    	url: './libs/message.php',
        reader: {
            type: 'json'
        },
        extraParams: {
        	action: 'get'
        }
	}
});