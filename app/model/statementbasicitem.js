Ext.define('FamilyDecoration.model.StatementBasicItem', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'serialNumber', type: 'string'},
		{name: 'billItemName', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'amount', type: 'float'},
		{name: 'unitPrice', type: 'float'},
		{name: 'subtotal', type: 'float'},
		{name: 'professionType', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'referenceNumber', type: 'int'},
		{name: 'referenceItems', type: 'string'}, // 参考量对应的基础小项的id
		{name: 'checkedNumber', type: 'string'}
	]
});