Ext.define('FamilyDecoration.model.Chart', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'chartId', type: 'string'},
		{name: 'chartCategory', type: 'string'}
	],
	idProperty: 'chartId'
});