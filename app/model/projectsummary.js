Ext.define('FamilyDecoration.model.ProjectSummary', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'captain', type: 'string'},
        {name: 'projectName', type: 'string'},
        {name: 'contract', type: 'string'},
        {name: 'incNDec', type: 'string'},
        {name: 'subTotal', type: 'string'},
        {name: 'income', type: 'string'},

        {name: 'materialElectricBudget', type: 'string'},
        {name: 'materialElectricReality', type: 'string'},
        {name: 'materialPlasterBudget', type: 'string'},
        {name: 'materialPlasterReality', type: 'string'},
        {name: 'materialCarpenterBudget', type: 'string'},
        {name: 'materialCarpenterReality', type: 'string'},
        {name: 'materialPaintBudget', type: 'string'},
        {name: 'materialPaintReality', type: 'string'},
        {name: 'materialMiscellaneousBudget', type: 'string'},
        {name: 'materialMiscellaneousReality', type: 'string'},
        {name: 'materialTotalBudget', type: 'string'},
        {name: 'materialTotalReality', type: 'string'},

        {name: 'manualElectricBudget', type: 'string'},
        {name: 'manualElectricReality', type: 'string'},
        {name: 'manualPlasterBudget', type: 'string'},
        {name: 'manualPlasterReality', type: 'string'},
        {name: 'manualCarpenterBudget', type: 'string'},
        {name: 'manualCarpenterReality', type: 'string'},
        {name: 'manualPaintBudget', type: 'string'},
        {name: 'manualPaintReality', type: 'string'},
        {name: 'manualMiscellaneousBudget', type: 'string'},
        {name: 'manualMiscellaneousReality', type: 'string'},
        {name: 'manualTotalBudget', type: 'string'},
        {name: 'manualTotalReality', type: 'string'},

        {name: 'totalBudget', type: 'string'},
        {name: 'totalReality', type: 'string'},
        {name: 'others', type: 'string'},
        {name: 'status', type: 'string'}
    ],
    idProperty: 'id'
});