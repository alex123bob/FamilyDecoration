Ext.define('FamilyDecoration.store.SingleProfessionTypeBudgetTotal', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.SingleProfessionTypeBudgetTotal',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'Project.financeReport'
        }
    }
});