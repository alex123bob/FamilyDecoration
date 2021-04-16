Ext.define('FamilyDecoration.model.BidProject', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'startTime', type: 'string' },
        { name: 'specificTime', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'requirement', type: 'string' },
        { name: 'location', type: 'string' },
        { name: 'depositProperty', type: 'string' },
        { name: 'agency', type: 'string' },
        { name: 'bidderA', type: 'string' },
        { name: 'bidderB', type: 'string' },
        { name: 'budgetCost', type: 'string' },
        { name: 'preferredBidder', type: 'string' },
        { name: 'bidPrice', type: 'string' },
        { name: 'floatDownRate', type: 'string' },
        { name: 'billStatus', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        extraParams: {
            action: 'BidProject.update'
        }
    }
});