Ext.define('FamilyDecoration.model.Bulletin', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'title', type: 'string'},
		{name: 'content', type: 'string'},
		{name: 'isStickTop', type: 'string'},
		{name: 'createTime', type: 'string'}
	],
	idProperty: 'id'
});