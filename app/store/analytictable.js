Ext.define('FamilyDecoration.store.AnalyticTable', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.AnalyticTable',

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