Ext.define('FamilyDecoration.store.ContractEngineeringNoticeOrder', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.ContractEngineeringNoticeOrder',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'ContractEngineeringNoticeOrder.get'
        }
    }
});