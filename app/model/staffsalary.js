Ext.define('FamilyDecoration.model.StaffSalary', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'staff', type: 'string'},
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
        {name: 'salaryDate', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'},
        {name: 'isDeleted', type: 'string'}
    ],
    idProperty: 'id'
});