Ext.define('FamilyDecoration.store.StatementBillItemRemark', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.StatementBillItemRemark',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'StatementBillItemRemark.get'
        }
    }
});