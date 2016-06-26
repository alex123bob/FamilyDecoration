Ext.define('FamilyDecoration.model.PlanLabor', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        {name: 'projectName', type: 'string'},
        'period'
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