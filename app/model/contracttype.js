Ext.define('FamilyDecoration.model.ContractType', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'name', type: 'string'}
    ],
    idProperty: 'id'
});