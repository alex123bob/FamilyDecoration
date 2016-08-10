Ext.define('FamilyDecoration.view.entrynexit.ReceivementProjectFee', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-receivementprojectfee',
    title: '工程款',

    requires: [
        'FamilyDecoration.store.Account',
        'FamilyDecoration.view.entrynexit.ProjectList'
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
                        allowBlank: false,
                        width: 400,
                        listeners: {
                            focus: function (txt, ev, opts) {
                                var win = Ext.create('FamilyDecoration.view.entrynexit.ProjectList', {
                                    callback: function (project) {
                                        var fst = me.getComponent('fieldset-headerInfo'),
                                            salesmanField = fst.down('[name="captain"]'),
                                            designerField = fst.down('[name="designer"]'),
                                            customerField = fst.down('[name="customer"]'),
                                            contactField = fst.down('[name="contact"]'),
                                            projectIdField = fst.down('[name="projectId"]'),
                                            businessId = project.get('businessId');
                                        txt.setValue(project.get('projectName'));
                                        salesmanField.setValue(project.get('captain'));
                                        designerField.setValue(project.get('designer'));
                                        if (businessId) {
                                            Ext.Ajax.request({
                                                url: './libs/business.php',
                                                params: {
                                                    action: 'getBusinessById',
                                                    businessId: businessId
                                                },
                                                method: 'GET',
                                                callback: function (opts, success, res) {
                                                    if (success) {
                                                        var obj = Ext.decode(res.responseText);
                                                        obj = obj[0];
                                                        if (obj) {
                                                            customerField.setValue(obj['customer']);
                                                            contactField.setValue(obj['custContact']);
                                                        }
                                                        else {
                                                            customerField.setValue('');
                                                            contactField.setValue('');
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            customerField.setValue('');
                                            contactField.setValue('');
                                        }
                                        projectIdField.setValue(project.getId());
                                    }
                                });
                                win.show();
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'captain',
                        fieldLabel: '项目经理',
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
                        name: 'projectId'
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
                        itemId: 'combobox-instalment',
                        fieldLabel: '第几期',
                        xtype: 'combobox',
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
                                    name: '首期',
                                    value: 'first'
                                },
                                {
                                    name: '二期',
                                    value: 'second'
                                },
                                {
                                    name: '三期',
                                    value: 'third'
                                },
                                {
                                    name: '尾期',
                                    value: 'fourth'
                                }
                            ]
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
                        projectName = headerFst.down('[name="projectName"]'),
                        projectId = headerFst.down('[name="projectId"]'),
                        fst = me.query('fieldset')[1],
                        fee = fst.getComponent('numberfield-receiveFee'),
                        receiveWay = fst.getComponent('combobox-receiveWay'),
                        account = fst.getComponent('combobox-receiveAccount'),
                        instalment = fst.getComponent('combobox-instalment'),
                        accountVal = account.getValue(),
                        accountRec = account.findRecord(account.valueField || account.displayField, accountVal);

                    if (projectName.isValid() && fee.isValid() && receiveWay.isValid() && account.isValid() && instalment.isValid()) {
                        ajaxAdd('Account.receipt', {
                            billType: 'pjtf',
                            projectId: projectId.getValue(),
                            receiver: User.getName(),
                            accountId: accountRec.getId(),
                            receiveAmount: fee.getValue(),
                            receiveWay: receiveWay.getValue(),
                            reimbursementReason: instalment.getRawValue()
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