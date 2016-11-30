Ext.define('FamilyDecoration.model.DiaryBill', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'accountId',
        {name: 'checkMonth', type: 'string'},
        'income',
        'outcome',
        'balance',
        {name: 'checker', type: 'string'},
        {name: 'checkerRealName', type: 'string'},
        'createTime',
        'isDeleted',
        'status', // unchecked, checked
        'updateTime' 
    ],
    idProperty: 'id'
});