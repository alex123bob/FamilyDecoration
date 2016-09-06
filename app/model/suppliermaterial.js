Ext.define('FamilyDecoration.model.SupplierMaterial', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        'supplierId',
        {name: 'serialNumber', type: 'string'},
        {name: 'name', type: 'string'},
        'amount',
        'referenceNumber',
        {name: 'unit', type: 'string'},
        'price',
        'professionType'
    ],
    idProperty: 'id'
});