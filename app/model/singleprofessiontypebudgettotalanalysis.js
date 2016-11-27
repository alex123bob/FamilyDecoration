Ext.define('FamilyDecoration.model.SingleProfessionTypeBudgetTotalAnalysis', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'professionType', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'unit', type: 'string'},
        {name: 'reality', type: 'string'},
        {name: 'budget', type: 'string'},
        {name: 'matName', type: 'string'},
        {name: 'matUnit', type: 'string'},
        {name: 'matRealNumber', type: 'string'},
        {name: 'matBudgetNumber', type: 'string'},
        {name: 'supplier', type: 'string'}
    ],
    idProperty: 'id'
});