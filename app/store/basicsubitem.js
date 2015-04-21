Ext.define('FamilyDecoration.store.BasicSubItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.BasicSubItem',

	proxy: {
		type: 'rest',
    	url: './libs/subitem.php?action=get',
        reader: {
            type: 'json'
        }
	}
});