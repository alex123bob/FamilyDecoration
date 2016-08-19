Ext.define('FamilyDecoration.model.Message', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'createTime', type: 'string'},
		{name: 'sender', type: 'string'},
		{name: 'receiver', type: 'string'},
		{name: 'content', type: 'string'},
		{name: 'type', type: 'string'},
		{name: 'extraId', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'isRead', type: 'string'},
		{name: 'status', type: 'string'},
		{name: 'result', type: 'string'},
		{name: 'readTime', type: 'string'},
		{name: 'showTime', type: 'string'} // for delayed message which is supposed to show in one specific time
	],
	idProperty: 'id'
});