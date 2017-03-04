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

        var timeRenderer = function (val, meta, rec) {
            if (val) {
                val = Ext.Date.format(new Date(val.replace(/-/gi, '/')), 'Y-m-d');
            }
            else {
                val = '';
            }

            return val;
        };

        me.items = [
            {
                title: '业务汇总',
                store: st,
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: st,   // same store GridPanel is using
                        dock: 'bottom',
                        displayInfo: true,
                        updateInfo: function () {
                            // we override this method for special use.
                            var me = this,
                                displayItem = me.child('#displayItem'),
                                store = me.store,
                                pageData = me.getPageData(),
                                count, msg,
                                // here we are gonna put ABCD business count into displayInfo.
                                jsonData = store.getProxy().getReader().jsonData;

                            if (displayItem) {
                                count = store.getCount();
                                if (count === 0) {
                                    msg = me.emptyMsg;
                                } else {
                                    msg = Ext.String.format(
                                        me.displayMsg,
                                        pageData.fromRecord,
                                        pageData.toRecord,
                                        pageData.total
                                    );
                                }
                                msg = 'A类: ' + jsonData.totalA + '; B类: ' + jsonData.totalB + '; C类: ' + jsonData.totalC + '; D类: ' + jsonData.totalD + '; ' + msg;
                                displayItem.setText(msg);
                            }
                        }
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
                            dataIndex: 'level',
                            flex: 0.5
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
                        // {
                        //     text: '签单时间',
                        //     dataIndex: 'levelTime',
                        //     renderer: timeRenderer
                        // },
                        {
                            text: '时间',
                            dataIndex: 'createTime',
                            renderer: timeRenderer
                        },
                        {
                            text: '等待',
                            dataIndex: 'isWaiting',
                            flex: 0.5,
                            renderer: function (val, meta, rec){
                                val = (val === 'true' ? '<font color="red">是</font>' : '否');
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