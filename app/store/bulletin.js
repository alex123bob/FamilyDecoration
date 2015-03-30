Ext.define('FamilyDecoration.store.Bulletin', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Bulletin',
	proxy: {
        type: 'rest',
        url: './libs/bulletin.php?action=view',
        reader: {
            type: 'json',
            totalProperty: 'totalCount',
            root: 'resultSet'
        },
        extraParams: {
            start: 0,
            limit: 3
        }
    }
});