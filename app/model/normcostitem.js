Ext.define('FamilyDecoration.model.NormCostItem', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'normId', type: 'string'},
        {name: 'itemId', type: 'string'},
        {name: 'version', type: 'int'},
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'CostRefNormItem.update'
        }
    }
});