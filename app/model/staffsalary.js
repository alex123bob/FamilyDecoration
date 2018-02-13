Ext.define('FamilyDecoration.model.StaffSalary', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'staffName', type: 'string'},
        {name: 'staffRealName', type: 'string', mapping: 'staffNameRealName'},
        {name: 'staffLevel', type: 'string'},
        {name: 'basicSalary', type: 'string'},
        {name: 'commission', type: 'string'},
        {name: 'fullAttendanceBonus', type: 'string'},
        {name: 'bonus', type: 'string'},
        {name: 'deduction', type: 'string'},
        {name: 'total', type: 'string'},
        {name: 'insurance', type: 'string'},
        {name: 'housingFund', type: 'string'},
        {name: 'incomeTax', type: 'string'},
        {name: 'others', type: 'string'},
        {name: 'actualPaid', type: 'string'},
        // 当前工资record对应statement_bill表中，对应账单的审核状态，若未提交，则为空
        {name: 'billStatus', type: 'string'},
        // 对应statement bill record的id
        {name: 'statementBillId', type: 'string'},
        {name: 'salaryDate', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'},
        {name: 'isDeleted', type: 'string'}
    ],
    idProperty: 'id'
});