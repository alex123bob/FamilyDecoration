Ext.define('FamilyDecoration.store.DepaList', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.DepaList',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'StaffSalary.getDepas'
        }
    }
});