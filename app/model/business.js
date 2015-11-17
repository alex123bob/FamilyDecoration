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
		{name: 'level', type: 'string'}, // 我的业务的评级
		{name: 'signBusinessLevel', type: 'string'}, // 签单业务的评级
		{name: 'applyDesigner', type: 'string'}, //  0初始化，1申请设计师，2设计师申请到了,
		{name: 'applyProjectTransference', type: 'string'}, //  0初始化，1申请转换工程，2转换成了工程,
		{name: 'applyBudget', type: 'string'}, //  0初始化，1申请预算，2预算申请成功，
		{name: 'regionName', type: 'string', mapping: 'name'} // 小区名称
	],
	idProperty: 'id'
});