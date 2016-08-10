Ext.define('FamilyDecoration.store.BusinessGoal', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BusinessGoal',
	proxy: {
		type: 'rest',
    	url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'BusinessGoal.get'
        }
	}
});