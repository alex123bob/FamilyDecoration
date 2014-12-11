Ext.define('FamilyDecoration.model.User', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', type: 'string'},
		{name: 'password', type: 'string'},
		{name: 'level', type: 'string'}
	]
});