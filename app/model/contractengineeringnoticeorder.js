Ext.define('FamilyDecoration.model.ContractEngineeringNoticeOrder', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'contractId', type: 'string'},
		{name: 'title', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'price', type: 'string'},
        {name: 'creator', type: 'string'},
        {name: 'creatorName', type: 'string'},
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'ContractEngineeringNoticeOrder.update'
        }
    }
});