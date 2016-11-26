Ext.define('FamilyDecoration.view.projectfinancemanagement.ProjectSummary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectfinancemanagement-projectsummary',
    requires: [
        'FamilyDecoration.store.ProjectSummary'
    ],

    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.ProjectSummary', {
                autoLoad: true
            });

        function _generateBudgetCfg(budgetType) {
            var cfg = {
                text: budgetType == 'material' ? '材料成本' : (budgetType == 'manual' ? '人工成本' : ''),
                columns: [
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
                ]
            };

            return cfg;
        }

        me.store = st;

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: st,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        var cfg = {
            defaults: {
                align: 'center'
            },
            items: [
                {
                    text: '序号',
                    width: 50,
                    dataIndex: 'id'
                },
                {
                    text: '项目经理',
                    width: 100,
                    dataIndex: 'captain'
                },
                {
                    text: '工程名称',
                    width: 100,
                    dataIndex: 'projectName'
                },
                {
                    text: '总价',
                    columns: [
                        {
                            text: '合同',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: 'contract'
                        },
                        {
                            text: '增减',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: 'incNDec'
                        },
                        {
                            text: '合计',
                            align: 'center',
                            flex: 0.5,
                            dataIndex: 'subTotal'
                        }
                    ]
                },
                {
                    text: '收入',
                    width: 50,
                    dataIndex: 'income'
                }
            ]
        };

        cfg.items.push(
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
        );

        me.columns = cfg;

        this.callParent();
    }
});