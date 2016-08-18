Ext.define('FamilyDecoration.model.Mail', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'mailSubject', type: 'string'},
		{name: 'mailContent', type: 'string'},
		{name: 'mailSender', type: 'string'},
		{name: 'mailReceiver', type: 'string'},
		{name: 'mailCC', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'status', type: 'number'},
		{name: 'result', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'isRead', type: 'string'}
	],
	idProperty: 'id'
});