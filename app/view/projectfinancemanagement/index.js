Ext.define('FamilyDecoration.view.projectfinancemanagement.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.projectfinancemanagement-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain'
    ],
    // autoScroll: true,
    layout: 'hbox',
    defaults: {
        height: '100%'
    },

    initComponent: function () {
        var me = this;

        function _getRes() {

        };

        me.items = [
            {
                xtype: 'progress-projectlistbycaptain',
                searchFilter: true,
                title: '工程项目',
                itemId: 'projectlist',
                loadAll: false,
                flex: 1
            },
            {
                xtype: 'container',
                flex: 4
            }
        ];

        this.callParent();
    }
});