Ext.define('FamilyDecoration.model.ContractEngineeringChangelog', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'contractId', type: 'string'},
		{name: 'changeContent', type: 'string'},
        {name: 'creator', type: 'string'},
        {name: 'creatorName', type: 'string'},
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'ContractEngineeringChangelog.update'
        }
    }
});