Ext.define('FamilyDecoration.model.SingleProjectBudgetTotalCostDifference', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'extra',
        {name: 'elctMtDf', type: 'string'},
        {name: 'elctMpDf', type: 'string'},
        {name: 'plstMtDf', type: 'string'},
        {name: 'plstMpDf', type: 'string'},
        {name: 'cptMtDf', type: 'string'},
        {name: 'cptMpDf', type: 'string'},
        {name: 'ptMtDf', type: 'string'},
        {name: 'ptMpDf', type: 'string'},
        {name: 'lbMtDf', type: 'string'},
        {name: 'lbMpDf', type: 'string'},
        {name: 'msclMtDf', type: 'string'},
        {name: 'msclMpDf', type: 'string'},
        {name: 'ttMtDf', type: 'string'},
        {name: 'ttMpDf', type: 'string'}

        // {name: 'electricMaterialDifference', type: 'string'},
        // {name: 'electricManualDifference', type: 'string'},
        // {name: 'plasterMaterialDifference', type: 'string'},
        // {name: 'plasterManualDifference', type: 'string'},
        // {name: 'carpenterMaterialDifference', type: 'string'},
        // {name: 'carpenterManualDifference', type: 'string'},
        // {name: 'paintMaterialDifference', type: 'string'},
        // {name: 'paintManualDifference', type: 'string'},
        // {name: 'miscellaneousMaterialDifference', type: 'string'},
        // {name: 'miscellaneousManualDifference', type: 'string'},
        // {name: 'totalMaterialDifference', type: 'string'},
        // {name: 'totalManualDifference', type: 'string'}
    ],
    idProperty: 'id'
});