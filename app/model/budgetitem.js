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
		{name: 'lossPercent', type: 'float'}, // 对应budget_item表中损耗的百分比
		{name: 'lossComputed', type: 'float'}, // 为计算出来的值，（主单+辅单）*lossPercent
		{name: 'parentId', type: 'string'},  //预算中该条项目对应的大项目id
		{name: 'remark', type: 'string'},
		// {name: 'cost', type: 'float'}, // 预算中该条基础项目对应的成本
		{name: 'manpowerCost', type: 'float'},
		{name: 'mainMaterialCost', type: 'float'},
		{name: 'manpowerTotalCost', type: 'float'},
		{name: 'mainMaterialTotalCost', type: 'float'},
		{name: 'workCategory', type: 'string'},
		{name: 'basicItemId', type: 'string'}, // 基础项目中大项的id
		{name: 'basicSubItemId', type: 'string'},
		{name: 'isEditable', type: 'boolean'},
		{name: 'isCustomized', type: 'string'}, // 是否是空白的自定义字段
		{name: 'orgMainMaterialPrice', type: 'string'},
		{name: 'orgAuxiliaryMaterialPrice', type: 'string'},
		{name: 'orgManpowerPrice', type: 'string'},
		{name: 'orgMachineryPrice', type: 'string'},
		{name: 'discount', type: 'string'}
	],
	idProperty: 'budgetItemId'
});