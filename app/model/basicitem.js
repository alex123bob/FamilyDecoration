Ext.define('FamilyDecoration.model.BasicItem', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'itemId', type: 'string'},
		{name: 'itemName', type: 'string'}
	],
	idProperty: 'itemId'
});