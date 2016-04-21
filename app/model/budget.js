Ext.define('FamilyDecoration.model.Budget', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'budgetId', type: 'string'},
		{name: 'custName', type: 'string'},
		{name: 'projectName', type: 'string'},
		{name: 'businessRegion', type: 'string'},
		{name: 'businessAddress', type: 'string'},
		{name: 'projectId', type: 'string'},
		{name: 'businessId', type: 'string'},
		{name: 'areaSize', type: 'string'},
		{name: 'totalFee', type: 'string'},
		{name: 'comments', type: 'string'},
		{name: 'budgetName', type: 'string'},
		{name: 'createTime', type: 'string'}
	],
	idProperty: 'budgetId'
});