Ext.define('FamilyDecoration.model.PlanLabor', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        {name: 'projectName', type: 'string'},
        'period' // [{s: xxxx-xx-xx, e: xxxx-xx-xx, c: 'colour'}]
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