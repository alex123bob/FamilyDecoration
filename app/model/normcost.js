Ext.define('FamilyDecoration.model.NormCost', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'remark', type: 'string'},
		{name: 'costListItems', convert: function(value, record) {
            // todo.
        }}
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'CostListItem.update'
        }
    }
});