Ext.define('FamilyDecoration.store.SingleProfessionTypeBudgetTotalAnalysis', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.SingleProfessionTypeBudgetTotalAnalysis',
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