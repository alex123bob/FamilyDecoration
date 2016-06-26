Ext.define('FamilyDecoration.store.PlanLabor', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.PlanLabor',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'PlanMaking.getLaborPlanByProfessionType'
        }
    }
});