Ext.define('FamilyDecoration.store.FinanceAggregation', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.FinanceAggregation',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'FinanceAggregation.get'
        }
    }
});