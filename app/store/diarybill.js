Ext.define('FamilyDecoration.store.DiaryBill', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.DiaryBill',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'AccountLogMonthlyCheck.get'
        }
    }
});