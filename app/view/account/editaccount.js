Ext.define('FamilyDecoration.view.account.EditAccount', {
    extend: 'Ext.window.Window',
    alias: 'widget.account-editaccount',
    requires: [
        'FamilyDecoration.store.Account'
    ],

    // resizable: false,
    modal: true,
    layout: 'form',
    maximizable: true,
    defaultType: 'textfield',

    title: '编辑账号',
    width: 520,
    height: 250,
    autoScroll: true,
    defaults: {
        allowBlank: false
    },
    bodyPadding: 5,
    account: undefined,
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        function _getRes() {
            var accountName = me.getComponent('textfield-accountName'),
                accountType = me.getComponent('combobox-accountType'),
                accountBalance = me.getComponent('textfield-accountBalance'),
                accountDesc = me.getComponent('textarea-accountDesc');
            return {
                accountName: accountName,
                accountType: accountType,
                accountBalance: accountBalance,
                accountDesc: accountDesc
            };
        }

        me.title = me.account ? '编辑账户' : '添加账户';

        me.items = [
            {
                fieldLabel: '账户名称',
                name: 'name',
                itemId: 'textfield-accountName',
                value: me.account ? me.account.get('name') : ''
            },
            {
                fieldLabel: '账户类型',
                xtype: 'combobox',
                editable: false,
                disabled: me.account,
                name: 'accountType',
                itemId: 'combobox-accountType',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        { name: 'name', mapping: 'v' },
                        { name: 'value', mapping: 'k' }
                    ],
                    proxy: {
                        url: 'libs/api.php',
                        type: 'rest',
                        reader: {
                            type: 'json'
                        },
                        extraParams: {
                            action: 'Account.getAccountType'
                        }
                    }
                }),
                displayField: 'name',
                valueField: 'value',
                value: me.account ? me.account.get('accountType') : ''
            },
            {
                fieldLabel: '账户余额(元)',
                name: 'balance',
                itemId: 'textfield-accountBalance',
                xtype: 'numberfield',
                value: me.account ? me.account.get('balance') : ''
            },
            {
                fieldLabel: '修改说明',
                hidden: !me.account,
                disabled: !me.account,
                name: 'desc',
                itemId: 'textarea-accountDesc',
                xtype: 'textarea'
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var resObj = _getRes(),
                        params = {};
                    for (var key in resObj) {
                        if (resObj.hasOwnProperty(key)) {
                            var field = resObj[key];
                            if (field.isValid()) {
                                params[field.name] = field.getValue();
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    if (me.account) {
                        delete params.accountType;
                        Ext.apply(params, {
                            id: me.account.getId()
                        });
                        ajaxUpdate('Account', params, ['id'], function (obj){
                            showMsg('编辑成功！');
                            me.callback();
                            me.close();
                        });
                    }
                    else {
                        delete params.desc;
                        ajaxAdd('Account', params, function (obj){
                            showMsg('添加成功！');
                            me.callback();
                            me.close();
                        });
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