Ext.define('FamilyDecoration.model.TaskScrutinize', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'taskListId', type: 'string'},
        {name: 'isDeleted', type: 'boolean'},
        {name: 'userName', type: 'string'},
        {name: 'realName', type: 'string'},
        {name: 'scrutinizeTime', type: 'string', mapping: 'createTime'},
        {name: 'scrutinizeContent', type: 'string', mapping: 'content'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/taskscrutinize.php',
        reader: {
            type: 'json'
        },
        extraParams: {
            action: 'getScrutinizeContent'
        }
    }
});