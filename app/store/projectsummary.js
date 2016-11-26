Ext.define('FamilyDecoration.store.ProjectSummary', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.ProjectSummary',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        extraParams: {
            action: 'Project.get'
        }
    }
});