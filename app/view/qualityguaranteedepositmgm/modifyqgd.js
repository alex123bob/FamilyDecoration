Ext.define('FamilyDecoration.view.qualityguaranteedepositmgm.ModifyQgd', {
    extend: 'Ext.window.Window',
    alias: 'widget.qualityguaranteedepositmgm-modifyqgd',
    requires: [

    ],
    modal: true,
    title: '调整质保金',
    width: 500,
    height: 390,
    bodyPadding: 5,
    layout: 'vbox',
    defaults: {
        width: '100%',
        xtype: 'textfield'
    },

    qgd: undefined,
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        function _getRes() {
            return {
                qgd: me.getComponent('numberfield-modifyQgd'),
                descpt: me.getComponent('textarea-modifyReason'),
                deadline: me.getComponent('datefield-modifyDeadline')
            };
        }

        me.items = [
            {
                xtype: 'fieldcontainer',
                itemId: 'fieldcontainer-headerInfo',
                autoScroll: true,
                defaults: {
                    xtype: 'displayfield',
                    margin: '0 8 0 0',
                    width: 230,
                    style: {
                        'float': 'left'
                    }
                },
                flex: 1,
                items: [
                    {
                        fieldLabel: '单据名称',
                        name: 'billName',
                        value: me.qgd ? me.qgd.get('billName') : ''
                    },
                    {
                        fieldLabel: '领款人',
                        name: 'payee',
                        value: me.qgd ? me.qgd.get('payee') : ''
                    },
                    {
                        fieldLabel: '工程地址',
                        name: 'projectName',
                        value: me.qgd ? me.qgd.get('projectName') : ''
                    },
                    {
                        fieldLabel: '联系电话',
                        name: 'phoneNumber',
                        value: me.qgd ? me.qgd.get('phoneNumber') : ''
                    },
                    {
                        fieldLabel: '总金额',
                        name: 'total',
                        value: me.qgd ? me.qgd.get('total') : ''
                    },
                    {
                        fieldLabel: '已付金额',
                        name: 'paid',
                        value: me.qgd ? me.qgd.get('paid') : ''
                    },
                    {
                        fieldLabel: '原质保金',
                        name: 'qgd',
                        value: me.qgd ? me.qgd.get('qgd') : ''
                    },
                    {
                        fieldLabel: '调整后质保金',
                        name: 'totalFee',
                        value: me.qgd ? me.qgd.get('totalFee') : ''
                    },
                    {
                        fieldLabel: '质保金期限',
                        name: 'deadline',
                        value: me.qgd ? me.qgd.get('deadline') : ''
                    }
                ]
            },
            {
                xtype: 'numberfield',
                itemId: 'numberfield-modifyQgd',
                fieldLabel: '调整质保金',
                height: 28,
                allowBlank: false,
                value: me.qgd ? me.qgd.get('totalFee') || me.qgd.get('qgd') : ''
            },
            {
                itemId: 'datefield-modifyDeadline',
                xtype: 'datefield',
                fieldLabel: '调整期限',
                height: 25,
                allowBlank: false,
                editable: false,
                submitFormat: 'Y-m-d',
                format: 'Y-m-d',
                value: me.qgd && me.qgd.get('deadline') ?  new Date(me.qgd.get('deadline')) : ''
            },
            {
                itemId: 'textarea-modifyReason',
                xtype: 'textarea',
                fieldLabel: '备注',
                height: 100,
                allowBlank: false,
                value: me.qgd ? me.qgd.get('descpt') : ''
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var resObj = _getRes(),
                        res = {},
                        flag = true;
                    for (var key in resObj) {
                        if (resObj.hasOwnProperty(key)) {
                            var field = resObj[key];
                            if (!field.isValid()) {
                                flag = false;
                            }
                            else {
                                res[key] = (field.xtype == 'datefield' ? field.getSubmitValue() : field.getValue());
                            }
                        }
                    }
                    if (flag) {
                        debugger
                        Ext.apply(res, {
                            projectId: me.qgd.get('projectId'),
                            professionType: me.qgd.get('professionType'),
                            phoneNumber: me.qgd.get('phoneNumber'),
                            projectName: me.qgd.get('professionType'),
                            payee: me.qgd.get('payee')
                        });
                        ajaxUpdate('StatementBill.modifyQgd', res, ['projectId', 'professionType', 'payee'], function (obj){
                            me.qgd.set('totalFee',res['qgd']);
                            me.qgd.set('deadline',res['deadline']);
                            me.qgd.set('descpt',res['descpt']);
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
        ];

        this.callParent();
    }
});