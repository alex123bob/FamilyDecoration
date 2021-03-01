Ext.define('FamilyDecoration.model.CostListItem', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'unit', type: 'string'},
        {name: 'professionType', type: 'string'},
        {name: 'isLabour', type: 'string'},
        {name: 'remark', type: 'string'},
        {name: 'version', type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'CostListItem.update'
        }
    }
});