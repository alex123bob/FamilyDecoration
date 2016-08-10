Ext.define('FamilyDecoration.view.entrynexit.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.entrynexit-index',
    requires: [
        'FamilyDecoration.view.entrynexit.EntryNExitBoard'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this;

        function getRes (){
            var expenseMenu = me.down('[name="gridpanel-expense"]'),
                expenseSelModel = expenseMenu.getSelectionModel(),
                incomeMenu = me.down('[name="gridpanel-income"]'),
                incomeSelModel = incomeMenu.getSelectionModel(),
                detailList = me.down('[name="gridpanel-entrynexit"]');
            return {
                expenseMenu: expenseMenu,
                expenseSelModel: expenseSelModel,
                incomeMenu: incomeMenu,
                incomeSelModel: incomeSelModel,
                detailList: detailList
            };
        }

        me.items = [
            {
                xtype: 'container',
                layout: 'vbox',
                flex: 1,
                height: '100%',
                defaultType: 'gridpanel',
                defaults: {
                    autoScroll: true,
                    width: '100%',
                    style: {
                        borderRightStyle: 'solid',
                        borderRightWidth: '1px'
                    },
                    columns: {
                        defaults: {
                            align: 'center',
                            flex: 1
                        },
                        items: [
                            {
                                text: '名称',
                                dataIndex: 'value'
                            }
                        ]
                    },
                    hideHeaders: true
                },
                items: [
                    {
                        name: 'gridpanel-expense',
                        title: '出账',
                        flex: 2,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'workerSalary',
                                    value: '工人工资'
                                },
                                {
                                    name: 'staffSalary',
                                    value: '员工工资'
                                },
                                {
                                    name: 'materialPayment',
                                    value: '材料付款'
                                },
                                {
                                    name: 'reimbursementItems',
                                    value: '报销款项'
                                },
                                {
                                    name: 'financialFee',
                                    value: '财务费用'
                                },
                                {
                                    name: 'companyBonus',
                                    value: '公司福利'
                                },
                                {
                                    name: 'tax',
                                    value: '税费'
                                },
                                {
                                    name: 'qualityGuaranteeDeposit',
                                    value: '质保金'
                                }
                            ],
                            proxy: {
                                type: 'memory',
                                reader: {
                                    type: 'json'
                                }
                            }
                        }),
                        listeners: {
                            selectionchange: function (selModel, sels, opts){
                                var rec = sels[0],
                                    resObj = getRes();
                                if (rec) {
                                    resObj.incomeSelModel.deselectAll();
                                }
                                resObj.detailList.refresh(rec,true);
                            }
                        }
                    },
                    {
                        name: 'gridpanel-income',
                        title: '入账',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'designDeposit',
                                    value: '设计定金'
                                },
                                {
                                    name: 'projectFee',
                                    value: '工程款'
                                },
                                {
                                    name: 'loan',
                                    value: '贷款'
                                },
                                {
                                    name: 'other',
                                    value: '其他'
                                }
                            ],
                            proxy: {
                                type: 'memory',
                                reader: {
                                    type: 'json'
                                }
                            }
                        }),
                        flex: 1,
                        listeners: {
                            selectionchange: function (selModel, sels, opts){
                                var rec = sels[0],
                                    resObj = getRes();
                                if (rec) {
                                    resObj.expenseSelModel.deselectAll();
                                }
                                resObj.detailList.refresh(rec,true);
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'entrynexit-entrynexitboard',
                flex: 4,
                height: '100%',
                name: 'gridpanel-entrynexit'
            }
        ];

        this.callParent();
    }
});