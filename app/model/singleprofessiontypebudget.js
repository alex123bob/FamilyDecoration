Ext.define('FamilyDecoration.model.SingleProfessionTypeBudget', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'orderId',
        {name: 'name', type: 'string'},
        {name: 'amount', type: 'string'},
        {name: 'unit', type: 'string'},
        {name: 'unitPrice', type: 'string'},
        {name: 'totalPrice', type: 'string'},
        {name: 'supplierName', type: 'string'},
        {name: 'createTime', type: 'string'}
    ],
    idProperty: 'id'
});