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
        // 结算完成: 当前工程是否结算完成，默认0, 未结算完成, 1: 结算完成'; 
        // 结算完成的工程不显示在人工对账的工程列表中
        {name: 'settled'},
        {name: 'businessId', type: 'string'},
        {name: 'hasChart', type: 'string'},
        {name: 'budgetFinished', type: 'string'},
        
        // this is used in manuallyCheckBill module
        {name: 'rdyck1BillCount', type: 'string'},
        {name: 'rdyck2BillCount', type: 'string'},
        {name: 'rdyck3BillCount', type: 'string'},
        {name: 'rdyck4BillCount', type: 'string'},
        // this is used in materialrequest module
        {name: 'rdyck1MaterialOrderCount', type: 'string'},
        {name: 'rdyck2MaterialOrderCount', type: 'string'},
        {name: 'rdyck3MaterialOrderCount', type: 'string'},
        {name: 'rdyck4MaterialOrderCount', type: 'string'},
        // this is used to count corresponding bills in captain hierarchy
        {name: 'rdyck1BillCountForCaptain', type: 'string'},
        {name: 'rdyck2BillCountForCaptain', type: 'string'},
        {name: 'rdyck3BillCountForCaptain', type: 'string'},
        {name: 'rdyck4BillCountForCaptain', type: 'string'},
        // this is used to count corresponding material orders in captain hierarchy
        {name: 'rdyck1MaterialOrderCountForCaptain', type: 'string'},
        {name: 'rdyck2MaterialOrderCountForCaptain', type: 'string'},
        {name: 'rdyck3MaterialOrderCountForCaptain', type: 'string'},
        {name: 'rdyck4MaterialOrderCountForCaptain', type: 'string'},
        // this is used when left join with contract_engineering table, if project is transferred from business, and contract is already created based on that business.
        {name: 'contractTotalPrice', mapping: 'totalPrice', type: 'string'}
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