Ext.define('FamilyDecoration.store.StaffSalaryCommission', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.StaffSalaryCommission',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'StaffSalaryCommission.get'
        }
    }
});