Ext.define('FamilyDecoration.model.FinanceAggregation', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'name', type: 'string'},
        {name: 'yearAccMoney', type: 'string'},
        {name: 'monthAccMoney', type: 'string'}
    ],
    idProperty: 'id'
});