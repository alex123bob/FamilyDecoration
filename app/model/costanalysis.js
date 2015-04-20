Ext.define('FamilyDecoration.model.CostAnalysis', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'workCategory', type: 'string'},
		{name: 'manpowerTotalCostForWorkCategory', type: 'float'},
		{name: 'mainMaterialTotalCostForWorkCategory', type: 'float'}
	],
	idProperty: 'id'
});