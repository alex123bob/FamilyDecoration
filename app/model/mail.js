Ext.define('FamilyDecoration.model.Mail', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'mailId', type: 'string'},
		{name: 'mailSubject', type: 'string'},
		{name: 'mailContent', type: 'string'},
		{name: 'mailSender', type: 'string'},
		{name: 'mailReceiver', type: 'string'},
		{name: 'mailCC', type: 'string'},
		{name: 'mailTime', type: 'string'},
		{name: 'isRead', type: 'string'}
	],
	idProperty: 'mailId'
});