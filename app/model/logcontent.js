Ext.define('FamilyDecoration.model.LogContent', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'standardPlan', type: 'string', mapping: 'sp'},
        {name: 'practicalAccomplishment', type: 'string', mapping: 'pa'},
        {name: 'difference', type: 'string', mapping: 'd'},
        {name: 'selfPlan', type: 'string', mapping: 's'},
        {name: 'summarizedLog', type: 'string', mapping: 'sl'},
        {name: 'comments', type: 'string', mapping: 'c'},
        {name: 'day', type: 'string', mapping: 'dy'}
    ],
    idProperty: 'id'
});