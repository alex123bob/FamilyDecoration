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
        'Business',
        'TaskAssign',
        'User',
        'MyTask',
        'CostAnalysis',
        'Leave',
        'LeaveApproval'
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
