Ext.define('FamilyDecoration.model.Feature', {
	extend: 'Ext.data.TreeModel',
	fields: [
		{name: 'text', mapping: 'name'},
		{name: 'name', type: 'string'},
		{name: 'cmp', type: 'string'},
		{name: 'deprecated', type: 'boolean'}
	],
	idProperty: 'cmp'
});