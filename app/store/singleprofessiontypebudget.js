Ext.define('FamilyDecoration.store.SingleProfessionTypeBudget', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.SingleProfessionTypeBudget',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'Project.getProjectMaterialCost'
        }
    }
});