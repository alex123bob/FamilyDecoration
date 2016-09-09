Ext.define('FamilyDecoration.view.suppliermanagement.MaterialOrderList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.suppliermanagement-materialorderlist',
    title: '订购单列表',
    requires: [
        'FamilyDecoration.store.MaterialOrderList',
        'FamilyDecoration.view.suppliermanagement.ApplyForPayment'
    ],
    supplier: undefined,

    initComponent: function () {
        var me = this;

        var st = Ext.create('FamilyDecoration.store.MaterialOrderList', {
            autoLoad: true
        });

        function _getRes() {
            var st = me.getStore(),
                selModel = me.getSelectionModel(),
                order = selModel.getSelection()[0];
            return {
                st: st,
                selModel: selModel,
                order: order
            };
        }

        function _getBtns() {
            return {
                confirm: me.down('button[name="confirm"]'),
                request: me.down('button[name="request"]'),
                pass: me.down('button[name="pass"]'),
                returnReq: me.down('button[name="return"]'),
                passSecond: me.down('button[name="pass_second"]')
            };
        }

        function _initBtn(supplier) {
            var btnObj = _getBtns(),
                resObj = _getRes();
            btnObj.confirm.setDisabled(!supplier || !resObj.order);
            btnObj.request.setDisabled(!supplier || !resObj.order);
            btnObj.pass.setDisabled(!supplier || !resObj.order);
            btnObj.returnReq.setDisabled(!supplier || !resObj.order);
            btnObj.passSecond.setDisabled(!supplier || !resObj.order);
        }

        function _initGrid(supplier) {
            var resObj = _getRes();
            if (supplier) {
                var proxy = resObj.st.getProxy();
                proxy.extraParams.supplierId = supplier.getId();
                resObj.st.setProxy(proxy);
                resObj.st.loadPage(1, {
                    callback: function (recs, ope, success) {
                        if (success) {
                            var index = resObj.st.indexOf(resObj.order);
                            resObj.selModel.deselectAll();
                            if (-1 != index) {
                                resObj.selModel.select(index);
                            }
                        }
                    }
                });
            }
            else {
                resObj.st.removeAll();
            }
        }

        me.refresh = function (supplier) {
            me.supplier = supplier;
            _initBtn(supplier);
            _initGrid(supplier);
        };

        me.store = st;

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: st,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.tbar = [
            {
                text: '确认发货',
                name: 'confirm',
                disabled: true,
                icon: 'resources/img/confirm_dispatch.png',
                handler: function () {

                }
            },
            {
                text: '申请付款',
                name: 'request',
                disabled: true,
                icon: 'resources/img/request_payment.png',
                handler: function () {
                    var win = Ext.create('FamilyDecoration.view.suppliermanagement.ApplyForPayment', {

                    });
                    win.show();
                }
            },
            {
                text: '申付审核通过',
                name: 'pass',
                disabled: true,
                icon: 'resources/img/payment_approval.png',
                handler: function () {

                }
            },
            {
                text: '退回申付',
                name: 'return',
                disabled: true,
                icon: 'resources/img/payment_return.png',
                handler: function () {

                }
            },
            {
                xtype: 'textfield',
                fieldLabel: '总累计金额',
                readOnly: true,
                labelWidth: 80
            }
        ];

        me.bbar = [
            {
                text: '申付二审审核通过',
                name: 'pass_second',
                disabled: true,
                icon: './resources/img/pass_materialorder_request.png'
            }
        ];

        me.columns = [
            {
                text: '工程名称',
                dataIndex: 'projectName',
                align: 'center',
                flex: 1
            },
            {
                text: '项目经理',
                flex: 0.7,
                align: 'center',
                dataIndex: 'creatorRealName'
            },
            {
                text: '总金额',
                dataIndex: 'totalFee',
                flex: 0.7,
                align: 'center'
            },
            {
                text: '订购单',
                flex: 0.5,
                xtype: 'actioncolumn',
                align: 'center',
                items: [
                    {
                        tooltip: '点击查看单据',
                        icon: 'resources/img/material_order_sheet.png',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            var win = window.open('./fpdf/statement_bill.php?id=' + rec.getId(), '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                        }
                    }
                ]
            },
            {
                text: '订购日期',
                align: 'center',
                flex: 1,
                dataIndex: 'createTime'
            },
            {
                text: '审核状态',
                align: 'center',
                flex: 1,
                dataIndex: 'statusName'
            },
            {
                text: '申领金额',
                align: 'center',
                flex: 1,
                dataIndex: 'claimAmount'
            },
            {
                text: '已付金额',
                align: 'center',
                flex: 1,
                dataIndex: 'paidAmount'
            }
        ];

        me.addListener({
            selectionchange: function (selModel, sels, opts) {
                _initBtn(me.supplier);
            }
        });

        this.callParent();
    }
});