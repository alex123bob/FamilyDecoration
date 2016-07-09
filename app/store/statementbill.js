Ext.define('FamilyDecoration.store.StatementBill', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.StatementBill',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        // pageParam: false, //to remove param "page"
        // startParam: false, //to remove param "start"
        // limitParam: false, //to remove param "limit"
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'StatementBill.get',
            orderby: 'createTime DESC'
        }
    }
});