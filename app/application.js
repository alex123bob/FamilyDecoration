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
        'Leave',
        'LeaveApproval',
        'Msg',
        'Mail',
        'CheckBusiness',
        'SignBusiness',
        'CheckSignBusiness',
        'RegionMgm',
        'DeadBusiness'
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
