Ext.define('FamilyDecoration.model.TaskSelfAssessment', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'taskListId', type: 'string'},
        {name: 'isDeleted', type: 'boolean'},
        {name: 'createTime', type: 'string'},
        {name: 'taskExecutor', type: 'string'},
        {name: 'selfAssessment', type: 'string'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/tasklist.php',
        reader: {
            type: 'json'
        },
        extraParams: {
            action: 'getTaskAssessmentByTaskListId'
        }
    }
});