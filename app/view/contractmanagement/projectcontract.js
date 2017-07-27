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

        me.items = [
            {
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
                        fieldLabel: '合同总额'
                    },
                    {
                    }
                ]
            }
        ];
        
        this.callParent();
    }
});