Ext.define('FamilyDecoration.model.TaskList', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'taskName', type: 'string'},
        {name: 'taskContent', type: 'string'},
        {name: 'startTime', type: 'string'},
        {name: 'endTime', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'priority', type: 'string'},
        {name: 'score', type: 'string'},
        {name: 'assistant', type: 'string'},
        {name: 'taskDispatcher', type: 'string'},
        {name: 'taskDispatcherPhoneNumber', type: 'string'},
        {name: 'taskDispatcherMail', type: 'string'},
        {name: 'realName', string: 'string'},
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