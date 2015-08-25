Ext.define('FamilyDecoration.store.RegionList', {
	extend: 'Ext.data.TreeStore',
	model: 'FamilyDecoration.model.RegionList',

	proxy: {
		type: 'rest',
    	url: './libs/business.php',
        reader: {
            type: 'json'
        },
        extraParams: {
        	action: 'getRegionList'
        }
	}
});