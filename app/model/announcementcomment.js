Ext.define('FamilyDecoration.model.AnnouncementComment', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		'bulletinId', // which bulletin it belongs to
		{name: 'content', type: 'string'},
		{name: 'commenter', type: 'string'},
		{name: 'commenterName', type: 'string'},
		{name: 'createTime', type: 'string'},
		'parentId', // which comment current one responds to
		{name: 'previousCommenter', type: 'string'},
		{name: 'previousCommenterName', type: 'string'}
	],
	idProperty: 'id'
});