Ext.define('FamilyDecoration.view.billaudit.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.billaudit-index',
    requires: [
        'FamilyDecoration.store.WorkCategory',
        'FamilyDecoration.view.manuallycheckbill.BillTable',
        'FamilyDecoration.store.StatementBill',
        'Ext.ux.form.SearchField',
        'FamilyDecoration.view.billaudit.BillList'
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
                billDetailCt = Ext.getCmp('billtable-billDetailForAudit');
                
            return {
                billList: billList,
                bill: bill,
                passedBillList: passedBillList,
                passedBill: passedBill,
                billDetailCt: billDetailCt
            }
        };

        me.items = [
            {
                xtype: 'container',
                flex: 1,
                layout: 'vbox',
                height: '100%',
                items: [
                    {
                        title: '待审核账单',
                        style: {
                            borderRightStyle: 'solid',
                            borderRightWidth: '1px'
                        },
                        xtype: 'billaudit-billlist',
                        id: 'gridpanel-billListForAudit',
                        name: 'gridpanel-billListForAudit',
                        flex: 2,
                        width: '100%',
                        selectionchangeEvent: function (selModel, sels, opts){
                            var rec = sels[0],
                                    resourceObj = me.getRes();
                                resourceObj.billDetailCt.initBtn();
                                resourceObj.billDetailCt.bill = rec;
                                resourceObj.billDetailCt.refresh(rec);
                                resourceObj.passedBillList.getSelectionModel().deselectAll();
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
                        flex: 1,
                        width: '100%',
                        isPassedBillList: true,
                        selectionchangeEvent: function (selModel, sels, opts){
                            var rec = sels[0],
                                    resourceObj = me.getRes();
                                resourceObj.billDetailCt.initBtn();
                                resourceObj.billDetailCt.bill = rec;
                                resourceObj.billDetailCt.refresh(rec);
                                resourceObj.billList.getSelectionModel().deselectAll();
                        }
                    }
                ]
            },
            {
                xtype: 'manuallycheckbill-billtable',
                id: 'billtable-billDetailForAudit',
                name: 'billtable-billDetailForAudit',
                flex: 5,
                title: '单据细目',
                header: true,
                height: '100%',
                isPreview: true,
                isAudit: true,
                getButtons: function (){
                    var panel = this;
					return {
						returnBill: panel.query('[name="returnBill"]')[0],
                        auditPass: panel.query('[name="auditPass"]')[0],
                        financialPayment: panel.query('[name="financialPayment"]')[0]
					};
                },
                initBtn: function (){
                    var resourceObj = me.getRes(),
                        btns = this.getButtons();
                    for (var btnKey in btns) {
                        if (btns.hasOwnProperty(btnKey)) {
                            var btnEl = btns[btnKey];
                            btnEl.setDisabled(!resourceObj.bill);
                        }
                    }
                },
                tbar: [
                    {
                        text: '退回单据',
                        disabled: true,
                        name: 'returnBill',
                        icon: 'resources/img/returnBill.png',
                        handler: function (){
                            
                        }
                    },
                    {
                        text: '审核通过',
                        disabled: true,
                        name: 'auditPass',
                        icon: 'resources/img/auditPass.png',
                        handler: function (){
                            
                        }
                    },
                    {
                        text: '财务付款',
                        disabled: true,
                        name: 'financialPayment',
                        icon: 'resources/img/pay.png',
                        handler: function (){
                            
                        }
                    }
                ]
            }
        ];

        this.callParent();
    }
});