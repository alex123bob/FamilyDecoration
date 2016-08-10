Ext.define('FamilyDecoration.view.entrynexit.ReceivementOther', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-receivementother',
    title: '其他收入',

    requires: [
        'FamilyDecoration.store.Account'
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
                        name: 'projectName',
                        fieldLabel: '项目名称',
                        width: 400,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'payUnit',
                        fieldLabel: '交款单位',
                        margin: '4 8 0 0',
                        width: 200,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'payer',
                        fieldLabel: '交款人',
                        margin: '4 0 0 0',
                        width: 200,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'contact',
                        fieldLabel: '联系方式',
                        margin: '4 8 0 0',
                        width: 200,
                        allowBlank: false
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '选项',
                width: '100%',
                flex: 1.3,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                autoScroll: true,
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
                    },
                    {
                        itemId: 'textfield-receiveRemark',
                        fieldLabel: '收款备注',
                        xtype: 'textfield',
                        allowBlank: false
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var headerFst = me.getComponent('fieldset-headerInfo'),
                        projectName = headerFst.down('[name="projectName"]'),
                        payUnit = headerFst.down('[name="payUnit"]'),
                        payer = headerFst.down('[name="payer"]'),
                        contact = headerFst.down('[name="contact"]'),
                        fst = me.query('fieldset')[1],
                        fee = fst.getComponent('numberfield-receiveFee'),
                        receiveWay = fst.getComponent('combobox-receiveWay'),
                        account = fst.getComponent('combobox-receiveAccount'),
                        receiveRemark = fst.getComponent('textfield-receiveRemark'),
                        accountVal = account.getValue(),
                        accountRec = account.findRecord(account.valueField || account.displayField, accountVal);

                    if (projectName.isValid() && payUnit.isValid() && payer.isValid() && contact.isValid() && fee.isValid() && receiveWay.isValid() && account.isValid() && receiveRemark.isValid()) {
                        ajaxAdd('Account.receipt', {
                            billType: 'dsdpst',
                            businessId: businessId.getValue(),
                            receiver: User.getName(),
                            accountId: accountRec.getId(),
                            receiveAmount: fee.getValue(),
                            receiveWay: receiveWay.getValue(),
                            receiveRemark: receiveRemark.getValue()
                        }, function (obj) {
                            if (obj.status == 'successful') {
                                showMsg('付款成功！');
                                me.callback();
                                me.close();
                            }
                        }, Ext.emptyFn, true);
                    }
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