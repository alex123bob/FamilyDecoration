Ext.define('FamilyDecoration.model.Community', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', type: 'string'},
		{name: 'nameRemark', type: 'string'},
		'id',
		'business'
	]
});