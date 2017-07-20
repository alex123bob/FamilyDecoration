Ext.define('FamilyDecoration.view.suppliermanagement.MaterialOrderList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.suppliermanagement-materialorderlist',
    title: '订购单列表',
    requires: [
        'FamilyDecoration.store.MaterialOrderList',
        'FamilyDecoration.view.suppliermanagement.ApplyForPayment'
    ],
    supplier: undefined,
    selType: 'checkboxmodel',
    selModel: {
        mode: 'SIMPLE'
    },

    initComponent: function () {
        var me = this;

        var st = Ext.create('FamilyDecoration.store.MaterialOrderList', {
            autoLoad: false,
            remoteSort: true,
            filters: [
                function (item) {
                    var status = item.get('status'),
                        statusFlag = (status && status != 'new' && status != 'rdyck');
                    if (User.isAdmin() || User.isProjectManager()
                        || User.isFinanceAccountant() || User.isFinanceManager()) {
                        return statusFlag;
                    }
                    else if (User.isProjectStaff()) {
                        if (item.get('creator') == User.getName()) {
                            return statusFlag;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
            ]
        });

        function _getRes() {
            var st = me.getStore(),
                selModel = me.getSelectionModel(),
                orders = selModel.getSelection(),
                order = orders[0],
                totalFee = me.down('[name="totalFee"]');
            return {
                st: st,
                selModel: selModel,
                orders: orders,
                order: order,
                totalFee: totalFee
            };
        }

        function _getBtns() {
            return {
                confirm: me.down('button[name="confirm"]'),
                request: me.down('button[name="request"]')
            };
        }

        function _initBtn(supplier) {
            var btnObj = _getBtns(),
                resObj = _getRes(),
                orders = resObj.orders,
                flag = supplier && resObj.order ? true : false;
            // btnObj.confirm.setDisabled(!supplier || !resObj.order);
            Ext.each(orders, function (order, index, self){
                if (order.get('status') != 'checked') {
                    flag = false;
                    return false;
                }
            });
            btnObj.request.setDisabled(!flag);
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

        function _initText(supplier) {
            var resObj = _getRes();
            if (supplier) {
                ajaxGet('SupplierOrder', 'getToPayTotalFee', {
                    supplierId: supplier.getId()
                }, function (obj){
                    resObj.totalFee.setValue(obj.totalFee);
                });
            }
            else {

            }
        }

        me.refresh = function (supplier) {
            me.supplier = supplier;
            _initBtn(supplier);
            _initGrid(supplier);
            _initText(supplier);
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
                index = st.indexOf(resObj.order),
                selModel = resObj.selModel;
            if (resObj.order) {
                function request(validateCode) {
                    var params = {
                        id: resObj.order.getId(),
                        status: status,
                        currentStatus: resObj.order.get('status')
                    }, arr = ['id', 'currentStatus'];
                    if (validateCode) {
                        Ext.apply(params, {
                            validateCode: validateCode
                        });
                        arr.push('validateCode');
                    }
                    ajaxUpdate('SupplierOrder.changeStatus', params, arr, function (obj) {
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
                        ajaxGet('SupplierOrder', 'getLimit', {
                            id: resObj.order.getId()
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
                showMsg('请选择申购单！');
            }
        };

        me.tbar = [
            {
                text: '确认发货',
                name: 'confirm',
                disabled: true,
                hidden: true, // hide temporarily.
                icon: 'resources/img/confirm_dispatch.png',
                handler: function () {

                }
            },
            {
                text: '申请付款',
                name: 'request',
                disabled: true,
                icon: 'resources/img/request_payment.png',
                hidden: User.isAdmin() || User.isFinanceAccountant() || User.isFinanceManager() ? false : true,
                handler: function () {
                    var resObj = _getRes();
                    var win = Ext.create('FamilyDecoration.view.suppliermanagement.ApplyForPayment', {
                        orders: resObj.orders,
                        supplier: me.supplier,
                        changeStatus: function (status, msg, successMsg, callback) {
                            me.changeStatus(status, msg, successMsg, callback);
                        },
                        callback: function () {
                            me.refresh(me.supplier);
                        }
                    });
                    win.show();
                }
            },
            {
                xtype: 'textfield',
                name: 'totalFee',
                fieldLabel: '未付款总金额',
                readOnly: true,
                labelWidth: 90
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
                            var win = window.open('./fpdf/material_order.php?id=' + rec.getId(), '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
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
            },
            {
                text: '付款单',
                align: 'center',
                flex: 1,
                dataIndex: 'paymentId',
                renderer: function (val, meta, rec){
                    if (rec.get('status') != 'applied') {
                        meta.style = 'background: skyblue';
                    }
                    else {

                    }
                    return val;
                }
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