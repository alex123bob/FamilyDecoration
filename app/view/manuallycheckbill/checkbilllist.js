Ext.define('FamilyDecoration.view.manuallycheckbill.CheckBillList', {
    extend: 'Ext.window.Window',
    alias: 'widget.manuallycheckbill-checkbilllist',
    layout: 'fit',
    title: '工人对账单',
    modal: true,
    requires: [
        'FamilyDecoration.store.StatementBill'
    ],
    width: 850,
    height: 350,
    maximizable: true,

    infoObj: undefined, // refType, refId

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'gridpanel',
                selType: 'rowmodel',
                selModel: {
                    mode: 'SINGLE'
                },
                store: Ext.create('FamilyDecoration.store.StatementBill', {
                    autoLoad: true,
                    proxy: {
                        url: './libs/api.php',
                        type: 'rest',
                        reader: {
                            type: 'json',
                            root: 'data'
                        },
                        extraParams: {
                            payee: me.infoObj.payee,
                            professionType: me.infoObj.professionType,
                            projectId: me.infoObj.projectId,
                            action: 'StatementBill.get',
                            billType : '!qgd'
                        }
                    }
                }),
                columns: [
                    {
                        text: '单号',
                        dataIndex: 'id',
                        flex: 1.5,
                        align: 'center'
                    },
                   /* {
                        text: '名字',
                        dataIndex: 'billName',
                        flex: 1,
                        align: 'left'
                    },*/
                    {
                        text: '总金额',
                        dataIndex: 'totalFee',
                        flex: 0.5,
                        align: 'left'
                    },
                    {
                        text: '申领金额',
                        dataIndex: 'claimAmount',
                        flex: 0.5,
                        align: 'left'
                    },
                    {
                        text: '实付',
                        dataIndex: 'paidAmount',
                        flex: 0.5,
                        align: 'left'
                    },
                    {
                        text: '付款时间',
                        dataIndex: 'paidTime',
                        flex: 1.5,
                        align: 'left'
                    },
                    {
                        text: '付款人',
                        dataIndex: 'payerRealName',
                        flex: 0.8,
                        align: 'left'
                    },
                    {
                        text: '状态',
                        dataIndex: 'statusName',
                        flex: 0.8,
                        align: 'center'
                    },
                    {
                        text: '创建时间',
                        dataIndex: 'createTime',
                        flex: 1.5,
                        align: 'center'
                    }                    
                ],
                listeners: {
                    cellclick: function (view, td, cellIndex, rec, tr, rowIndex, e, opts) {
                       //TODO
                    }
                }
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    this.up('window').close();
                }
            }
        ]
        me.callParent();
    }
});