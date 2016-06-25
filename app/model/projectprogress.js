Ext.define('FamilyDecoration.model.ProjectProgress', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'serialNumber', type: 'string'},
        {name: 'parentItemName', type: 'string'},
        {name: 'itemName', type: 'string'},
        {name: 'planStartTime', type: 'string'},
        {name: 'planEndTime', type: 'string'},
        {name: 'professionType', type: 'string'}, // this indicates which working category it belongs to
        {name: 'practicalProgress'},
        {name: 'supervisorComment', type: 'string'},
		{name: 'projectId', type: 'string'},
        {name: 'isEditable'}
    ],
    idProperty: 'id',
	proxy: {
		type: 'rest',
        reader: {
            type: 'json',
            root: 'data'
        }
	}
});