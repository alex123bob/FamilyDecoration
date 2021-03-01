Ext.define('FamilyDecoration.store.NormCost', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.NormCost',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'CostNorm.get'
        }
    }
});