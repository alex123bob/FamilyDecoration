Ext.define('FamilyDecoration.Application', {
    name: 'FamilyDecoration',

    extend: 'Ext.app.Application',

    views: [
        // TODO: add views here
    ],

    controllers: [
        'Viewport',
        'Budget',
        'Chart',
        'Progress',
        'BasicItem',
        'Setting',
        'Bulletin',
        'MyLog',
        'CheckLog',
        'Plan',
        'MainMaterial',
        'MyBusiness',
        'TaskAssign',
        'User',
        'MyTask',
        'CostAnalysis',
        'Msg',
        'Mail',
        'CheckBusiness',
        'SignBusiness',
        'CheckSignBusiness',
        'RegionMgm',
        'DeadBusiness',
        'Personnel',
        'ProjectCategory',
        'ManuallyCheckBill',
        'CheckBillItem',
        'BillAudit',
        'PlanMaking',
        'ProjectProgress',
        'PlanLabor',
        'TeleMarket',
        'EntryNExit',
        'TargetSetting',
        'PaymentRequest',
        'Account',
        'MaterialRequest',
        'QualityGuaranteeDepositMgm',
        'SupplierManagement',
        'ProjectFinanceManagement',
        'TotalPropertyManagement',
        'BusinessAggregation',
        'BusinessToTransfer',
        'ContractManagement'
    ],

    stores: [

    ],

    requires: [
        'Ext.util.Cookies',
        'Ext.window.Window',
        'Ext.form.field.ComboBox',

        'FamilyDecoration.Common',
        'FamilyDecoration.view.Viewport'
    ]
});
