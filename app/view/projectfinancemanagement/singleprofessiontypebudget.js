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
                            text: '订购单',
                            xtype: 'actioncolumn',
                            items: [
                                {
                                    tooltip: '点击查看订单',
                                    icon: 'resources/img/material_order_sheet.png',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex);
                                        var win = window.open('./fpdf/statement_bill.php?id=' + rec.getId(), '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                    }
                                }
                            ]
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
                            dataIndex: 'orderId'
                        },
                        {
                            text: '名称',
                            dataIndex: 'name'
                        },
                        {
                            text: '数量',
                            dataIndex: 'amount'
                        },
                        {
                            text: '单位',
                            dataIndex: 'unit'
                        },
                        {
                            text: '单价',
                            dataIndex: 'unitPrice'
                        },
                        {
                            text: '总价',
                            dataIndex: 'totalPrice'
                        },
                        {
                            text: '供货商',
                            dataIndex: 'supplierName'
                        },
                        {
                            text: '日期',
                            dataIndex: 'createTime'
                        }
                    ]
                }
            }
        ];

        this.callParent();
    }
});