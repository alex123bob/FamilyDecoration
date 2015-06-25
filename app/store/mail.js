Ext.define('FamilyDecoration.store.Mail', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Mail',

	proxy: {
		type: 'rest',
    	url: './libs/mail.php',
        reader: {
            type: 'json'
        }
	}
});