Ext.define('FamilyDecoration.model.Account', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        {name: 'name', type: 'string'},
        {name: 'accountType', type: 'string'}, // CASH, CYBER, ALI, OTHER
        {name: 'isDeleted', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'}
	],
	idProperty: 'id'
});