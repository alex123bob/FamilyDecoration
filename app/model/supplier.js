Ext.define('FamilyDecoration.model.Supplier', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'name', type: 'string'},
        {name: 'boss', type: 'string'}, //联系人
        {name: 'address', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'isLongTerm', converter: function(val){
            return val === 'true' ? true : false;
        }}, // boolean， 长期,临时供应商
        'type', // material, device
        'remark',
        {name: 'isDeleted', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'}
    ],
    idProperty: 'id'
});