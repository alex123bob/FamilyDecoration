Ext.define('FamilyDecoration.model.StatementBasicItem', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'serialNumber', type: 'string'},
		{name: 'billItemName', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'amount', type: 'string'},
		{name: 'unitPrice', type: 'string'},
		{name: 'subtotal', type: 'string'},
		{name: 'type', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'referenceNumber', type: 'string'},
		{name: 'checkedNumber', type: 'string'}
	]
});