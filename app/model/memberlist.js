Ext.define('FamilyDecoration.model.MemberList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'name', type: 'string'},
        {name: 'level', type: 'string'},
        {name: 'realname', type: 'string'},
        {name: 'phone', type: 'string'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/loglist.php',
        reader: {
            type: 'json'
        }
    }
});