Ext.define('FamilyDecoration.view.projectfinancemanagement.ProjectSummary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectfinancemanagement-projectsummary',
    requires: [

    ],
    layout: 'fit',

    initComponent: function () {
        var me = this;

        function _generateBudgetCfg(budgetType) {
            var cfg = {
                text: budgetType == 'material' ? '材料成本' : '人工成本',
                flex: false,
                columns: [
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
                ]
            };

            return cfg;
        }

        var cfg = {
            defaults: {
                align: 'center',
                flex: 1
            },
            items: [
                {
                    text: '序号',
                    dataIndex: 'id'
                },
                {
                    text: '项目经理',
                    dataIndex: 'captain'
                },
                {
                    text: '工程名称',
                    dataIndex: 'projectName'
                },
                {
                    text: '总价',
                    flex: false,
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
                    dataIndex: 'income'
                }
            ]
        };

        cfg.items.push(
            _generateBudgetCfg('material'), 
            _generateBudgetCfg('manual'),
            {
                text: '总计',
                flex: false,
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
                dataIndex: 'others'
            },
            {
                text: '目前状态',
                dataIndex: 'status'
            }
        );

        me.columns = cfg;

        this.callParent();
    }
});