Ext.define('FamilyDecoration.model.Bulletin', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'content', type: 'string'},
		{name: 'isStickTop', type: 'string'}
	],
	idProperty: 'id'
});