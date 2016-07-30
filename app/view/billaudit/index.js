Ext.define('FamilyDecoration.view.billaudit.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.billaudit-index',
    requires: [
        'FamilyDecoration.store.WorkCategory',
        'FamilyDecoration.view.manuallycheckbill.BillTable',
        'FamilyDecoration.store.StatementBill',
        'Ext.ux.form.SearchField',
        'FamilyDecoration.view.billaudit.BillList',
        'Ext.layout.container.Accordion',
        'FamilyDecoration.view.manuallycheckbill.BillRecord'
    ],
    layout: 'hbox',

    initComponent: function () {
        var me = this;
        // get all resources which used to be retrieved a lot of times. quite redundant before.
        // now we just encapsulate it.
        me.getRes = function () {
            var billList = Ext.getCmp('gridpanel-billListForAudit'),
                bill = billList.getSelectionModel().getSelection()[0],
                passedBillList = Ext.getCmp('gridpanel-passedBillListForAudit'),
                passedBill = passedBillList.getSelectionModel().getSelection()[0],
                paidBillList = Ext.getCmp('gridpanel-paidBillListForAudit'),
                paidBill = paidBillList.getSelectionModel().getSelection()[0],
                billDetailCt = Ext.getCmp('billtable-billDetailForAudit');

            return {
                billList: billList,
                bill: bill,
                passedBillList: passedBillList,
                passedBill: passedBill,
                paidBillList: paidBillList,
                paidBill: paidBill,
                billDetailCt: billDetailCt
            }
        };

        me.items = [
            {
                xtype: 'panel',
                title: '账单列表',
                flex: 1,
                layout: {
                    type: 'accordion',
                    titleCollapse: true,
                    animate: true,
                    activeOnTop: true
                },
                height: '100%',
                items: [
                    {
                        title: '待审核账单',
                        style: {
                            borderRightStyle: 'solid',
                            borderRightWidth: '1px'
                        },
                        xtype: 'billaudit-billlist',
                        billStatus: 'rdyck2',
                        id: 'gridpanel-billListForAudit',
                        name: 'gridpanel-billListForAudit',
                        selectionchangeEvent: function (selModel, sels, opts) {
                            var rec = sels[0],
                                resourceObj = me.getRes();
                            if (rec) {
                                resourceObj.passedBillList.getSelectionModel().deselectAll();
                                resourceObj.paidBillList.getSelectionModel().deselectAll();
                            }
                            resourceObj.billDetailCt.initBtn();
                            resourceObj.billDetailCt.bill = rec;
                            resourceObj.billDetailCt.refresh(rec);
                        }
                    },
                    {
                        title: '已审核账单',
                        style: {
                            borderRightStyle: 'solid',
                            borderRightWidth: '1px'
                        },
                        xtype: 'billaudit-billlist',
                        id: 'gridpanel-passedBillListForAudit',
                        name: 'gridpanel-passedBillListForAudit',
                        billStatus: 'rdyck3',
                        selectionchangeEvent: function (selModel, sels, opts) {
                            var rec = sels[0],
                                resourceObj = me.getRes();
                            if (rec) {
                                resourceObj.billList.getSelectionModel().deselectAll();
                                resourceObj.paidBillList.getSelectionModel().deselectAll();
                            }
                            resourceObj.billDetailCt.initBtn();
                            resourceObj.billDetailCt.bill = rec;
                            resourceObj.billDetailCt.refresh(rec);
                        }
                    },
                    {
                        title: '待会计审核',
                        style: {
                            borderRightStyle: 'solid',
                            borderRightWidth: '1px'
                        },
                        xtype: 'billaudit-billlist',
                        id: 'gridpanel-paidBillListForAudit',
                        name: 'gridpanel-paidBillListForAudit',
                        billStatus: 'rdyck4',
                        selectionchangeEvent: function (selModel, sels, opts) {
                            var rec = sels[0],
                                resourceObj = me.getRes();
                            if (rec) {
                                resourceObj.billList.getSelectionModel().deselectAll();
                                resourceObj.passedBillList.getSelectionModel().deselectAll();
                            }
                            resourceObj.billDetailCt.initBtn();
                            resourceObj.billDetailCt.bill = rec;
                            resourceObj.billDetailCt.refresh(rec);
                        }
                    }
                ]
            },
            {
                xtype: 'manuallycheckbill-billtable',
                id: 'billtable-billDetailForAudit',
                name: 'billtable-billDetailForAudit',
                flex: 2,
                title: '单据细目',
                header: true,
                height: '100%',
                isPreview: true,
                isAudit: true,
                getButtons: function () {
                    var panel = this;
                    return {
                        returnBill: panel.query('[name="returnBill"]')[0],
                        auditPass: panel.query('[name="auditPass"]')[0],
                        financialPayment: panel.query('[name="financialPayment"]')[0],
                        printBill: panel.query('[name="printBill"]')[0],
                        previewBill: panel.query('[name="previewBill"]')[0],
                        billRecords: panel.query('[name="billRecords"]')[0]
                    };
                },
                initBtn: function () {
                    var resourceObj = me.getRes(),
                        btns = this.getButtons();
                    for (var btnKey in btns) {
                        if (btns.hasOwnProperty(btnKey)) {
                            var btnEl = btns[btnKey];
                            if (btnKey == 'financialPayment') {
                                if (resourceObj.passedBill) {
                                    btnEl.enable();
                                }
                                else if (resourceObj.paidBill || resourceObj.bill) {
                                    btnEl.disable();
                                }
                                else {
                                    btnEl.disable();
                                }
                            }
                            else if (btnKey == 'returnBill' || btnKey == 'auditPass') {
                                if (resourceObj.bill || resourceObj.passedBill || resourceObj.paidBill) {
                                    btnEl.enable();
                                }
                                else {
                                    btnEl.disable();
                                }
                            }
                            else if (btnKey == 'printBill' || btnKey == 'previewBill' || btnKey == 'billRecords') {
                                btnEl.setDisabled(!resourceObj.bill && !resourceObj.passedBill && !resourceObj.paidBill);
                            }
                        }
                    }
                },
                tbar: [
                    {
                        text: '退回单据',
                        disabled: true,
                        name: 'returnBill',
                        icon: 'resources/img/returnBill.png',
                        handler: function () {
                            var resourceObj = me.getRes(),
                                bill = resourceObj.bill || resourceObj.passedBill || resourceObj.paidBill;
                            if (bill) {
                                Ext.Msg.prompt('退单原因', '请输入退单原因', function (btnId, txt) {
                                    if (btnId == 'ok') {
                                        function request(validateCode) {
                                            var params = {
                                                id: bill.getId(),
                                                status: '-1',
                                                comments: txt
                                            },
                                                arr = ['id'];
                                            if (validateCode) {
                                                Ext.apply(params, {
                                                    validateCode: validateCode
                                                });
                                                arr.push('validateCode');
                                            }
                                            ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
                                                Ext.Msg.success('账单已退回!');
                                                if (status == 'rdyck2') {

                                                }
                                                // billList.getSelectionModel().deselectAll();
                                                resourceObj.billList.getStore().reload();
                                                resourceObj.passedBillList.getStore().reload();
                                                resourceObj.paidBillList.getStore().reload();
                                            }, true);
                                        }
                                        ajaxGet('StatementBill', 'getLimit', {
                                            id: bill.getId()
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
                                }, window, false);
                            }
                            else {
                                showMsg('请选择要退回的账单！');
                            }
                        }
                    },
                    {
                        text: '审核通过',
                        disabled: true,
                        name: 'auditPass',
                        icon: 'resources/img/auditPass.png',
                        handler: function () {
                            var resourceObj = me.getRes(),
                                bill = resourceObj.bill || resourceObj.passedBill || resourceObj.paidBill;
                            if (bill) {
                                Ext.Msg.warning('确定要将当前账单置为通过吗？', function (btnId) {
                                    if (btnId == 'yes') {
                                        function request(validateCode) {
                                            var params = {
                                                id: bill.getId(),
                                                status: '+1',
                                                comments: bill.get('billName') + '置为通过'
                                            },
                                            arr = ['id'];
                                            if (validateCode) {
                                                Ext.apply(params, {
                                                    validateCode: validateCode
                                                });
                                                arr.push('validateCode');
                                            }
                                            ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
                                                Ext.Msg.success('账单审核通过!');
                                                // resourceObj.billList.getSelectionModel().deselectAll();
                                                resourceObj.billList.getStore().reload();
                                                resourceObj.passedBillList.getStore().reload();
                                                resourceObj.paidBillList.getStore().reload();
                                            }, true);
                                        }
                                        ajaxGet('StatementBill', 'getLimit', {
                                            id: bill.getId()
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
                                showMsg('请选择账单！');
                            }
                        }
                    },
                    {
                        text: '财务付款',
                        disabled: true,
                        name: 'financialPayment',
                        icon: 'resources/img/pay.png',
                        hidden: true,
                        handler: function () {
                            Ext.Msg.warning('确定要进行财务付款吗？', function (btnId) {
                                var resourceObj = me.getRes();
                                if (resourceObj.passedBill) {
                                    if ('yes' == btnId) {
                                        ajaxGet('StatementBill', 'getLimit', {
                                            id: resourceObj.passedBill.getId()
                                        }, function (obj) {
                                            if (obj.type == 'checked') {
                                                showMsg(obj.hint);
                                                ajaxUpdate('StatementBill.changeStatus', {
                                                    status: '+1',
                                                    id: resourceObj.passedBill.getId(),
                                                    comments: resourceObj.passedBill.get('billName') + '已付款',
                                                }, ['id'], function (obj) {
                                                    Ext.Msg.success('已付款！');
                                                    resourceObj.billList.getSelectionModel().deselectAll();
                                                    resourceObj.billList.getStore().reload();
                                                    resourceObj.passedBillList.getStore().reload();
                                                    resourceObj.passedBillList.getSelectionModel().deselectAll();
                                                    resourceObj.paidBillList.getSelectionModel().deselectAll();
                                                    resourceObj.paidBillList.getStore().reload();
                                                }, true);
                                            }
                                            else {
                                                Ext.defer(function () {
                                                    Ext.Msg.password(obj.hint, function (val) {
                                                        if (obj.type == 'sms') {
                                                        }
                                                        else if (obj.type == 'securePass') {
                                                            val = md5(_PWDPREFIX + val);
                                                        }
                                                        ajaxUpdate('StatementBill.changeStatus', {
                                                            status: '+1',
                                                            id: resourceObj.passedBill.getId(),
                                                            comments: resourceObj.passedBill.get('billName') + '已付款',
                                                            validateCode: val
                                                        }, ['id', 'validateCode'], function (obj) {
                                                            Ext.Msg.success('已付款！');
                                                            resourceObj.billList.getSelectionModel().deselectAll();
                                                            resourceObj.billList.getStore().reload();
                                                            resourceObj.passedBillList.getStore().reload();
                                                            resourceObj.passedBillList.getSelectionModel().deselectAll();
                                                        }, true);
                                                    });
                                                }, 500);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    },
                    {
                        text: '预览单据',
                        name: 'previewBill',
                        disabled: true,
                        icon: 'resources/img/preview.png',
                        handler: function () {
                            var resourceObj = me.getRes(),
                                bill = resourceObj.bill || resourceObj.passedBill || resourceObj.paidBill;
                            if (bill) {
                                var win = window.open('./fpdf/statement_bill.php?id=' + bill.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                            }
                            else {
                                showMsg('没有账单！');
                            }
                        }
                    },
                    {
                        text: '打印单据',
                        name: 'printBill',
                        disabled: true,
                        icon: 'resources/img/print_finance.png',
                        handler: function () {
                            var resourceObj = me.getRes(),
                                bill = resourceObj.bill || resourceObj.passedBill || resourceObj.paidBill;
                            if (bill) {
                                var win = window.open('./fpdf/statement_bill.php?id=' + bill.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                win.print();
                            }
                            else {
                                showMsg('没有账单！');
                            }
                        }
                    },
                    {
                        text: '账单记录',
                        name: 'billRecords',
                        disabled: true,
                        icon: 'resources/img/bill_history.png',
                        handler: function () {
                            var resourceObj = me.getRes(),
                                bill = resourceObj.bill || resourceObj.passedBill || resourceObj.paidBill;
                            if (bill) {
                                var win = Ext.create('FamilyDecoration.view.manuallycheckbill.BillRecord', {
                                    bill: bill
                                });
                                win.show();
                            }
                            else {
                                showMsg('没有账单！');
                            }
                        }
                    }
                ]
            }
        ];

        this.callParent();
    }
});