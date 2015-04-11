Ext.define('FamilyDecoration.store.BasicItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BasicItem',

	proxy: {
		type: 'rest',
    	url: './libs/basicitem.php?action=getbasicitems',
        reader: {
            type: 'json'
        }
	}
});