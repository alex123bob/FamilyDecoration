Ext.define('FamilyDecoration.view.projectfinancemanagement.SingleProjectBudgetTotal', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectfinancemanagement-singleprojectbudgettotal',
    requires: [
        'FamilyDecoration.view.projectfinancemanagement.ColumnChart',
        'FamilyDecoration.view.projectfinancemanagement.PieChart',
        'FamilyDecoration.store.SingleProjectBudgetTotal',
        'FamilyDecoration.store.SingleProjectBudgetTotalCostDifference'
    ],
    // layout: 'vbox',
    autoScroll: true,
    defaults: {
        width: '100%'
    },
    professionType: undefined, // for this panel, this value should be 0000 which refers to total analysis.
    projectId: undefined,

    initComponent: function () {
        var me = this,
            cfg,
            st = Ext.create('FamilyDecoration.store.SingleProjectBudgetTotal', {
                autoLoad: false
            }),
            costDiffSt = Ext.create('FamilyDecoration.store.SingleProjectBudgetTotalCostDifference', {
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
                    text: '泥工',
                    align: 'center',
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
                    align: 'center',
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
                    align: 'center',
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
                    align: 'center',
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
                    align: 'center',
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
                    align: 'center',
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
                        align: 'right',
                        flex: 0.5,
                        dataIndex: typeName + 'MtDf'
                    },
                    {
                        text: '人工',
                        align: 'right',
                        flex: 0.5,
                        dataIndex: typeName + 'MpDf'
                    }
                ]
            }
        }

        function _generateAnalysisPanel (professionTypeTitle, professionType) {
            function _generateGrid (title, type){
                var st = Ext.create('Ext.data.Store', {
                    fields: ['name', 'unit', 'amount', 'price', 'totalPrice'],
                    proxy: {
                        type: 'rest',
                        url: './libs/api.php',
                        extraParams: {
                            action: 'Project.getAnalysisDetail',
                            projectId: me.projectId,
                            professionType: professionType,
                            type: type
                        },
                        reader: {
                            root: 'data',
                            type: 'json'
                        }
                    },
                    autoLoad: true
                })
                return {
                    header: {
                        title: title,
                        padding: 1
                    },
                    margin: '0 1 0 0',
                    store: st,
                    columns: {
                        defaults: {
                            align: 'center',
                            flex: 1
                        },
                        items: [
                            {
                                text: '名称',
                                dataIndex: 'name'
                            },
                            {
                                text: '单位',
                                dataIndex: 'unit'
                            },
                            {
                                text: '数量',
                                dataIndex: 'amount'
                            },
                            {
                                text: '单价',
                                dataIndex: 'price'
                            },
                            {
                                text: '总价',
                                dataIndex: 'totalPrice'
                            }
                        ]
                    }
                }
            }
            return {
                xtype: 'panel',
                header: {
                    title: professionTypeTitle,
                    padding: 2
                },
                height: 300,
                layout: 'hbox',
                defaults: {
                    height: '100%',
                    xtype: 'gridpanel',
                    flex: 1
                },
                items: [
                    _generateGrid('人力预算', 'manpowerBudget'),
                    _generateGrid('人力实际', 'manpowerReality'),
                    _generateGrid('材料预算', 'materialBudget'),
                    _generateGrid('材料实际', 'materialReality')
                ]
            };
        }

        me.items = [
            {
                xtype: 'gridpanel',
                // flex: 1,
                itemId: 'gridpanel-costAnalysisFirstGrid',
                store: st,
                columns: [
                    _generateBudgetCfg('material'),
                    _generateBudgetCfg('manual'),
                    {
                        text: '总计',
                        align: 'right',
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
                        width: 50,
                        dataIndex: 'others',
                        align: 'right'
                    },
                    {
                        text: '目前状态',
                        width: 100,
                        dataIndex: 'status',
                        align: 'right'
                    }
                ]
            },
            {
                xtype: 'gridpanel',
                title: '成本分析(实际-预算)',
                // flex: 1,
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
                // flex: 1.5,
                height: 290,
                defaults: {
                    height: '100%',
                    flex: 1
                },
                items: [
                    {
                        xtype: 'projectfinancemanagement-columnchart',
                        title: '人工',
                        rootName: 'colMan',
                        projectId: me.projectId
                    },
                    {
                        xtype: 'projectfinancemanagement-columnchart',
                        title: '主材',
                        rootName: 'colMat',
                        projectId: me.projectId
                    },
                    {
                        xtype: 'projectfinancemanagement-piechart',
                        title: '成本组成',
                        projectId: me.projectId
                    }
                ]
            },
            _generateAnalysisPanel('水电', '0004'),
            _generateAnalysisPanel('泥工', '0001'),
            _generateAnalysisPanel('木工', '0002')
        ];

        this.callParent();
    }
});