Ext.define('FamilyDecoration.model.StatisticTree', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'name', type: 'string'},
        {name: 'level', type: 'string'},
        {name: 'realname', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'mail', type: 'string'},

        {name: 'year', type: 'string'},
        {name: 'month', type: 'string'}
    ],
    idProperty: 'id',
    proxy: {
    	type: 'rest',
    	url: './libs/statistic.php',
        reader: {
            type: 'json'
        }
    }
});