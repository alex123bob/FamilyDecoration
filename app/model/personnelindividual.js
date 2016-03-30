Ext.define('FamilyDecoration.model.PersonnelIndividual', {
	extend: 'Ext.data.Model',
	fields: [
        {name: 'day', type: 'string'},
        {name: 'logListDailyAmount', type: 'string'},
        {name: 'logListMonthlyAmount', type: 'string'},
        {name: 'businessDailyAmount', type: 'string'},
        {name: 'businessMonthlyAmount', type: 'string'},
        {name: 'businessTotalNumber', type: 'string'},
        {name: 'signedBusinessDailyAmount', type: 'string'},
        {name: 'signedBusinessMonthlyAmount', type: 'string'},
        {name: 'signedBusinessTotalNumber', type: 'string'},
        {name: 'potentialBusinessDailyAmount', type: 'string'},
        {name: 'potentialBusinessMonthlyAmount', type: 'string'},
        {name: 'potentialBusinessTotalNumber', type: 'string'}
    ],
    idProperty: 'day',
    proxy: {
    	type: 'rest',
    	url: './libs/statistic.php',
        reader: {
            type: 'json'
        }
    }
});