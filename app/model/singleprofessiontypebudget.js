Ext.define('FamilyDecoration.model.SingleProfessionTypeBudget', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'payee', type: 'string'},
        {name: 'manualTotalFee', type: 'string'},
        {name: 'billId', type: 'string'},
        {name: 'mainMaterialId', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'amount', type: 'string'},
        {name: 'unit', type: 'string'},
        {name: 'unitPrice', type: 'string'},
        {name: 'mainMaterialTotalFee', type: 'string'},
        {name: 'supplierName', type: 'string'},
        {name: 'createTime', type: 'string'}
    ],
    idProperty: 'id'
});