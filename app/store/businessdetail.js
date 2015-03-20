Ext.define('FamilyDecoration.store.BusinessDetail', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BusinessDetail',

	proxy: {
		type: 'rest',
    	url: './libs/business.php?action=getBusinessDetails',
        reader: {
            type: 'json'
        }
	}
});