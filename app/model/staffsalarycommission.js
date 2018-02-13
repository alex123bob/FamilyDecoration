Ext.define('FamilyDecoration.model.StaffSalaryCommission', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'staffSalaryId', type: 'string'},
        {name: 'projectId', type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'commissionAmount', type: 'string'},
        {name: 'staffName', type: 'string'},
        {name: 'staffRealName', type: 'string'},
        {name: 'commissionTime', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'},
        {name: 'isDeleted', type: 'string'}
    ],
    idProperty: 'id'
});