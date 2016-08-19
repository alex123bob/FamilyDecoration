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
		{name: 'isImportant'}, // true/false
		{name: 'telemarketingDeadline'}, 

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
		{name: 'isTransfered', type: 'string'},
		// lock feature. potential business will be locked when business with the same address has been created.
		// we can't update potential business any more and can't distribute telemarketing staff.
		// we could only read information about this potential business in its original module which is regionMgm.
		{name: 'isLocked', type: 'string'},
		{name: 'lastUpdateTime', type: 'string'},
		{name: 'distributeTime', type: 'string'} // when is the current business distributed to a telemarke staff.
	],
	idProperty: 'id'
});