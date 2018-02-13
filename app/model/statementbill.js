Ext.define('FamilyDecoration.model.StatementBill', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'payee', type: 'string'},
		{name: 'projectName', type: 'string'},
		{name: 'captain', type: 'string'},
		{name: 'captainName', type: 'string'},
		{name: 'totalFee', type: 'float'},
		{name: 'totalFeeUppercase', type: 'string'},
		{name: 'claimAmount', type: 'float'},
		{name: 'payedTimes', type: 'int'},
		{name: 'projectProgress', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'phoneNumber', type: 'string'},
		{name: 'billName', type: 'string'},
		{name: 'billValue', type: 'string'},
		{name: 'status', type: 'string'}, // 'new', 'rdyck', 'chk','rbk', 'paid'
		{name: 'statusName', type: 'string'}, // '新创建', '待审核', '已审核', '打回', '已付款'
		{name: 'checker', type: 'string'},
		{name: 'checkerRealName', type: 'string'},
		// billType: ppd->prepaid deposit预付款,
		// billType: reg->regular bill普通账单
		// billType: qgd->quality guarantee deposit质量保证金
		{name: 'billType', type: 'string'}, 
		{name: 'billTypeName', type: 'string'},
		{name: 'creator', type: 'string'},
		{name: 'creatorRealName', type: 'string'},

		{name: 'certs', type: 'string'},

		// this three fields got from dynamically operation.
		{name: 'hasPrePaidBill', type: 'string'},
		{name: 'remainingTotalFee', type: 'string'},
		{name: 'prePaidFee', type: 'string'},
		{name: 'payer', type: 'string'},
		{name: 'payerRealName', type: 'string'},
		
		{name: 'professionType', type: 'string'},
		{name: 'professionTypeName', type: 'string'},
		{name: 'reimbursementReason', type: 'string'},
		{name: 'descpt', type: 'string'},
		{name: 'projectId', type: 'string'},

		// for qgd
		{name: 'deadline', type: 'string'},
		{name: 'qgd', type: 'float'},
		{name: 'paid', type: 'string'},
		{name: 'paidTime', type: 'string'},
		{name: 'paidAmount', type: 'float'},
		{name: 'paid', type: 'string'},
		{name: 'total', type: 'string'},
		{name: 'refId', type: 'string'}, // qgd reference Id, original statementbill id
		{name: 'number', type: 'string'}, // number of bills

		// for mtf
		{name: 'supplierId', type: 'string'},
		{name: 'supplier', type: 'string'},

		{name: 'businessId', type: 'string'},
		// for stfs 员工工资对应某年某月某员工的工资记录id
		{name: 'staffSalaryId', type: 'string'}
	]
});