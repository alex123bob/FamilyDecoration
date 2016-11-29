Ext.define('FamilyDecoration.model.DiaryBill', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'checkMonth', type: 'string'},
        'income',
        'outcome',
        'balance',
        {name: 'checker', type: 'string'}
    ],
    idProperty: 'id'
});