Ext.define('FamilyDecoration.store.BasicItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BasicItem',

	proxy: {
		type: 'rest',
    	url: './libs/getbasicitems.php',
        reader: {
            type: 'json'
        }
	}
});