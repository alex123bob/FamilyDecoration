Ext.define('FamilyDecoration.model.BusinessDetail', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'businessId', type: 'string'},
		{name: 'content', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'committer', type: 'string'},
		{name: 'committerRealName', type: 'string'},
	],
	idProperty: 'id'
});