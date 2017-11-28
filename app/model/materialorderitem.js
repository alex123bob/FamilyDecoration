Ext.define('FamilyDecoration.model.MaterialOrderItem', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'serialNumber', type: 'string'},
		{name: 'billItemName', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'amount', type: 'float'},
		{name: 'unitPrice', type: 'float'},
		{name: 'subtotal', type: 'float'},
		{name: 'remark', type: 'string'},
		{name: 'professionType', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'referenceNumber', type: 'int'},
		{name: 'referenceItems', type: 'string'}, // 参考量对应的基础小项的id
		{name: 'checkedNumber', type: 'string'},
		'remarks',
        {name: 'billId', type: 'string'}, // 对应的账单的id
        {name: 'supplierId', type: 'string'}, // 材料对应的供应商id
        {name: 'materialId', type: 'string'} // 材料id
	]
});