Ext.define('FamilyDecoration.model.BudgetItem', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'budgetItemId', type: 'string'},
		{name: 'budgetId', type: 'string'},  // 外键
		{name: 'itemCode', type: 'string'},
		{name: 'itemName', type: 'string'},
		{name: 'itemUnit', type: 'string'},
		{name: 'itemAmount', type: 'float'},
		{name: 'mainMaterialPrice', type: 'float'},
		{name: 'mainMaterialTotalPrice', type: 'float'},
		{name: 'auxiliaryMaterialPrice', type: 'float'},
		{name: 'auxiliaryMaterialTotalPrice', type: 'float'},
		{name: 'manpowerPrice', type: 'float'},
		{name: 'manpowerTotalPrice', type: 'float'},
		{name: 'machineryPrice', type: 'float'},
		{name: 'machineryTotalPrice', type: 'float'},
		{name: 'lossPercent', type: 'float'},
		{name: 'parentId', type: 'string'},  //预算中该条项目对应的大项目id
		{name: 'remark', type: 'string'},
		{name: 'cost', type: 'float'} // 预算中该条基础项目对应的成本
	],
	idProperty: 'budgetItemId'
});