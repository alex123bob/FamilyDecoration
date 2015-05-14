Ext.define('FamilyDecoration.model.Msg', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'createTime', type: 'string'},
		{name: 'sender', type: 'string'},
		{name: 'reciever', type: 'string'},
		{name: 'recieverPhone', type: 'string'},
		{name: 'status', type: 'string'},
		{name: 'result', type: 'string'},
		{name: 'content', type: 'string'}
	],
	idProperty: 'id'
});