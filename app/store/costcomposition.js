Ext.define('FamilyDecoration.store.CostComposition', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.CostComposition',

    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: ''
        }
    }
})