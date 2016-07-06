Ext.define('FamilyDecoration.model.PotentialBusiness', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'address', type: 'string'},
		{name: 'regionID', type: 'string'},
		{name: 'regionName', type: 'string', mapping: 'rn'},
		{name: 'proprietor', type: 'string'},
		{name: 'phone', type: 'string'},
		{name: 'isDecorated'}, // true/false/no

		{name: 'latestBusinessStatus', mapping: 'lbs'},
		{name: 'latestBusinessTime', mapping: 'lbt'},
		{name: 'latestBusinessCommitter', mapping: 'lbc'},
		{name: 'latestBusinessCommitterRealName', mapping: 'lbcr'},
		
		{name: 'businessStatusDetail', mapping: 'lbd'},
		// {name: 'status', type: 'string'},
		// {name: 'status_second', type: 'string'},
		// {name: 'status_third', type: 'string'},
		{name: 'salesman', type: 'string'},
		{name: 'salesmanName', type: 'string'},
		{name: 'telemarketingStaff', type: 'string'},
		{name: 'telemarketingStaffName', type: 'string'},
		// array list of all reminding information
		// find them by msg_extraId=id, msg_recipient=telemarketingStaffName, msg_type=telemarket_individual_remind
		{name: 'reminders'},
		{name: 'createTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'lastUpdateTime', type: 'string'},
		{name: 'distributeTime', type: 'string'} // when is the current business distributed to a telemarke staff.
	],
	idProperty: 'id'
});