Ext.define('FamilyDecoration.view.account.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.account-index',
    title: '账户管理',
    requires: [
        
    ],
    layout: 'hbox',

    initComponent: function () {
        var me = this;

        me.items = [];

        this.callParent();
    }
});