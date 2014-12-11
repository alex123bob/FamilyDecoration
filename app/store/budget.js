Ext.define('FamilyDecoration.store.Budget', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Budget',

	proxy: {
		type: 'rest',
    	url: './libs/budget.php',
    	extraParams: {
    		action: 'list'
    	},
        reader: {
            type: 'json'
        }
	}
});