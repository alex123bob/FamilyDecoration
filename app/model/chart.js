Ext.define('FamilyDecoration.model.Chart', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'chartId', type: 'string'},
		{name: 'chartCategory', type: 'string'},
		{name: 'chartContent', type: 'string'},
		{name: 'chartDispValue', type: 'string'}
	],
	idProperty: 'chartId'
});