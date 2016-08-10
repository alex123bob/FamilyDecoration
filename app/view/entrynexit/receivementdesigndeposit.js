Ext.define('FamilyDecoration.view.entrynexit.ReceivementDesignDeposit', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-receivement',
    title: '设计定金',

    requires: [
        'FamilyDecoration.store.Account',
        'FamilyDecoration.view.entrynexit.BusinessList'
    ],

    layout: 'vbox',
    width: 500,
    height: 350,
    modal: true,
    bodyPadding: 5,

    category: undefined,
    item: undefined,

    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'fieldset',
                title: '信息',
                itemId: 'fieldset-headerInfo',
                width: '100%',
                flex: 1,
                autoScroll: true,
                defaults: {
                    xtype: 'displayfield',
                    margin: '0 4 0 0',
                    style: {
                        'float': 'left'
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        readOnly: true,
                        name: 'projectName',
                        fieldLabel: '工程名称',
                        width: 400,
                        listeners: {
                            focus: function (txt, ev, opts) {
                                var win = Ext.create('FamilyDecoration.view.entrynexit.BusinessList', {
                                    callback: function (business) {
                                        var fst = me.getComponent('fieldset-headerInfo'),
                                            salesmanField = fst.down('[name="salesman"]'),
                                            designerField = fst.down('[name="designer"]'),
                                            customerField = fst.down('[name="customer"]'),
                                            contactField = fst.down('[name="contact"]'),
                                            businessIdField = fst.down('[name="businessId"]');
                                        txt.setValue(business.get('regionName') + ' ' + business.get('address'));
                                        salesmanField.setValue(business.get('salesman'));
                                        designerField.setValue(business.get('designer'));
                                        customerField.setValue(business.get('customer'));
                                        contactField.setValue(business.get('custContact'));
                                        businessIdField.setValue(business.getId());
                                    }
                                });
                                win.show();
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'salesman',
                        fieldLabel: '业务员',
                        margin: '4 8 0 0',
                        width: 200
                    },
                    {
                        xtype: 'displayfield',
                        name: 'designer',
                        fieldLabel: '设计师',
                        margin: '4 0 0 0',
                        width: 200
                    },
                    {
                        xtype: 'displayfield',
                        name: 'customer',
                        fieldLabel: '客户姓名',
                        margin: '4 8 0 0',
                        width: 200
                    },
                    {
                        xtype: 'displayfield',
                        name: 'contact',
                        fieldLabel: '联系方式',
                        margin: '4 0 0 0',
                        width: 200
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'businessId'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '选项',
                width: '100%',
                flex: 1,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        itemId: 'numberfield-receiveFee',
                        fieldLabel: '收款额',
                        xtype: 'numberfield',
                        allowBlank: false
                    },
                    {
                        itemId: 'combobox-receiveWay',
                        xtype: 'combobox',
                        fieldLabel: '收款方式',
                        editable: false,
                        displayField: 'name',
                        valueField: 'value',
                        allowBlank: false,
                        queryMode: 'local',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            proxy: {
                                type: 'memory',
                                reader: {
                                    type: 'json'
                                }
                            },
                            data: [
                                {
                                    name: '现金',
                                    value: 'cash'
                                },
                                {
                                    name: '刷卡',
                                    value: 'bankcard'
                                },
                                {
                                    name: '转账',
                                    value: 'transference'
                                }
                            ]
                        })
                    },
                    {
                        itemId: 'combobox-receiveAccount',
                        fieldLabel: '收款账户',
                        xtype: 'combobox',
                        editable: false,
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        store: Ext.create('FamilyDecoration.store.Account', {
                            autoLoad: true,
                            listeners: {
                                load: function (st, recs, success, opts) {
                                    Ext.each(recs, function (rec, index, arr) {
                                        rec.set({
                                            name: rec.get('name') + ' (余额: ' + rec.get('balance') + ')'
                                        });
                                    });
                                }
                            }
                        })
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var headerFst = me.getComponent('fieldset-headerInfo'),
                        businessId = headerFst.down('[name="businessId"]'),
                        fst = me.query('fieldset')[1],
                        fee = fst.getComponent('numberfield-receiveFee'),
                        receiveWay = fst.getComponent('combobox-receiveWay'),
                        account = fst.getComponent('combobox-receiveAccount'),
                        accountVal = account.getValue(),
                        accountRec = account.findRecord(account.valueField || account.displayField, accountVal);

                    ajaxAdd('Account.receipt', {
                        billType: 'dsdpst',
                        businessId: businessId.getValue(),
                        receiver: User.getName(),
                        accountId: accountRec.getId(),
                        receiveAmount: fee.getValue(),
                        receiveWay: receiveWay.getValue()
                    }, function (obj) {
                        if (obj.status == 'successful') {
                            showMsg('付款成功！');
                            me.callback();
                            me.close();
                        }
                    }, Ext.emptyFn, true);
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});