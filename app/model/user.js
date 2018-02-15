Ext.define('FamilyDecoration.model.User', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name', type: 'string'},
		{name: 'realname', type: 'string'},
		{name: 'password', type: 'string'},
		{name: 'level', type: 'string'},
		{name: 'projectId', type: 'string'},
		{name: 'supplierId', type: 'string'},
		{name: 'supplierName', type: 'string'},
		{name: 'projectName', type: 'string'},
		{name: 'phone', type: 'string'},
		{name: 'securePass', type: 'string'},
		{name: 'mail', type: 'string'},
		{name: 'department', type: 'string'},
		{name: 'profileImage', type: 'string'},
		{name: 'priority', type: 'string'},
		{name: 'priorityTitle', type: 'string'},
		{name: 'isInStaffSalary', type: 'string'},
		{name: 'isLocked', type: 'string'}
	]
});