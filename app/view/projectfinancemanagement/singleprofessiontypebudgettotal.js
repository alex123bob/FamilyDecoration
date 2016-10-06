Ext.define('FamilyDecoration.view.projectfinancemanagement.SingleProfessionTypeBudgetTotal', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectfinancemanagement-SingleProfessionTypeBudgetTotal',
    requires: [
        'FamilyDecoration.view.projectfinancemanagement.ColumnChart',
        'FamilyDecoration.view.projectfinancemanagement.PieChart',
        'FamilyDecoration.store.SingleProfessionTypeBudgetTotal',
        'FamilyDecoration.store.SingleProfessionTypeBudgetTotalCostDifference'
    ],
    layout: 'vbox',
    defaults: {
        width: '100%'
    },
    professionType: undefined, // for this panel, this value should be 0000 which refers to total analysis.
    projectId: undefined,

    initComponent: function () {
        var me = this,
            cfg,
            st = Ext.create('FamilyDecoration.store.SingleProfessionTypeBudgetTotal', {
                autoLoad: false
            }),
            costDiffSt = Ext.create('FamilyDecoration.store.SingleProfessionTypeBudgetTotalCostDifference', {
                autoLoad: false
            }),
            proxy = st.getProxy(),
            costDiffProxy = costDiffSt.getProxy();
        
        Ext.apply(proxy.extraParams, {
            action: 'SingleProfessionTypeBudgetTotal.get',
            professionType: me.professionType,
            projectId: me.projectId
        });

        Ext.apply(costDiffProxy.extraParams, {
            action: 'SingleProfessionTypeBudgetTotalCostDifference.get',
            professionType: me.professionType,
            projectId: me.projectId
        });

        st.load();
        costDiffSt.load();

        function _generateBudgetCfg(budgetType) {
            var columnArr = [
                {
                    text: '水电',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'electricBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'electricReality'
                        }
                    ]
                },
                {
                    text: '泥工',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'plasterBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'plasterReality'
                        }
                    ]
                },
                {
                    text: '木工',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'carpenterBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'carpenterReality'
                        }
                    ]
                },
                {
                    text: '油漆',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'paintBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'paintReality'
                        }
                    ]
                },
                {
                    text: '杂项',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'miscellaneousBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'miscellaneousReality'
                        }
                    ]
                },
                {
                    text: '合计',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'totalBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'totalReality'
                        }
                    ]
                }
            ];
            if (budgetType) {
                var cfg = {
                    text: budgetType == 'material' ? '材料成本' : '人工成本',
                    columns: columnArr
                };
            }
            else {
                var cfg = columnArr;
            }

            return cfg;
        }

        me.items = [
            {
                xtype: 'gridpanel',
                flex: 1,
                itemId: 'gridpanel-costAnalysisFirstGrid',
                store: st,
                columns: [
                    _generateBudgetCfg('material'),
                    _generateBudgetCfg('manual'),
                    {
                        text: '总计',
                        columns: [
                            {
                                text: '预算',
                                flex: 0.5,
                                align: 'center',
                                dataIndex: 'totalBudget'
                            },
                            {
                                text: '实际',
                                flex: 0.5,
                                align: 'center',
                                dataIndex: 'totalReality'
                            }
                        ]
                    },
                    {
                        text: '其他', // 内部工资消耗
                        width: 50,
                        dataIndex: 'others',
                        align: 'center'
                    },
                    {
                        text: '目前状态',
                        width: 100,
                        dataIndex: 'status',
                        align: 'center'
                    }
                ]
            },
            {
                xtype: 'gridpanel',
                title: '成本分析',
                flex: 1,
                store: costDiffSt,
                columns: Ext.Array.push([{
                    text: '项目',
                    width: 50,
                    align: 'center'
                }], _generateBudgetCfg())
            },
            {
                xtype: 'panel',
                title: '分析表',
                layout: 'hbox',
                header: false,
                flex: 1.5,
                defaults: {
                    height: '100%',
                    flex: 1
                },
                items: [
                    {
                        xtype: 'projectfinancemanagement-columnchart',
                        title: '人工'
                    },
                    {
                        xtype: 'projectfinancemanagement-columnchart',
                        title: '主材'
                    },
                    {
                        xtype: 'projectfinancemanagement-piechart',
                        title: '成本组成'
                    }
                ]
            }
        ];

        this.callParent();
    }
});