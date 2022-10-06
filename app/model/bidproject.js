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
        { name: 'budgetCost', type: 'string' },
        { name: 'controlledPrice', type: 'string' },
        { name: 'bidPrice', type: 'string' }, // 投标价
        { name: 'preferredBidder', type: 'string' },
        { name: 'bidWinningPrice', type: 'string' }, // 中标价
        { name: 'floatDownRate', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        extraParams: {
            action: 'BidProject.update'
        }
    }
});