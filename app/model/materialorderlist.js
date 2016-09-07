Ext.define('FamilyDecoration.model.MaterialOrderList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'projectName', type: 'string'},
        {name: 'captain', type: 'string'},
        {name: 'captainRealName', type: 'string'},
        {name: 'billType', type: 'string'},
        'totalFee',
        'createTime',
        'status',
        'claimAmount',
        'paidAmount'
    ],
    idProperty: 'id'
});