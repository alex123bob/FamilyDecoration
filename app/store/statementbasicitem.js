Ext.define('FamilyDecoration.store.StatementBasicItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.StatementBasicItem',
	proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
        	action: 'StatementBasicItem.get',
        }
    }
});