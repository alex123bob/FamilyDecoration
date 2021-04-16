Ext.define('FamilyDecoration.store.AccountLogInfo', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.AccountLogInfo',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'AccountLog.getLogInfos'
        }
    }
});