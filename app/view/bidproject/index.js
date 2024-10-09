Ext.define('FamilyDecoration.view.bidproject.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.bidproject-index',
    requires: [
        'FamilyDecoration.store.BidProject',
        'FamilyDecoration.store.BidProjectRegion'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                flex: 1,
                height: '100%',
                margin: '0 1 0 0',
                title: '区域',
                itemId: 'gridpanel-bidprojectregion',
                xtype: 'widgets-gridpanel',
                backendSvc: 'BidProjectRegion',
                canDelete: User.isAdmin() || User.isBudgetManager(),
                canEdit: User.isAdmin() || User.isBudgetManager(),
                columns: {
                    defaults: {
                        flex: 1,
                        editor: 'textfield'
                    },
                    items: [
                        {
                            text: '名称',
                            dataIndex: 'name'
                        }
                    ]
                },
                onSelectionChange: function(selModel, recs, opts ) {
                    var rec = recs[0];
                    if (rec) {
                        var bidProject = me.getComponent('gridpanel-bidproject'),
                            st = bidProject.getStore();
                        st.loadPage(1, {
                            params: {
                                regionId: rec.getId()
                            }
                        });
                    }
                }
            },
            {
                height: '100%',
                canRefresh: false,
                canAutoLoad: false,
                flex: 7,
                xtype: 'widgets-gridpanel',
                title: '开标情况',
                itemId: 'gridpanel-bidproject',
                name: 'gridpanel-bidproject',
                backendSvc: 'BidProject',
                canDelete: User.isAdmin() || User.isBudgetManager(),
                canEdit: true,
                canRefresh: true,
                itemsPerPage: 100000,
                onAdd: function(backendSvc, newValues, callback) {
                    var region = me.getComponent('gridpanel-bidprojectregion'),
                        rec = region.getSelectionModel().getSelection()[0];
                    if (rec) {
                        Ext.apply(newValues, {
                            regionId: rec.getId()
                        });
                        ajaxAdd(backendSvc, newValues, callback);
                    }
                    else {
                        showMsg('请选区域');
                    }
                },
                bbar: [
                    {
                        text: '导出',
                        icon: './resources/img/upload.png',
                        handler: function() {
                            var region = me.getComponent('gridpanel-bidprojectregion'),
                                rec = region.getSelectionModel().getSelection()[0];
                            if (rec) {
                                window.open('./libs/api.php?action=BidProject.get&start=0&limit=8000&download=开标工程&regionId=' + rec.getId());
                            }
                            else {
                                showMsg('请选区域');
                            }
                        }
                    }
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        editor: 'textfield'
                    },
                    items: [
                        {
                            xtype: 'actioncolumn',
                            editor: null,
                            width: 25,
                            flex: null,
                            items: [
                                {
                                    icon: 'resources/img/add.png',
                                    tooltip: '申请投标保证金',
                                    handler: function(grid, rowIndex, colIndex) {
                                        var st = grid.getStore();
                                        var rec = st.getAt(rowIndex);
                                        if (rec.getId()) {
                                            ajaxGet('StatementBill', 'get', {
                                                refId: rec.getId(),
                                                billType: 'bidbond'
                                            }, function(obj){
                                                var win = Ext.create('FamilyDecoration.view.bulletin.BidDepositForm', {
                                                    isEdit: true,
                                                    bidProject: rec,
                                                    rec: obj.data[0]
                                                });
                                                win.show();
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            text: '开标时间',
                            dataIndex: 'startTime',
                            editor: {
                                xtype: 'datefield',
                                submitFormat: 'Y-m-d',
                                format: 'Y-m-d',
                            },
                            renderer: function(val, meta, rec, rowIdx, colIdx, st, view) {
                                var d = Ext.util.Format.dateRenderer('Y-m-d')(val),
                                    res = '';
                                if (new Date(d) - Date.now() < 0) {
                                    res = '<strong><font color="#cccccc">' + d + '</font></strong>';
                                }
                                else if ((new Date(d) - Date.now()) / 1000 / 60 /60 / 24 <= 7) {
                                    res = '<strong><font color="#f300ffb5">' + d + '</font></strong>';
                                }
                                else if ((new Date(d) - Date.now()) / 1000 / 60 /60 / 24 <= 14) {
                                    res = '<strong><font color="darkorange">' + d + '</font></strong>';
                                }
                                else {
                                    res = '<strong><font color="blue">' + d + '</font></strong>';
                                }
                                return res;
                            }
                        },
                        {
                            text: '具体时间',
                            dataIndex: 'specificTime',
                            editor: {
                                xtype: 'textfield'
                            }
                        },
                        {
                            text: '工程名称',
                            dataIndex: 'name',
                            flex: 2
                        },
                        {
                            text: '项目负责人要求',
                            dataIndex: 'requirement'
                        },
                        {
                            text: '开标地点',
                            dataIndex: 'location',
                            flex: 2
                        },
                        {
                            text: '保证金属性',
                            dataIndex: 'depositProperty',
                        },
                        {
                            text: '代理机构',
                            dataIndex: 'agency',
                        },
                        {
                            text: '预算造价',
                            dataIndex: 'budgetCost',
                            editor: 'numberfield',
                            renderer: function(val){
                                return Ext.util.Format.currency(val, '￥');
                            }
                        },
                        {
                            text: '控制价',
                            dataIndex: 'controlledPrice',
                            editor: 'numberfield',
                            flex: 0.75,
                            renderer: function(val){
                                return Ext.util.Format.currency(val, '￥');
                            }
                        },
                        {
                            text: '投标价',
                            flex: 0.75,
                            dataIndex: 'bidPrice',
                            editor: 'numberfield',
                            renderer: function(val){
                                return Ext.util.Format.currency(val, '￥');
                            }
                        },
                        {
                            text: '中标人',
                            flex: 0.75,
                            dataIndex: 'preferredBidder',
                            flex: 2
                        },
                        {
                            text: '中标价',
                            flex: 0.75,
                            dataIndex: 'bidWinningPrice',
                            editor: 'numberfield',
                            renderer: function(val){
                                return Ext.util.Format.currency(val, '￥');
                            }
                        },
                        {
                            text: '下浮率',
                            flex: 0.75,
                            dataIndex: 'floatDownRate',
                        },
                    ]
                }
            }
        ];

        this.callParent();
    }
});