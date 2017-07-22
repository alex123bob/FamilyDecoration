Ext.define('FamilyDecoration.store.MaterialOrderTemplate', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.MaterialOrderTemplate',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'SupplierOrderTemplate.get'
        }
    }
});