Ext.define('FamilyDecoration.view.projectfinancemanagement.SingleProfessionTypeBudget', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.projectfinancemanagement-singleprofessiontypebudget',
    requires: [
        
    ],
    professionType: undefined,
    
    initComponent: function () {
        var me = this;

        me.columns = [
            {
                text: '人工成本',
                align: 'center',
                columns: [
                    {
                        text: '领款人',
                        dataIndex: 'payee',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '金额',
                        dataIndex: 'manualTotalFee',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '单据',
                        dataIndex: 'billId',
                        flex: 1,
                        align: 'center'
                    }
                ]
            },
            {
                text: '主材成本',
                align: 'center',
                columns: [
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
                        dataIndex: 'mainMaterialTotalFee',
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
        ];

        this.callParent();
    }
});