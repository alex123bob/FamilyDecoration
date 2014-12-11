Ext.define('FamilyDecoration.store.Chart', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Chart',

	proxy: {
		type: 'rest',
    	url: './libs/getcategories.php',
        reader: {
            type: 'json'
        }
	}
});