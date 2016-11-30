Ext.define('FamilyDecoration.view.totalpropertymanagement.MonthlyBillDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.totalpropertymanagement-MonthlyBillDetail',
    requires: [
        'FamilyDecoration.store.AccountLog'
    ],
    layout: 'fit',
    width: 500,
    height: 300,
    title: '月现金账详细清单',
    maximizable: true,
    modal: true,
    account: undefined,
    defaults: {
        
    },
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.AccountLog', {
                autoLoad: false
            }),
            proxy = st.getProxy();

        Ext.apply(proxy.extraParams, {
            accountId: me.account.get('accountId'),
            checkMonth: me.account.get('checkMonth')
        });
        st.load();

        me.buttons = [
            {
                text: '导出报表',
                handler: function () {
                    // todo, invoke backend interfaces to generate corresponding pdf
                }
            }
        ]

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                store: st,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '日期',
                            dataIndex: 'createTime'
                        },
                        {
                            text: '出账',
                            dataIndex: 'outcome'
                        },
                        {
                            text: '入账',
                            dataIndex: 'income'
                        },
                        {
                            text: '账户余额',
                            dataIndex: 'balance'
                        },
                        {
                            text: '明细',
                            dataIndex: 'createTime'
                        },
                        {
                            text: '核对人',
                            dataIndex: 'checker'
                        }
                    ]
                }
            }
        ]
        
        this.callParent();
    }
});