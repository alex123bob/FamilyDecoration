Ext.define('FamilyDecoration.model.DiaryBill', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'month', type: 'string'},
        'monthlyIncome',
        'monthlyOutcome',
        'accountBalance',
        {name: 'detail', type: 'string'},
        {name: 'checker', type: 'string'}
    ],
    idProperty: 'id'
});