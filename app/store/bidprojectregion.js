Ext.define('FamilyDecoration.store.BidProjectRegion', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.BidProjectRegion',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'BidProjectRegion.get'
        }
    }
});