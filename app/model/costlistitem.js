Ext.define('FamilyDecoration.model.CostListItem', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string', mapping: ''},
		{name: 'name', type: 'string'},
		{name: 'unit', type: 'string'},
        {name: 'professionType', type: 'string'},
        {name: 'isLabour', type: 'string'},
        {name: 'remark', type: 'string'}
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'CostListItem.update'
        }
    }
});