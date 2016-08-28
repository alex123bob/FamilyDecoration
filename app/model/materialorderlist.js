Ext.define('FamilyDecoration.model.MaterialOrderList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'projectName', type: 'string'},
        {name: 'captain', type: 'string'},
        {name: 'captainRealName', type: 'string'},
        'orderTotalFee',
        'orderId',
        'orderCreateTime',
        'orderStatus',
        'claimAmount',
        'paidAmount'
    ],
    idProperty: 'id'
});