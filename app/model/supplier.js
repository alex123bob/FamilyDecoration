Ext.define('FamilyDecoration.model.Supplier', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'name', type: 'string'}
    ],
    idProperty: 'id'
});