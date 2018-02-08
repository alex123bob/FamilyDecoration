Ext.define('FamilyDecoration.store.StaffSalary', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.StaffSalary',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'StaffSalary.get'
        }
    }
});