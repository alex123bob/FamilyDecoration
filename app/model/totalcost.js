Ext.define('FamilyDecoration.model.TotalCost', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'itemCode', type: 'string'},
		{name: 'itemName', type: 'string'},
		{name: 'itemUnit', type: 'string'},
		{name: 'itemAmount', type: 'float'},
		{name: 'manpowerCost', type: 'float'},
		{name: 'mainMaterialCost', type: 'float'},
		{name: 'manpowerTotalCost', type: 'float'},
		{name: 'mainMaterialTotalCost', type: 'float'},
		{name: 'workCategory', type: 'string'},
		{name: 'basicItemId', type: 'string'},
		{name: 'basicSubItemId', type: 'string'},
		{name: 'isCustomized', type: 'string'}
	],
	idProperty: 'id'
});