Ext.define('FamilyDecoration.model.Business', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'regionId', type: 'string'},
		{name: 'address', type: 'string'},
		{name: 'customer', type: 'string'},
		{name: 'salesman', type: 'string'},
		{name: 'source', type: 'string'},
		{name: 'level', type: 'string'}
	],
	idProperty: 'id'
});