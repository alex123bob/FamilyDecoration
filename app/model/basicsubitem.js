Ext.define('FamilyDecoration.model.BasicSubItem', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'subItemId', type: 'string'},
		{name: 'subItemName', type: 'string'},
		{name: 'subItemUnit', type: 'string'},
		{name: 'mainMaterialPrice', type: 'float'},
		{name: 'auxiliaryMaterialPrice', type: 'float'},
		{name: 'manpowerPrice', type: 'float'},
		{name: 'machineryPrice', type: 'float'},
		{name: 'lossPercent', type: 'float'},
		{name: 'parentId', type: 'string'},
		// {name: 'cost', type: 'float'},
		{name: 'manpowerCost', type: 'float'},
		{name: 'mainMaterialCost', type: 'float'},
		{name: 'workCategory', type: 'string'},
		{name: 'remark', type: 'string'}
	],
	idProperty: 'subItemId'
});