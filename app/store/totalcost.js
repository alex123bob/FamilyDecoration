Ext.define('FamilyDecoration.store.TotalCost', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.TotalCost',
	proxy: {
		type: 'rest',
		url: './libs/costanalysis.php?action=view'
	}
});