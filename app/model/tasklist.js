Ext.define('FamilyDecoration.model.TaskList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'taskName', type: 'string'},
        {name: 'taskContent', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'taskDispatcher', type: 'string'},
        {name: 'taskExecutor', type: 'string'},
        {name: 'isDeleted', type: 'boolean'},
        {name: 'taskProcess', type: 'string'},
        {name: 'year', type: 'string'},
        {name: 'month', type: 'string'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/tasklist.php',
        reader: {
            type: 'json'
        }
    }
});