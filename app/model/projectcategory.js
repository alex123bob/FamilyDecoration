Ext.define('FamilyDecoration.model.ProjectCategory', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'serialNumber', type: 'string'},
        {name: 'projectTime', type: 'string'},
        {name: 'projectYear', type: 'string'},
        {name: 'projectMonth', type: 'string'},
        {name: 'projectId',  type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'period', type: 'string'},
        {name: 'customer', type: 'string'},
        {name: 'captain', type: 'string'},
        {name: 'captainName', type: 'string'},
        {name: 'supervisor', type: 'string'},
        {name: 'supervisorName', type: 'string'},
        {name: 'salesman', type: 'string'},
        {name: 'salesmanName', type: 'string'},
        {name: 'designer', type: 'string'},
        {name: 'designerName', type: 'string'},
        {name: 'projectProgress', type: 'string'},
        {name: 'projectProgressComment', type: 'string'},
        {name: 'budgets'},
        {name: 'isFrozen', type: 'string'},
        {name: 'businessId', type: 'string'},
        {name: 'hasChart', type: 'string'},
        {name: 'budgetFinished', type: 'string'},
        {name: 'tilerProCheck', type: 'string'},
        {name: 'woodProCheck', type: 'string'}
    ],
    idProperty: 'projectId',
    proxy: {
        type: 'rest',
        url: './libs/projectcategory.php?action=get',
        reader: {
            type: 'json'
        }
    }
});