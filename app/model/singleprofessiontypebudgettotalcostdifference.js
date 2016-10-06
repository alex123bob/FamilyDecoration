Ext.define('FamilyDecoration.model.SingleProfessionTypeBudgetTotalCostDifference', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'electricMaterialDifference', type: 'string'},
        {name: 'electricManualDifference', type: 'string'},
        {name: 'plasterMaterialDifference', type: 'string'},
        {name: 'plasterManualDifference', type: 'string'},
        {name: 'carpenterMaterialDifference', type: 'string'},
        {name: 'carpenterManualDifference', type: 'string'},
        {name: 'paintMaterialDifference', type: 'string'},
        {name: 'paintManualDifference', type: 'string'},
        {name: 'miscellaneousMaterialDifference', type: 'string'},
        {name: 'miscellaneousManualDifference', type: 'string'},
        {name: 'totalMaterialDifference', type: 'string'},
        {name: 'totalManualDifference', type: 'string'}
    ],
    idProperty: 'id'
});