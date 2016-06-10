Ext.define('FamilyDecoration.view.planmaking.PlanTable', {
    extend: 'Ext.container.Container',
    alias: 'widget.planmaking-plantable',
    layout: 'vbox',
    requires: [
        
    ],

    initComponent: function () {
        var me = this;

        me.getValues = function () {

        };

        me.refresh = function () {

        };

        me.items = [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                width: '100%',
                height: 40,
                items: [
                    {
                        width: 40,
                        height: '100%',
                        xtype: 'image',
                        margin: '0 0 0 240',
                        src: './resources/img/logo.jpg'
                    },
                    {
                        xtype: 'displayfield',
                        margin: '0 0 0 20',
                        name: 'displayfield-budgetName',
                        value: '佳诚装饰&nbsp;&nbsp;施工进度表',
                        hideLabel: true,
                        fieldStyle: {
                            fontSize: '24px',
                            lineHeight: '30px'
                        },
                        style: {
                            fontFamily: '黑体'
                        },
                        flex: 1,
                        height: '100%'
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                width: '100%',
                flex: 0.5,
                layout: 'hbox',
                defaults: {
                    xtype: 'displayfield'
                },
                items: [
                    {
                        fieldLabel: '客户姓名',
                        name: 'customerName',
                        flex: 1
                    },
                    {
                        fieldLabel: '工程地址',
                        name: 'projectName',
                        flex: 1
                    },
                    {
                        fieldLabel: '开工日期',
                        name: 'startTime',
                        flex: 1
                    },
                    {
                        fieldLabel: '完工日期',
                        name: 'endTime',
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'gridpanel',
                width: '100%',
                autoScroll: true,
                flex: 10,
                columns: [
                    {
                        text: '序号',
                        dataIndex: 'serialNumber',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '项目',
                        dataIndex: 'parentItemName',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '子项目',
                        dataIndex: 'itemName',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '4月',
                        columns: [
                            {
                                text: '1日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '2日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '3日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '4日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '5日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '6日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '7日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '8日',
                                flex: 1,
                                align: 'center'
                            },
                            {
                                text: '9日',
                                flex: 1,
                                align: 'center'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                width: '100%',
                flex: 0.5,
                layout: 'hbox',
                defaults: {
                    xtype: 'displayfield'
                },
                items: [
                    {
                        fieldLabel: '设计师',
                        name: 'designer',
                        flex: 1
                    },
                    {
                        fieldLabel: '项目经理',
                        name: 'captain',
                        flex: 1
                    },
                    {
                        fieldLabel: '制表日期',
                        name: 'tableMadeTime',
                        flex: 1
                    },
                    {
                        name: 'phoneNumber',
                        fieldLabel: '监督电话',
                        value: '8839678 8076789',
                        flex: 1
                    }
                ]
            }
        ];

        me.listeners = {
            afterrender: function (panel, opts) {
                if (panel.isEdit) {
                    panel.refresh(panel.bill);
                }
            }
        };

        me.callParent();
    }
});