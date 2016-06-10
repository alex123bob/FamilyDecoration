Ext.define('FamilyDecoration.model.PlanMaking', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        {name: 'serialNumber', type: 'string'},
        {name: 'parentItemName', type: 'string'},
        {name: 'itemName', type: 'string'},
        {name: 'startTime', type: 'string'},
        {name: 'endTime', type: 'string'},
        {name: 'professionType', type: 'string'}, // this indicates which working category it belongs to
		{name: 'projectId', type: 'string'}
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