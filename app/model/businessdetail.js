Ext.define('FamilyDecoration.model.BusinessDetail', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'businessId', type: 'string'},
		{name: 'content', type: 'string'}
	],
	idProperty: 'id'
});