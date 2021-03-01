Ext.define('FamilyDecoration.store.NormCostItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.NormCostItem',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'CostRefNormItem.get'
        }
    }
});