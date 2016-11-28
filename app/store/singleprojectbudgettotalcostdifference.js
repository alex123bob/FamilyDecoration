Ext.define('FamilyDecoration.store.SingleProjectBudgetTotalCostDifference', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.SingleProjectBudgetTotalCostDifference',
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