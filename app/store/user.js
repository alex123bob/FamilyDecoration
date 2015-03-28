Ext.define('FamilyDecoration.store.User', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.User',

	proxy: {
		type: 'rest',
    	url: './libs/user.php?action=view',
        reader: {
            type: 'json'
        }
	}
});