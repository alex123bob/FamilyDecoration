Ext.define('FamilyDecoration.view.projectfinancemanagement.SingleProfessionTypeBudget', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectfinancemanagement-singleprofessiontypebudget',
    requires: [
        'FamilyDecoration.store.StatementBill',
        'FamilyDecoration.store.SingleProfessionTypeBudget'
    ],
    professionType: undefined,
    projectId: undefined,
    layout: 'vbox',
    defaults: {
        xtype: 'gridpanel',
        width: '100%',
        autoScroll: true
    },
    
    initComponent: function () {
        var me = this,
            manpowerSt = Ext.create('FamilyDecoration.store.StatementBill', {
                autoLoad: false
            }),
            materialSt = Ext.create('FamilyDecoration.store.SingleProfessionTypeBudget', {
                autoLoad: false
            }),
            manpowerProxy = manpowerSt.getProxy(),
            materialProxy = materialSt.getProxy();
        
        Ext.apply(manpowerProxy, {
            extraParams: {
                action: 'Project.getProjectManPowerCost',
                professionType: me.professionType,
                projectId: me.projectId
            }
        });

        Ext.apply(materialProxy, {
            extraParams: {
                action: 'Project.getProjectMaterialCost',
                professionType: me.professionType,
                projectId: me.projectId
            }
        });

        manpowerSt.setProxy(manpowerProxy);
        materialSt.setProxy(materialProxy);

        manpowerSt.load();
        materialSt.load();

        me.items = [
            {
                flex: 1,
                title: '人工成本',
                store: manpowerSt,
                columns: {
                    defaults: {
                        align: 'center',
                        flex: 1
                    },
                    items: [
                        {
                            text: '领款人',
                            dataIndex: 'payee'
                        },
                        {
                            text: '申领金额',
                            dataIndex: 'claimAmount'
                        },
                        {
                            text: '实付金额',
                            dataIndex: 'paidAmount'
                        },
                        {
                            text: '单据',
                            dataIndex: 'id'
                        }
                    ]
                }
            },
            {
                title: '材料成本',
                flex: 1,
                store: materialSt,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '序号',
                            dataIndex: 'id',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '名称',
                            dataIndex: 'name',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '数量',
                            dataIndex: 'amount',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '单位',
                            dataIndex: 'unit',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '单价',
                            dataIndex: 'unitPrice',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '总价',
                            dataIndex: 'totalPrice',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '供货商',
                            dataIndex: 'supplierName',
                            flex: 1,
                            align: 'center'
                        },
                        {
                            text: '日期',
                            dataIndex: 'createTime',
                            flex: 1,
                            align: 'center'
                        }
                    ]
                }
            }
        ];

        this.callParent();
    }
});