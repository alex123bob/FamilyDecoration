Ext.define('FamilyDecoration.view.entrynexit.Payment', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-payment',
    title: '付款',

    requires: [
        'FamilyDecoration.store.Account'
    ],

    layout: 'vbox',
    width: 500,
    height: 350,
    modal: true,
    maximizable: true,
    bodyPadding: 5,

    category: undefined,
    item: undefined,

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
                items: []
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
                        itemId: 'numberfield-payFee',
                        fieldLabel: '付款金额(元)',
                        xtype: 'numberfield',
                        allowBlank: false
                    },
                    {
                        itemId: 'combobox-payAccount',
                        fieldLabel: '付款账户',
                        xtype: 'combobox',
                        editable: false,
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        store: Ext.create('FamilyDecoration.store.Account', {
                            autoLoad: true
                        })
                    },
                    {
                        itemId: 'combobox-removeBalance',
                        fieldLabel: '抹平余额',
                        xtype: 'combobox',
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        editable: false,
                        value: false,
                        hidden: !(me.category.get('name') == 'workerSalary' || me.category.get('name') == 'qualityGuaranteeDeposit'),
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
                                    name: '是',
                                    value: true
                                },
                                {
                                    name: '否',
                                    value: false
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
                    var fst = me.query('fieldset')[1],
                        fee = fst.getComponent('numberfield-payFee'),
                        account = fst.getComponent('combobox-payAccount'),
                        enoughBalance = true,
                        accountVal = account.getValue(),
                        accountRec = account.findRecord(account.valueField || account.displayField, accountVal);

                    if (fee.isValid() && account.isValid()) {
                        enoughBalance = (fee.getValue() * 1000 - parseInt(accountRec.get('balance'), 10) <= 0) ? true : false;
                        if (enoughBalance) {
                            ajaxUpdate('Account.pay', {
                                id: me.item.get('c0'),
                                type: me.category.get('name'),
                                accountId: accountRec.getId(),
                                fee: fee.getValue()
                            }, ['id', 'accountId', 'type'], function (obj){
                                if (obj.status == 'successful') {
                                    showMsg('付款成功！');
                                    me.close();
                                }
                            }, true)
                        }
                        else {
                            Ext.Msg.error('没有足够余额!');
                        }
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

        this.addListener({
            show: function (win, opts) {
                var headerSet = me.getComponent('fieldset-headerInfo');
                ajaxGet('EntryNExit', 'getPayHeader', {
                    id: me.item.get('c0'),
                    type: me.category.get('name')
                }, function (obj) {
                    if (obj.length > 0) {
                        Ext.each(obj, function (item, index, arr) {
                            arr[index] = {
                                fieldLabel: item['k'],
                                value: item['v'],
                                width: 200
                            }
                        });
                        headerSet.add(obj);
                    }
                    else {
                        headerSet.removeAll();
                    }
                });
            }
        })

        this.callParent();
    }
});