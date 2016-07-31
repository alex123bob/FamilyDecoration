Ext.define('FamilyDecoration.store.Account', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Account',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'Account.get'
        }
    }
});