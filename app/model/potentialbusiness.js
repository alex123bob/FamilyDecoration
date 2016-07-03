Ext.define('FamilyDecoration.model.PotentialBusiness', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'address', type: 'string'},
		{name: 'regionID', type: 'string'},
		{name: 'proprietor', type: 'string'},
		{name: 'phone', type: 'string'},
		{name: 'isDecorated'},
		{name: 'latestBusinessStatus', type: 'string'},
		// {name: 'status', type: 'string'},
		// {name: 'status_second', type: 'string'},
		// {name: 'status_third', type: 'string'},
		{name: 'salesman', type: 'string'},
		{name: 'salesmanName', type: 'string'},
		{name: 'telemarketingStaff', type: 'string'},
		{name: 'telemarketingStaffName', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'lastUpdateTime', type: 'string'},
		{name: 'distributeTime', type: 'string'} // when is the current business distributed to a telemarke staff.
	],
	idProperty: 'id'
});