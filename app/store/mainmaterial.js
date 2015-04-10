Ext.define('FamilyDecoration.store.MainMaterial', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.MainMaterial',

	proxy: {
		type: 'rest',
    	url: './libs/mainmaterial.php?action=getMaterialsByProjectId',
        reader: {
            type: 'json'
        }
	}
});