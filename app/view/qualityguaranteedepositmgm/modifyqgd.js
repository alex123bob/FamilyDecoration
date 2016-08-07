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

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'fieldcontainer',
                itemId: 'fieldcontainer-headerInfo',
                autoScroll: true,
                defaults: {
                    xtype: 'displayfield',
                    margin: '0 8 0 0',
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
                        fieldLabel: '质保金',
                        name: 'qgd',
                        value: me.qgd ? me.qgd.get('qgd') : ''
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
                allowBlank: false
            },
            {
                itemId: 'datefield-modifyDeadline',
                xtype: 'datefield',
                fieldLabel: '调整期限',
                height: 25,
                allowBlank: false
            },
            {
                itemId: 'textarea-modifyReason',
                xtype: 'textarea',
                fieldLabel: '调整原因',
                height: 100,
                allowBlank: false
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){

                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});