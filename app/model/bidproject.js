Ext.define('FamilyDecoration.model.BidProject', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'startTime', type: 'string'},
		{name: 'specificTime', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'requirement', type: 'string'},
        {name: 'location', type: 'string'},
        {name: 'depositProperty', type: 'string'},
        {name: 'statementBillId', type: 'string'}, // 投标保证金对应statement bill， 投标界面暂时需要保证金单子的状态：已提交，已审核，已付款
        {name: 'agency', type: 'string'},
        {name: 'bidderA', type: 'string'},
        {name: 'bidderB', type: 'string'},
        {name: 'budgetCost', type: 'string'},
        {name: 'preferredBidder', type: 'string'},
        {name: 'bidPrice', type: 'string'},
        {name: 'floatDownRate', type: 'string'},
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'BidProject.update'
        }
    }
});