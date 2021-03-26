Ext.define('FamilyDecoration.model.Deposit', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'projectName', type: 'string'}, // 工程名称
		{name: 'startTime', type: 'string'}, // 开标时间
        {name: 'deposit', type: 'string'}, // 金额
        {name: 'contact', type: 'string'}, // 联系人
        {name: 'contactWay', type: 'string'}, // 联系方式
        {name: 'accountName', type: 'string'}, // 账号名称
        {name: 'bank', type: 'string'}, // 开户行
        {name: 'accountNumber', type: 'string'}, // 账号
        {name: 'applicant', type: 'string'}, // 申请人
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'Deposit.update'
        }
    }
});