Ext.define('FamilyDecoration.store.Msg', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Msg',

	proxy: {
		type: 'rest',
    	url: './libs/msg.php',
        reader: {
            type: 'json'
        },
        extraParams: {
        	action: 'getsendmsgs'
        }
	}
});