Ext.define('FamilyDecoration.model.Project', {
	extend: 'Ext.data.Model',
	fields: [
        {name: 'projectTime', type: 'string'},
        {name: 'projectYear', type: 'string'},
        {name: 'projectMonth', type: 'string'},
        {name: 'projectId',  type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'projectProgress', type: 'string'},
        {name: 'projectChart', type: 'string'},
        {name: 'text', type: 'string', mapping: 'projectName'},
        {name: 'budgetId', type: 'string'},
        {name: 'isFrozen', type: 'string'}
    ],
    idProperty: 'projectId',
    proxy: {
    	type: 'rest',
    	url: './libs/getprojects.php',
        reader: {
            type: 'json'
        }
    }
});