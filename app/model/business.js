Ext.define('FamilyDecoration.model.Business', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'regionId', type: 'string'},
		{name: 'address', type: 'string'},
		{name: 'customer', type: 'string'},
		{name: 'salesman', type: 'string'},  // 业务员真实姓名
		{name: 'salesmanName', type: 'string'}, // 业务员账号名
		{name: 'designer', type: 'string'},  // 设计师真实姓名
		{name: 'designerName', type: 'string'}, // 设计师账号名
		{name: 'source', type: 'string'},
		{name: 'level', type: 'string'}
	],
	idProperty: 'id'
});