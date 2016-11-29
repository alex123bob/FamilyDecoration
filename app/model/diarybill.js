Ext.define('FamilyDecoration.model.DiaryBill', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'checkMonth', type: 'string'},
        'income',
        'outcome',
        'balance',
        {name: 'detail', type: 'string'},
        {name: 'checker', type: 'string'}
    ],
    idProperty: 'id'
});