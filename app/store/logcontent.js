Ext.define('FamilyDecoration.store.LogContent', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.LogContent',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'LogList.getDetail'
        }
    }
});