Ext.define('FamilyDecoration.model.MaterialOrderTemplate', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'supplierId', type: 'string'},
        {name: 'templateName', type: 'string'},
        {name: 'isDeleted', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'}
    ],
    idProperty: 'id'
});