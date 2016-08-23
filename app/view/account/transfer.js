Ext.define('FamilyDecoration.view.account.Transfer', {
    extend: 'Ext.window.Window',
    alias: 'widget.account-transfer',
    requires: [
        'FamilyDecoration.store.Account'
    ],

    modal: true,
    layout: 'fit',

    title: '转账',
    width: 520,
    height: 200,
    autoScroll: true,
    bodyPadding: 5,
    fromAccount: undefined,
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        function _getRes() {
            var frm = me.down('form'),
                toAccount = frm.getComponent('combobox-toAccount'),
                transferAmount = frm.getComponent('numberfield-transferAmount')
            return {
                frm: frm,
                toAccount: toAccount,
                transferAmount: transferAmount
            };
        }

        me.items = [
            {
                xtype: 'form',
                defaults: {
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                    {
                        fieldLabel: '目标帐户',
                        editable: false,
                        xtype: 'combobox',
                        itemId: 'combobox-toAccount',
                        valueField: 'id',
                        displayField: 'name',
                        name: 'toAccount',
                        store: Ext.create('FamilyDecoration.store.Account', {
                            autoLoad: true,
                            filters: [
                                function (item){
                                    return item.getId() != me.fromAccount.getId();
                                }
                            ]
                        })
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '转账金额',
                        name: 'amount',
                        itemId: 'numberfield-transferAmount'
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var resObj = _getRes();
                    if (resObj.frm.isValid()) {
                        var obj = resObj.frm.getValues();
                        ajaxUpdate('Account.transfer', {
                            from: me.fromAccount.getId(),
                            to: resObj.toAccount.getSubmitValue(),
                            amount: obj.amount
                        }, ['from', 'to', 'amount'], function (obj){
                            showMsg('转账成功！');
                            me.callback();
                            me.close();
                        }, true);
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ]

        this.callParent();
    }
});