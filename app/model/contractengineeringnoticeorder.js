Ext.define('FamilyDecoration.model.ContracteEngineeringNoticeOrder', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'contractId', type: 'string'},
		{name: 'title', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'creator', type: 'string'},
        {name: 'creatorName', type: 'string'},
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'ContracteEngineeringNoticeOrder.update'
        }
    }
});