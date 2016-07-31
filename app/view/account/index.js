Ext.define('FamilyDecoration.view.account.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.account-index',
    title: '账户管理',
    requires: [
        'FamilyDecoration.store.Account',
        'FamilyDecoration.store.AccountLog'
    ],
    layout: 'hbox',
    defaults: {
        xtype: 'gridpanel',
        height: '100%'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                title: '账户',
                flex: 1,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '账户名称',
                            dataIndex: 'name'
                        },
                        {
                            text: '账户类型',
                            dataIndex: 'accountType'
                        }
                    ]
                },
                store: Ext.create('FamilyDecoration.store.Account', {
                    autoLoad: true
                })
            },
            {
                title: '近五日纪录',
                flex: 4,
                columns: []
            }
        ];

        this.callParent();
    }
});