Ext.define('FamilyDecoration.view.entrynexit.ReceivementDepositIn', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-receivementdepositin',
    title: '保证金入账',

    requires: [
        'FamilyDecoration.store.Account',
        'FamilyDecoration.store.StatementBill'
    ],

    layout: 'vbox',
    width: 1000,
    height: 600,
    modal: true,
    bodyPadding: 5,
    // maximized: true,

    category: undefined,
    item: undefined,

    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this,
            depositOutSt = Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
                proxy: {
                    url: 'libs/api.php',
                    type: 'rest',
                    reader: {
                        type: 'json',
                        root: 'data',
                        totalProperty: 'total'
                    },
                    extraParams: {
                        action: 'EntryNExit.get',
                        type: 'depositOut'
                    }
                }
            });
        me.items = [
            {
                xtype: 'fieldset',
                flex: 3,
                width: '100%',
                title: '保证金（出账）',
                itemId: 'fieldset-depositOut',
                layout: 'fit',
                items: [
                    {
                        xtype: 'gridpanel',
                        cls: 'gridpanel-depositOutList',
                        store: depositOutSt,
                        // selModel: {
                        //     mode: 'SIMPLE'
                        // },
                        selType: 'checkboxmodel',
                        columns: {
                            defaults: {
                            },
                            items: [
                                {
                                    text: '单号',
                                    dataIndex: 'c0',
                                    flex: 1
                                },
                                {
                                    text: '工程名称',
                                    dataIndex: 'c1',
                                    flex: 1
                                },
                                {
                                    text: '保证金金额',
                                    dataIndex: 'c2',
                                    flex: 1
                                },
                                {
                                    text: '领款人',
                                    dataIndex: 'c3',
                                    flex: 1
                                },
                                {
                                    text: '申请人',
                                    dataIndex: 'c4',
                                    flex: 1
                                },
                                {
                                    text: '付款时间',
                                    dataIndex: 'c5',
                                    flex: 1
                                },
                                {
                                    text: '联系人',
                                    dataIndex: 'c6',
                                    flex: 1
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c7',
                                    flex: 1
                                },
                                {
                                    text: '状态',
                                    dataIndex: 'status',
                                    flex: 1,
                                    renderer: function (val) {
                                        var res = '';
                                        switch (val) {
                                            case 'chk':
                                                res = '已审核';
                                                break;
                                            case 'paid':
                                                res = '已付款';
                                                break;
                                            case 'arch':
                                                res = '已归档';
                                                break;
                                            default:
                                                break;
                                        }
                                        return res;
                                    }
                                }
                            ]
                        },
                        dockedItems: [{
                            dock: 'top',
                            xtype: 'toolbar',
                            items: [{
                                xtype: 'searchfield',
                                flex: 1,
                                store: depositOutSt,
                                paramName: 'c1'
                            }]
                        }]
                    }
                ]
            },
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
                        width: 300,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'payer',
                        fieldLabel: '交款人',
                        // readOnly: true,
                        margin: '4 0 0 0',
                        width: 200,
                        allowBlank: false,
                        // listeners: {
                        //     focus: function (txt, ev, opts) {
                        //         var win = Ext.create('Ext.window.Window', {
                        //             width: 400,
                        //             height: 300,
                        //             layout: 'fit',
                        //             modal: true,
                        //             title: '选择人员',
                        //             items: [
                        //                 {
                        //                     xtype: 'checklog-memberlist'
                        //                 }
                        //             ],
                        //             buttons: [
                        //                 {
                        //                     text: '确定',
                        //                     handler: function () {
                        //                         var fst = me.getComponent('fieldset-headerInfo'),
                        //                             payerName = fst.down('[name="payerName"]'),
                        //                             contact = fst.down('[name="contact"]'),
                        //                             tree = win.down('treepanel'),
                        //                             selModel = tree.getSelectionModel(),
                        //                             rec = selModel.getSelection()[0];
                        //                         if (rec.get('name')) {
                        //                             txt.setValue(rec.get('realname'));
                        //                             payerName.setValue(rec.get('name'));
                        //                             contact.setValue(rec.get('phone'));
                        //                             win.close();
                        //                         }
                        //                         else {
                        //                             showMsg('请选择人员！');
                        //                         }
                        //                     }
                        //                 },
                        //                 {
                        //                     text: '取消',
                        //                     handler: function () {
                        //                         win.close();
                        //                     }
                        //                 }
                        //             ]
                        //         });
                        //         win.show();
                        //     }
                        // }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'payerName'
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
                itemId: 'fieldset-options',
                title: '选项',
                width: '100%',
                flex: 1.8,
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
                    var depositOutFst = me.getComponent('fieldset-depositOut'),
                        depositOutGrid = depositOutFst.down('gridpanel'),
                        depositOutItem = depositOutGrid.getSelectionModel().getSelection(),
                        headerFst = me.getComponent('fieldset-headerInfo'),
                        projectName = headerFst.down('[name="projectName"]'),
                        payUnit = headerFst.down('[name="payUnit"]'),
                        payer = headerFst.down('[name="payer"]'),
                        payerName = headerFst.down('[name="payerName"]'),
                        contact = headerFst.down('[name="contact"]'),
                        fst = me.getComponent('fieldset-options'),
                        fee = fst.getComponent('numberfield-receiveFee'),
                        receiveWay = fst.getComponent('combobox-receiveWay'),
                        account = fst.getComponent('combobox-receiveAccount'),
                        receiveRemark = fst.getComponent('textfield-receiveRemark'),
                        accountVal = account.getValue(),
                        accountRec = account.findRecord(account.valueField || account.displayField, accountVal);

                    if (depositOutItem.length > 1 || depositOutItem.length === 0) {
                        Ext.Msg.error('关联保证金必须也只能选择一项!');
                        return;
                    }

                    if (projectName.isValid() && payUnit.isValid() && payer.isValid() && contact.isValid() && fee.isValid() && receiveWay.isValid() && account.isValid() && receiveRemark.isValid()) {
                        ajaxAdd('Account.receipt', {
                            id: depositOutItem[0].get('c0'),
                            projectName: projectName.getValue(),
                            billType: 'depositIn',
                            reimbursementReason: payUnit.getValue(),
                            payee: payer.getValue(),
                            accountId: accountRec.getId(),
                            receiveAmount: fee.getValue(),
                            receiveWay: receiveWay.getValue(),
                            descpt: receiveRemark.getValue()
                        }, function (obj) {
                            if (obj.status == 'successful') {
                                showMsg('收款成功！');
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