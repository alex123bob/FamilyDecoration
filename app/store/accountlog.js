Ext.define('FamilyDecoration.store.AccountLog', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.AccountLog',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'AccountLog.get'
        }
    }
});