Ext.define('FamilyDecoration.model.ChartDetail', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'projectId', type: 'string'},
		{name: 'chartId', type: 'string'},
		{name: 'content', type: 'string'},
		{name: 'originalName', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'isDeleted', type: 'boolean'}
	],
	idProperty: 'id'
});