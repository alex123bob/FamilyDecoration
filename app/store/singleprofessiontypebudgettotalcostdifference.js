Ext.define('FamilyDecoration.store.SingleProfessionTypeBudgetTotalCostDifference', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.SingleProfessionTypeBudgetTotalCostDifference',
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