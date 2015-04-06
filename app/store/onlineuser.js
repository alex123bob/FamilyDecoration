Ext.define('FamilyDecoration.store.OnlineUser', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.OnlineUser',
	proxy: {
        type: 'rest',
        url: './libs/user.php?action=getOnlineUsers',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            limit: 30,
            order: 'desc'
        }
    }
});