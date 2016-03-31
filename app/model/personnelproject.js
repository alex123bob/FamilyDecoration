Ext.define('FamilyDecoration.model.PersonnelProject', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'businessId', type: 'string'},
        {name: 'projectId', type: 'string'},
        {name: 'businessName', type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'businessTimeDistance', type: 'string'},
        {name: 'projectTimeDistance', type: 'string'},
        {name: 'hasProjectGraph', type: 'string'},
        {name: 'hasProjectPlan', type: 'string'},
        {name: 'mainMaterialNumber', type: 'string'}
    ],
    idProperty: 'businessOrProjectId',
    proxy: {
    	type: 'rest',
    	url: './libs/statistic.php',
        reader: {
            type: 'json'
        }
    }
});