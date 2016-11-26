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
            action: 'Project.financeReport',
            projectId: me.projectId
        });

        Ext.apply(costDiffProxy.extraParams, {
            action: 'Project.financeReport',
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
                            dataIndex: budgetType + 'ElectricBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'ElectricReality'
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
                            dataIndex: budgetType + 'PlasterBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'PlasterReality'
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
                            dataIndex: budgetType + 'CarpenterBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'CarpenterReality'
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
                            dataIndex: budgetType + 'PaintBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'PaintReality'
                        }
                    ]
                },
                {
                    text: '力工',
                    align: 'center',
                    columns: [
                        {
                            text: '预算',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'LaborBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'LaborReality'
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
                            dataIndex: budgetType + 'MiscellaneousBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'MiscellaneousReality'
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
                            dataIndex: budgetType + 'TotalBudget'
                        },
                        {
                            text: '实际',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: budgetType + 'TotalReality'
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

        function _generateDiffCfg (txt, typeName){
            return {
                text: txt,
                columns: [
                    {
                        text: '材料',
                        align: 'center',
                        flex: 0.5,
                        dataIndex: typeName + 'MtDf'
                    },
                    {
                        text: '人工',
                        align: 'center',
                        flex: 0.5,
                        dataIndex: typeName + 'MpDf'
                    }
                ]
            }
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
                        align: 'center',
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
                columns: [
                    {
                        text: '项目',
                        dataIndex: 'extra',
                        align: 'center',
                        width: 50
                    },
                    _generateDiffCfg('水电', 'elct'),
                    _generateDiffCfg('泥工', 'plst'),
                    _generateDiffCfg('木工', 'cpt'),
                    _generateDiffCfg('油漆', 'pt'),
                    _generateDiffCfg('力工', 'lb'),
                    _generateDiffCfg('杂项', 'mscl'),
                    _generateDiffCfg('合计', 'tt')
                ]
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