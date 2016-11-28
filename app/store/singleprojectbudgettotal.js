Ext.define('FamilyDecoration.store.SingleProjectBudgetTotal', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.SingleProjectBudgetTotal',
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