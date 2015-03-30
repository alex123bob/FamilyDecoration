Ext.define('FamilyDecoration.model.Progress', {
	extend: 'Ext.data.Model',
	fields: [
        {name: 'id',  type: 'string'},
        {name: 'progress', type: 'string'},
        {name: 'comments', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'isDeleted', type: 'boolean'},
        {name: 'projectId', type: 'string'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/progress.php',
        reader: {
            type: 'json'
        }
    }
});