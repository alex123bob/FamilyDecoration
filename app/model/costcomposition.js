Ext.define('FamilyDecoration.model.CostComposition', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'costType', type: 'string'},
        {name: 'cost'}
    ]
});