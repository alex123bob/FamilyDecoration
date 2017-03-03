Ext.define('FamilyDecoration.view.businessaggregation.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.businessaggregation-index',
    requires: [
        'FamilyDecoration.store.Business'
    ],
    layout: 'fit',
    defaults: {
        xtype: 'gridpanel'
    },
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.Business', {
            }),
            proxy = st.getProxy();
        Ext.override(proxy, {
            extraParams: {
                action: 'getBusinessAggregation',
                isDead: 'false',
                isFrozen: 'false',
                isWaiting: 'false'
            },
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        });
        st.setProxy(proxy);
        st.load();

        me.items = [
            {
                title: '业务汇总',
                store: st,
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: st,   // same store GridPanel is using
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '小区',
                            dataIndex: 'regionName'
                        },
                        {
                            text: '地址',
                            dataIndex: 'address'
                        },
                        {
                            text: '等级',
                            dataIndex: 'level'
                        },
                        {
                            text: '客户',
                            dataIndex: 'customer'
                        },
                        {
                            text: '电话',
                            dataIndex: 'custContact'
                        },
                        {
                            text: '业务员',
                            dataIndex: 'salesman'
                        },
                        {
                            text: '设计师',
                            dataIndex: 'designer'
                        },
                        {
                            text: '来源',
                            dataIndex: 'source'
                        },
                        {
                            text: '时间',
                            dataIndex: 'createTime',
                            renderer: function (val, meta, rec) {
                                if (val) {
                                    val = Ext.Date.format(new Date(val.replace(/-/gi, '/')), 'Y-m-d');
                                }
                                else {
                                    val = '';
                                }

                                return val;
                            }
                        }
                    ]
                }
            }
        ]

        this.callParent();
    }
});