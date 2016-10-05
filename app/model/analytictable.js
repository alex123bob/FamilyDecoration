Ext.define('FamilyDecoration.model.AnalyticTable', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'professionType', type: 'string'},
        {name: 'reality'},
        {name: 'budget'}
    ]
});