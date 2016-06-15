Ext.define('FamilyDecoration.view.planmaking.AddPlanTable', {
    extend: 'Ext.window.Window',
    alias: 'widget.planmaking-addplantable',
    layout: 'vbox',
    requires: [
        'FamilyDecoration.store.PlanMaking'
    ],

    initComponent: function () {
        var me = this;

        me.getValues = function () {

        };

        me.refresh = function () {

        };

        me.items = [
        ];

        me.listeners = {
            afterrender: function (panel, opts) {
                
            }
        };

        me.callParent();
    }
});