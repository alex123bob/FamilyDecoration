Ext.define('FamilyDecoration.model.Feature', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', type: 'string'},
		{name: 'cmp', type: 'string'}
	],
	idProperty: 'cmp'
});