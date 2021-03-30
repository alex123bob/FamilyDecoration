Ext.define('FamilyDecoration.store.ContractEngineeringChangelog', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.ContractEngineeringChangelog',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'ContractEngineeringChangelog.get'
        }
    }
});