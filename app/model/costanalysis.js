Ext.define('FamilyDecoration.model.CostAnalysis', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', type: 'string'},
		{name: 'manpowerCost', type: 'float'},
		{name: 'mainMaterialCost', type: 'float'}
	],
	idProperty: 'name'
});