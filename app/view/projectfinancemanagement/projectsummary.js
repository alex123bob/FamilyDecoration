Ext.define('FamilyDecoration.view.projectfinancemanagement.ProjectSummary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectfinancemanagement-projectsummary',
    requires: [
        'FamilyDecoration.store.ProjectSummary'
    ],

    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.ProjectSummary', {
                autoLoad: true,
                remoteSort: true
            });

        function _generateBudgetCfg(budgetType) {
            var cfg = {
                text: budgetType == 'material' ? '材料成本' : (budgetType == 'manual' ? '人工成本' : ''),
                columns: [
                    {
                        text: '水电',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'ElectricBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'ElectricReality'
                            }
                        ]
                    },
                    {
                        text: '基础泥工',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'BasicPlasterBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'BasicPlasterReality'
                            }
                        ]
                    },
                    {
                        text: '贴砖泥工',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'PlasterBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'PlasterReality'
                            }
                        ]
                    },
                    {
                        text: '木工',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'CarpenterBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'CarpenterReality'
                            }
                        ]
                    },
                    {
                        text: '油漆',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'PaintBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'PaintReality'
                            }
                        ]
                    },
                    {
                        text: '力工',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'LaborBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'LaborReality'
                            }
                        ]
                    },
                    {
                        text: '杂项',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'MiscellaneousBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'MiscellaneousReality'
                            }
                        ]
                    },
                    {
                        text: '合计',
                        align: 'right',
                        columns: [
                            {
                                text: '预算',
                                align: 'right',
                                flex: 0.5,
                                dataIndex: budgetType + 'TotalBudget'
                            },
                            {
                                text: '实际',
                                align: 'right',
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

        me.viewConfig = {
            getRowClass: function (rec, rowIndex, rowParams, st) {
                var totalReality = parseFloat(rec.get('totalReality')),
                    totalBudget = parseFloat(rec.get('totalBudget')),
                    cls = '';
                if (Ext.isNumber(totalBudget) && Ext.isNumber(totalBudget)) {
                    if (totalBudget === 0 || totalReality === 0) {
                        cls = 'bill-money-exceptional';
                    }
                    else if (totalReality - totalBudget > 0) {
                        cls = 'bill-reality-greater-than-budget';
                    }
                }
                return cls;
            }
        };

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
                align: 'right'
            },
            items: [
                {
                    text: '项目经理',
                    width: 80,
                    dataIndex: 'captain'
                },
                {
                    text: '工程名称',
                    width: 150,
                    dataIndex: 'projectName'
                },
                {
                    text: '总价',
                    columns: [
                        {
                            text: '合同',
                            align: 'right',
                            flex: 0.5,
                            dataIndex: 'contract'
                        },
                        {
                            text: '增减',
                            align: 'right',
                            flex: 0.5,
                            dataIndex: 'incNDec'
                        },
                        {
                            text: '合计',
                            align: 'right',
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
                        align: 'right',
                        dataIndex: 'totalBudget'
                    },
                    {
                        text: '实际',
                        flex: 0.5,
                        align: 'right',
                        dataIndex: 'totalReality'
                    }
                ]
            },
            {
                text: '其他', // 内部工资消耗
                width: 54,
                dataIndex: 'others',
                align: 'right'
            },
            {
                text: '目前状态',
                width: 100,
                dataIndex: 'status',
                align: 'right'
            }
        );

        me.columns = cfg;

        this.callParent();
    }
});