Ext.define('FamilyDecoration.view.suppliermanagement.PaymentBillCheck', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.suppliermanagement-paymentbillcheck',
    title: '付款单审核',
    requires: [
        'FamilyDecoration.store.StatementBill'
    ],
    supplier: undefined,

    initComponent: function () {
        var me = this;

        var st = Ext.create('FamilyDecoration.store.StatementBill', {
            autoLoad: false,
            filters: [
                function (item) {
                    if (User.isAdmin() || User.isProjectManager()
                        || User.isFinanceAccountant() || User.isFinanceManager()) {
                        return true;
                    }
                    else if (User.isProjectStaff()) {
                        return item.get('creator') == User.getName();
                    }
                    else {
                        return false;
                    }
                }
            ],
            proxy: {
                type: 'rest',
                url: './libs/api.php',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total'
                },
                extraParams: {
                    action: 'StatementBill.get',
                    orderby: 'createTime DESC',
                    billType: 'mtf'
                }
            }
        });

        function _getRes() {
            var st = me.getStore(),
                selModel = me.getSelectionModel(),
                bill = selModel.getSelection()[0];
            return {
                st: st,
                selModel: selModel,
                bill: bill
            };
        }

        function _getBtns() {
            return {
                pass: me.down('button[name="pass"]'),
                returnReq: me.down('button[name="return"]'),
                passSecond: me.down('button[name="pass_second"]')
            };
        }

        function _initBtn(supplier) {
            var btnObj = _getBtns(),
                resObj = _getRes();
            btnObj.pass.setDisabled(!supplier || !resObj.bill || resObj.bill.get('status') != 'rdyck4');
            btnObj.returnReq.setDisabled(!supplier || !resObj.bill || resObj.bill.get('status') == 'paid' || resObj.bill.get('status') == 'arch');
            btnObj.passSecond.setDisabled(!supplier || !resObj.bill || resObj.bill.get('status') != 'rdyck5');
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
                            var index = resObj.st.indexOf(resObj.bill);
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

        me.changeStatus = function (status, msg, successMsg, callback) {
            var resObj = _getRes(),
                st = resObj.st,
                index = st.indexOf(resObj.bill),
                selModel = resObj.selModel;
            if (resObj.bill) {
                function request(validateCode) {
                    var params = {
                        id: resObj.bill.getId(),
                        status: status,
                        currentStatus: resObj.bill.get('status')
                    }, arr = ['id', 'currentStatus'];
                    if (validateCode) {
                        Ext.apply(params, {
                            validateCode: validateCode
                        });
                        arr.push('validateCode');
                    }
                    ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
                        Ext.defer(function () {
                            Ext.Msg.success(successMsg);
                            selModel.deselectAll();
                            st.reload({
                                callback: function (recs, ope, success) {
                                    if (success) {
                                        if (typeof callback == 'function') {
                                            callback();
                                        }
                                        selModel.select(index);
                                    }
                                }
                            });
                        }, 500);
                    }, true);
                }
                Ext.Msg.warning(msg, function (btnId) {
                    if ('yes' == btnId) {
                        ajaxGet('StatementBill', 'getLimit', {
                            id: resObj.bill.getId()
                        }, function (obj) {
                            if (obj.type == 'checked') {
                                showMsg(obj.hint);
                                request();
                            }
                            else {
                                Ext.defer(function () {
                                    Ext.Msg.password(obj.hint, function (val) {
                                        if (obj.type == 'sms') {
                                        }
                                        else if (obj.type == 'securePass') {
                                            val = md5(_PWDPREFIX + val);
                                        }
                                        request(val);
                                    });
                                }, 500);
                            }
                        });
                    }
                });
            }
            else {
                showMsg('请选择付款单！');
            }
        };

        me.tbar = [
            {
                text: '申付审核通过',
                hidden: User.isAdmin() || User.isProjectManager() ? false : true,
                name: 'pass',
                disabled: true,
                icon: 'resources/img/payment_approval.png',
                handler: function () {
                    var resObj = _getRes();
                    me.changeStatus('+1', '确定要将当前付款单置为申付审核通过吗？', '审核通过！');
                }
            },
            {
                text: '退回申付',
                name: 'return',
                disabled: true,
                hidden: User.isAdmin() ? false : true,
                icon: 'resources/img/payment_return.png',
                handler: function () {
                    var resObj = _getRes();
                    me.changeStatus('-1', '确定要将当前付款单退回至上一状态吗？', '已退回！');
                }
            }
        ];

        me.bbar = [
            {
                text: '申付二审审核通过',
                name: 'pass_second',
                disabled: true,
                icon: './resources/img/pass_materialorder_request.png',
                hidden: User.isAdmin() ? false : true,
                handler: function () {
                    var resObj = _getRes();
                    me.changeStatus('+1', '确定要将当前付款单置为申付二审通过吗？', '申付二审通过！');
                }
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