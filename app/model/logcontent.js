Ext.define('FamilyDecoration.model.LogContent', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        {name: 'standardPlan', type: 'string', mapping: 'sp'},
        {name: 'practicalAccomplishment', type: 'string', mapping: 'pa'},
        {name: 'difference', type: 'string', mapping: 'd'},
        {name: 'selfPlan', type: 'string', mapping: 's'},
        {name: 'summarizedLogId', type: 'string', mapping: 'sid'},
        {name: 'summarizedLog', type: 'string', mapping: 'sl'},
        {name: 'commentsId', type: 'string', mapping: 'cid'},
        {name: 'comments', type: 'string', mapping: 'c'},
        {name: 'day', type: 'string', mapping: 'dy'}
    ],
    idProperty: 'id'
});