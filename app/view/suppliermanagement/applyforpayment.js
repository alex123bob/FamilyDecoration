Ext.define('FamilyDecoration.view.suppliermanagement.ApplyForPayment', {
    extend: 'Ext.window.Window',
    alias: 'widget.suppliermanagement-applyforpayment',
    requires: [

    ],
    modal: true,
    title: '订购单付款申请',
    width: 500,
    height: 400,
    bodyPadding: 5,
    resizable: false,
    layout: 'vbox',
    defaults: {
        flex: 1,
        width: '100%'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'fieldset',
                title: '信息',
                itemId: 'fieldset-headerInfo',
                width: '100%',
                flex: 4,
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
                        fieldLabel: '工程名称'
                    },
                    {
                        fieldLabel: '项目经理'
                    },
                    {
                        fieldLabel: '订购总金额'
                    },
                    {
                        fieldLabel: '订购单'
                    },
                    {
                        fieldLabel: '订购日期'
                    },
                    {
                        fieldLabel: '是否审核'
                    },
                    {
                        fieldLabel: '审核人'
                    },
                    {
                        fieldLabel: '已付金额'
                    }
                ]
            },
            {
                xtype: 'numberfield',
                fieldLabel: '申付金额',
                flex: 0.5
            },
            {
                xtype: 'numberfield',
                fieldLabel: '调整总金额',
                flex: 0.5
            },
            {
                xtype: 'fieldcontainer',
                flex: 1,
                layout: 'hbox',
                defaults: {
                    flex: 1
                },
                defaultType: 'radiofield',
                items: [
                    {
                        xtype: 'displayfield',
                        value: '是否抹平余额',
                        hideLabel: true
                    },
                    {
                        boxLabel: '是',
                        name: 'smooth',
                        inputValue: 'yes'
                    },
                    {
                        boxLabel: '否',
                        name: 'smooth',
                        inputValue: 'no',
                        checked: true
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {

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