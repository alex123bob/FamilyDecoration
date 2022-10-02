Ext.define('FamilyDecoration.model.Feature', {
	extend: 'Ext.data.TreeModel',
	fields: [
		{name: 'text', mapping: 'name'},
		{name: 'name', type: 'string'},
		{name: 'cmp', type: 'string'},
		{name: 'closed', type: 'boolean'}
	],
	idProperty: 'cmp'
});