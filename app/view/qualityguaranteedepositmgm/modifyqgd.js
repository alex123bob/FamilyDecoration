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
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '领款人',
                        name: 'payee',
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '工程地址',
                        name: 'projectName',
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '联系电话',
                        name: 'phoneNumber',
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '总金额',
                        name: 'totalFee',
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '已付金额',
                        name: 'paidFee',
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '质保金',
                        name: 'qgdFee',
                        value: 'this is a test info'
                    },
                    {
                        fieldLabel: '质保金期限',
                        name: 'qgdDeadline',
                        value: 'this is a test info'
                    }
                ]
            },
            {
                itemId: 'textfield-modifyQgd',
                fieldLabel: '调整质保金',
                height: 30
            },
            {
                itemId: 'textfield-modifyDeadline',
                fieldLabel: '调整期限',
                height: 30
            },
            {
                itemId: 'textarea-modifyReason',
                xtype: 'textarea',
                fieldLabel: '调整原因',
                height: 100
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