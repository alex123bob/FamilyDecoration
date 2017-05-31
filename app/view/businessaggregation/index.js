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

        var filter = function(name, val) {
            var proxy = st.getProxy(),
                extraParams = proxy.extraParams;
            if (val === '') {
                delete extraParams[name]
            }
            else {
                extraParams[name] = val;
            }
            st.setProxy(proxy);
            st.loadPage(1);
        }

        me.items = [
            {
                title: '业务汇总',
                store: st,
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        layout: 'hbox',
                        defaults: {
                            xtype: 'textfield',
                            flex: 1,
                            hideLabel: true
                        },
                        items: [
                            {
                                itemId: 'salesman',
                                emptyText: '业务员',
                                listeners: {
                                    change: function(txt, newVal, oldVal) {
                                        filter(txt.itemId, newVal);
                                    }
                                }
                            },
                            {
                                itemId: 'designer',
                                emptyText: '设计师',
                                listeners: {
                                    change: function(txt, newVal, oldVal) {
                                        filter(txt.itemId, newVal);
                                    }
                                }
                            },
                            {
                                itemId: 'level',
                                emptyText: '等级',
                                flex: 0.2,
                                listeners: {
                                    change: function(txt, newVal, oldVal) {
                                        filter(txt.itemId, newVal);
                                    }
                                }
                            },
                            {
                                itemId: 'createTime',
                                emptyText: '创建时间',
                                xtype: 'datefield',
                                editable: false,
                                cleanBtn: true,
                                cleanHandler: function() {
                                },
                                listeners: {
                                    change: function(txt, newVal, oldVal) {
                                        filter(txt.itemId, newVal !== '' ? Ext.Date.format(newVal,'Y-m-d') : '');
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: '图表',
                                flex: 0.2,
                                handler: function() {
                                    Ext.Ajax.request({
                                        url: './libs/business.php',
                                        params: {
                                            action: 'getBusinessByDate'
                                        },
                                        method: 'GET',
                                        callback: function(opts, success, res) {
                                            if (success) {
                                                var arr = Ext.decode(res.responseText),
                                                    xAxis = [], data = [];
                                                Ext.each(arr.data, function(el, index, self) {
                                                    xAxis.push(el.date);
                                                    data.push(el.num);
                                                });
                                                xAxis = xAxis.slice(-30);
                                                data = data.slice(-30);
                                                var win = Ext.create('Ext.window.Window', {
                                                    title: '业务日增量',
                                                    width: 500,
                                                    height: 400,
                                                    maximized: true,
                                                    modal: true,
                                                    maximizable: true,
                                                    layout: 'fit',
                                                    items: [
                                                        {
                                                            xtype: 'panel',
                                                            cls: 'businessLineChart'
                                                        }
                                                    ],
                                                    listeners: {
                                                        show: function(win) {
                                                            $('.businessLineChart').highcharts({
                                                                chart: {
                                                                    type: 'line'
                                                                },
                                                                title: {
                                                                    text: '业务增量统计'
                                                                },
                                                                subtitle: {
                                                                    text: '佳诚装饰'
                                                                },
                                                                xAxis: {
                                                                    categories: xAxis
                                                                },
                                                                yAxis: {
                                                                    title: {
                                                                        text: '业务量'
                                                                    }
                                                                },
                                                                plotOptions: {
                                                                    line: {
                                                                        dataLabels: {
                                                                            enabled: true
                                                                        },
                                                                        enableMouseTracking: false
                                                                    }
                                                                },
                                                                series: [{
                                                                    name: '业务量',
                                                                    data: data
                                                                }]
                                                            });
                                                        },
                                                        resize: function (win){
                                                            var chart = $('.businessLineChart').highcharts();
                                                            if (chart) {
                                                                chart.setSize(win.getWidth(), win.getHeight(), true);
                                                            }
                                                        }
                                                    }
                                                });
                                                win.show();
                                            }
                                        }
                                    })
                                }
                            }
                        ]
                    },
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
                },
                listeners: {
					itemdblclick: function (view, rec, item, index, e, opts) {
						window.busi = {
							salesmanName: rec.get('salesmanName'),
							bid: rec.getId()
						};

						changeMainCt('checkbusiness-index');
					}
				}
            }
        ]

        this.callParent();
    }
});