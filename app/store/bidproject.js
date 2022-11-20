Ext.define('FamilyDecoration.store.BidProject', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.BidProject',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'BidProject.get',
            orderby: 'startTime DESC'
        }
    }
});