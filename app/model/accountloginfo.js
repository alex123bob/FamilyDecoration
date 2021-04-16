Ext.define('FamilyDecoration.model.AccountLogInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'billType', type: 'string' },
        { name: 'billTypeName', type: 'string' },
        { name: 'checker', type: 'string' },
        { name: 'checkerRealName', type: 'string' },
        { name: 'claimAmount', type: 'string' },
        { name: 'createTime', type: 'string' },
        { name: 'creator', type: 'string' },
        { name: 'creatorRealName', type: 'string' },
        { name: 'descpt', type: 'string' },
        { name: 'paidAmount', type: 'string' },
        { name: 'paidTime', type: 'string' },
        { name: 'payee', type: 'string' },
        { name: 'payeeRealName', type: 'string' },
        { name: 'payer', type: 'string' },
        { name: 'payerRealName', type: 'string' },
        { name: 'professionType', type: 'string' },
        { name: 'projectName', type: 'string' },
        { name: 'reimbursementReason', type: 'string' },
        { name: 'projectProgress', },
        { name: 'status', type: 'string' },
        { name: 'statusName', type: 'string' },
        { name: 'totalFee', type: 'string' },
        { name: 'totalFeeUppercase', type: 'string' },
    ],
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        extraParams: {
            action: 'AccountLog.update'
        }
    }
});