Ext.define('FamilyDecoration.view.contractmanagement.ProjectContract', {
    extend: 'Ext.container.Container',
    alias: 'widget.contractmanagement-projectcontract',
    requires: [
        
    ],
    defaults: {
    },
    defaultType: 'form',
    layout: 'fit',
    preview: false, // whether current contract is editable or not.

    initComponent: function () {
        var me = this;

        /**
         * create payment area for four installments respectively. 
         * @param {*installment} index the ?st installment
         */
        function createPaymentArea (index){
            var titleArr = ['首期工程款', '二期工程款', '三期工程款', '尾款'];
            return {
                xtype: 'fieldset',
                title: titleArr[index],
                layout: 'vbox',
                defaults: {
                    flex: 1,
                    width: '100%'
                },
                defaultType: 'fieldcontainer',
                items: [
                    {
                        layout: 'hbox',
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'datefield',
                                fieldLabel: '日期'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '金额',
                                readOnly: true
                            }
                        ]
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '第一笔',
                        value: 'xxxxx'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '第二笔',
                        value: 'xxxxx'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '第三笔',
                        value: 'xxxxx'
                    }
                ]
            };
        }

        me.items = [
            {
                autoScroll: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    layout: 'hbox'
                },
                padding: '10px',
                defaultType: 'fieldcontainer',
                items: [
                    {
                        xtype: 'displayfield',
                        layout: 'auto',
                        value: '佳诚装饰装修合同',
                        hideLabel: true,
                        style: {
                            textAlign: 'center'
                        },
                        fieldStyle: {
                            fontSize: '26px'
                        }
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '客户姓名'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '确认'
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '客户联系'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '身份证号码'
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '项目经理'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '联系方式'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '联系地址'
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '设计师'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '业务员'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '签约代表'
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            labelWidth: 30,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                flex: 0.1,
                                hideLabel: true,
                                value: '工期:'
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '开始'
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: '结束',
                                margin: '0 8 0 8'
                            },
                            {
                                xtype: 'displayfield',
                                flex: 0.5,
                                labelWidth: 50,
                                fieldLabel: '总工期'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '合同总额',
                        anchor: '40%'
                    },
                    createPaymentArea(0),
                    createPaymentArea(1),
                    createPaymentArea(2),
                    createPaymentArea(3),
                    {
                        xtype: 'fieldset',
                        title: '附加条款',
                        layout: 'vbox',
                        defaultType: 'fieldcontainer',
                        defaults: {
                            flex: 1,
                            width: '100%'
                        },
                        items: [
                            {
                                layout: 'hbox',
                                defaults: {
                                },
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: '1',
                                        value: 'xxxxx',
                                        flex: 1
                                    },
                                    {
                                        xtype: 'button',
                                        text: '编辑',
                                        width: 50
                                    },
                                    {
                                        xtype: 'button',
                                        text: '删除',
                                        width: 50
                                    }
                                ]
                            },
                            {
                                layout: 'hbox',
                                defaults: {
                                },
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: '2',
                                        value: 'xxxxx',
                                        flex: 1
                                    },
                                    {
                                        xtype: 'button',
                                        text: '编辑',
                                        width: 50
                                    },
                                    {
                                        xtype: 'button',
                                        text: '删除',
                                        width: 50
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: '添加',
                                width: 50
                            }
                        ]
                    },
                    {
                        xtype: 'button',
                        text: '添加附件',
                        anchor: '12%'
                    }
                ]
            }
        ];
        
        this.callParent();
    }
});