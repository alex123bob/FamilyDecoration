Ext.define('FamilyDecoration.model.LogList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'logListId', type: 'string'},
        {name: 'logName', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'isDeleted', type: 'boolean'},
        {name: 'userName', type: 'string'},
        {name: 'year', type: 'string'},
        {name: 'month', type: 'string'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/getlogs.php',
        reader: {
            type: 'json'
        }
    }
});