Ext.define('FamilyDecoration.model.OnlineUser', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'sessionId', type: 'string'},
		{name: 'userName', type: 'string'},
		{name: 'userAgent', type: 'string'},
		{name: 'onlineTime', type: 'string'},
		{name: 'offlineTime', type: 'string'},
		{name: 'lastUpdateTime', type: 'string'},
		{name: 'ip', type: 'string'}
	]
});