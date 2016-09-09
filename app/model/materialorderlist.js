Ext.define('FamilyDecoration.model.MaterialOrderList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'projectName', type: 'string'},
        {name: 'captain', type: 'string'},
        {name: 'captainRealName', type: 'string'},
        {name: 'creator', type: 'string'},
        {name: 'creatorRealName', type: 'string'},
        {name: 'billType', type: 'string'},
        'totalFee',
        'createTime',
        'status',
        'statusName',
        'claimAmount',
        'paidAmount'
    ],
    idProperty: 'id'
});