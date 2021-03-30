Ext.define('FamilyDecoration.store.ContracteEngineeringNoticeOrder', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.ContracteEngineeringNoticeOrder',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'ContracteEngineeringNoticeOrder.get'
        }
    }
});