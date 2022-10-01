Ext.define('FamilyDecoration.model.BidProjectRegion', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'remark', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        extraParams: {
            action: 'BidProjectRegion.update'
        }
    }
});