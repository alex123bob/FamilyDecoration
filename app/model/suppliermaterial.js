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
        'professionType',
        'auditCreateTime',
        'auditCreator',
        'auditCreatorRealName',
        'auditId',
        {name: 'auditName', type: 'string'},
        {name: 'auditOperation', convert: function (val, rec){
            if (val === 'delete') {
                return 'del'
            }
            else {
                return val;
            }
        }},
        'auditPrice',
        'auditProfessionType',
        {name: 'auditUnit', type: 'string'},
        {name: 'auditApproved', type: 'string'},
        {name: 'auditApprover', type: 'string'}
    ],
    idProperty: 'id'
});