Ext.define('FamilyDecoration.store.CostListItem', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.CostListItem',
    // proxy: {
    //     type: 'rest',
    //     url: './libs/api.php',
    //     reader: {
    //         type: 'json',
    //         root: 'data'
    //     },
    //     extraParams: {
    //         action: 'Account.get'
    //     }
    // }
});