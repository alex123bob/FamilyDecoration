Ext.define('FamilyDecoration.store.AttachmentManagement', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.AttachmentManagement',
	proxy: {
        type: 'rest',
		url: './libs/api.php',
		reader: {
			type: 'json',
			root: 'data'
		},
		extraParams: {
			action: 'UploadFile.get'
		}
    }
});