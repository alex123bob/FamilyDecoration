Ext.define('FamilyDecoration.model.Supplier', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'name', type: 'string'},
        {name: 'boss', type: 'string'}, //联系人
        {name: 'address', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'isDeleted', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'}
    ],
    idProperty: 'id'
});