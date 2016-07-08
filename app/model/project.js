Ext.define('FamilyDecoration.model.Project', {
	extend: 'Ext.data.Model',
	fields: [
        {name: 'projectTime', type: 'string'},
        {name: 'projectYear', type: 'string'},
        {name: 'projectMonth', type: 'string'},
        {name: 'projectId',  type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'period', type: 'string'},
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
        {name: 'text', type: 'string', mapping: 'projectName'},
        {name: 'budgets'},
        {name: 'isFrozen', type: 'string'},
        {name: 'businessId', type: 'string'},
        {name: 'hasChart', type: 'string'},
        {name: 'budgetFinished', type: 'string'},
        
        // this is used in manuallyCheckBill module
        {name: 'rdyckBillCount', type: 'string'},
        {name: 'chkBillCount', type: 'string'},
        {name: 'paidBillCount', type: 'string'}
    ],
    idProperty: 'projectId',
    proxy: {
    	type: 'rest',
    	url: './libs/project.php?action=getprojects',
        reader: {
            type: 'json'
        }
    }
});