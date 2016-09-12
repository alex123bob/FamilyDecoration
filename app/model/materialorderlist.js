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
        {name: 'checker', type: 'string'},
		{name: 'checkerRealName', type: 'string'},
        'totalFee',
        'createTime',
        'status',
        'statusName',
        'claimAmount',
        'paidAmount',
        {name: 'supplierId', type: 'string'},
        {name: 'supplier', type: 'string'},
        {name: 'payedTimes', type: 'int'},
        'paymentId' // 材料单子对应的付款单id
    ],
    idProperty: 'id'
});