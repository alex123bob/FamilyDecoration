Ext.define('FamilyDecoration.view.entrynexit.ReceivementLoan', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-receivementloan',
    title: '贷款',

    requires: [
        'FamilyDecoration.store.Account',
        'FamilyDecoration.view.checklog.MemberList'
    ],

    layout: 'vbox',
    width: 500,
    height: 420,
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
                        name: 'bank',
                        fieldLabel: '银行',
                        margin: '4 8 0 0',
                        width: 200,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        name: 'operator',
                        readOnly: true,
                        fieldLabel: '交办人',
                        margin: '4 0 0 0',
                        width: 200,
                        allowBlank: false,
                        listeners: {
                            focus: function (txt, ev, opts){
                                var win = Ext.create('Ext.window.Window', {
                                    width: 400,
                                    height: 300,
                                    layout: 'fit',
                                    modal: true,
                                    title: '选择人员',
                                    items: [
                                        {
                                            xtype: 'checklog-memberlist'
                                        }
                                    ],
                                    buttons: [
                                        {
                                            text: '确定',
                                            handler: function (){
                                                var fst = me.getComponent('fieldset-headerInfo'),
                                                    operatorName = fst.down('[name="operatorName"]'),
                                                    contact = fst.down('[name="contact"]'),
                                                    tree = win.down('treepanel'),
                                                    selModel = tree.getSelectionModel(),
                                                    rec = selModel.getSelection()[0];
                                                if (rec.get('name')){
                                                    txt.setValue(rec.get('realname'));
                                                    operatorName.setValue(rec.get('name'));
                                                    contact.setValue(rec.get('phone'));
                                                    win.close();
                                                }
                                                else {
                                                    showMsg('请选择人员！');
                                                }
                                            }
                                        },
                                        {
                                            text: '取消',
                                            handler: function (){
                                                win.close();
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'operatorName'
                    },
                    {
                        xtype: 'textfield',
                        name: 'contact',
                        fieldLabel: '联系方式',
                        margin: '4 8 0 0',
                        width: 200,
                        readOnly: true,
                        allowBlank: false
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '选项',
                width: '100%',
                flex: 2,
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
                        itemId: 'datefield-loanTime',
                        fieldLabel: '贷款时间',
                        xtype: 'datefield',
                        editable: false,
                        allowBlank: false,
                        submitFormat: 'Y-m-d H:i:s'
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
                        itemId: 'textfield-loanPeriod',
                        xtype: 'textfield',
                        fieldLabel: '贷款期限',
                        allowBlank: false
                    },
                    {
                        itemId: 'textfield-receiveRemark',
                        fieldLabel: '收款备注',
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    {
                        itemId: 'textfield-loanInterestRate',
                        fieldLabel: '贷款利率',
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
                        bank = headerFst.down('[name="bank"]'),
                        operator = headerFst.down('[name="operator"]'),
                        operatorName = headerFst.down('[name="operatorName"]'),
                        contact = headerFst.down('[name="contact"]'),
                        fst = me.query('fieldset')[1],
                        fee = fst.getComponent('numberfield-receiveFee'),
                        loanTime = fst.getComponent('datefield-loanTime'),
                        account = fst.getComponent('combobox-receiveAccount'),
                        loanPeriod = fst.getComponent('textfield-loanPeriod'),
                        receiveRemark = fst.getComponent('textfield-receiveRemark'),
                        loanInterestRate = fst.getComponent('textfield-loanInterestRate'),
                        accountVal = account.getValue(),
                        accountRec = account.findRecord(account.valueField || account.displayField, accountVal);

                    if (projectName.isValid() && bank.isValid() && operator.isValid() && contact.isValid() && fee.isValid() 
                        && loanTime.isValid() && account.isValid() && loanPeriod.isValid() && receiveRemark.isValid() 
                        && loanInterestRate.isValid()) {
                        ajaxAdd('Account.receipt', {
                            billType: 'loan',
                            projectName: projectName.getValue(),
                            bankName: bank.getValue(),
                            assignee: operatorName.getValue(),
                            receiveAmount: fee.getValue(),
                            loanTime: loanTime.getSubmitValue(),
                            accountId: accountRec.getId(),
                            descpt: receiveRemark.getValue(),
                            period: loanPeriod.getValue(),
                            interest: loanInterestRate.getValue()
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