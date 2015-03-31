Ext.define('FamilyDecoration.store.ChartDetail', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.ChartDetail',

	proxy: {
		type: 'rest',
    	url: './libs/chartdetail.php',
        reader: {
            type: 'json'
        }
	}
});