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
        if(me.qgd && me.qgd.data.id ){
            me.setTitle('调整质保金');
        }else{
            me.setTitle('创建质保金');
        }
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
                fieldLabel: me.qgd && me.qgd.get('id') ? '调整质保金' : '质保金',
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
                        res = {};
                    for (var key in resObj) {
                        if (!resObj.hasOwnProperty(key))
                            continue;
                        var field = resObj[key];
                        if (!field.isValid())
                            return ;
                        res[key] = (field.xtype == 'datefield' ? field.getSubmitValue() : field.getValue());
                    }
                    res['refId'] = me.qgd.get('refId');
                    res['id'] = me.qgd.get('id');
                    ajaxUpdate('StatementBill.modifyQgd', res, ['id'], function (obj){
                        me.qgd.set('totalFee',res['qgd']);
                        me.qgd.set('deadline',res['deadline']);
                        me.qgd.set('descpt',res['descpt']);
                        me.callback();
                        me.close();
                    }, true);
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