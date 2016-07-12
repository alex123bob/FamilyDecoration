Ext.define('FamilyDecoration.view.mylog.LogContent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mylog-logcontent',
    layout: 'vbox',
    title: '日志内容',
    defaults: {
        width: '100%'
    },
    requires: [],

    renderMode: undefined, // market, designer, undefined
    checkMode: undefined,

    initComponent: function () {
        var me = this;

        me.rerenderIndicatorCt = function (mode) {
            var indicatorCt = null,
                items = me.items.items;
            if (mode == 'market') {
                indicatorCt = {
                    xtype: 'container',
                    height: 24,
                    layout: 'hbox',
                    defaults: {
                        xtype: 'fieldcontainer',
                        height: '100%',
                        flex: 1,
                        margin: '0 2 0 0'
                    },
                    items: [
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-marketPlan',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 32,
                                width: 80,
                                margin: '0 2 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>计划:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '电销',
                                    name: 'textfield-telemarketing'
                                },
                                {
                                    fieldLabel: '到店',
                                    name: 'textfield-companyVisit'
                                },
                                {
                                    fieldLabel: '定金',
                                    name: 'textfield-deposit'
                                },
                                {
                                    fieldLabel: '扫楼',
                                    name: 'textfield-buildingSwiping'
                                }
                            ]
                        },
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-marketAccomplishment',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 32,
                                width: 80,
                                margin: '0 4 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>完成:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '电销',
                                    name: 'textfield-telemarketing'
                                },
                                {
                                    fieldLabel: '到店',
                                    name: 'textfield-companyVisit'
                                },
                                {
                                    fieldLabel: '定金',
                                    name: 'textfield-deposit'
                                },
                                {
                                    fieldLabel: '扫楼',
                                    name: 'textfield-buildingSwiping'
                                }
                            ]
                        }
                    ]
                };
            }
            else if (mode == 'designer') {
                indicatorCt = {
                    xtype: 'container',
                    height: 24,
                    layout: 'hbox',
                    defaults: {
                        xtype: 'fieldcontainer',
                        height: '100%',
                        flex: 1,
                        margin: '0 2 0 0'
                    },
                    items: [
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-designerPlan',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 45,
                                width: 90,
                                margin: '0 2 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>计划:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '签单额',
                                    name: 'textfield-signedBusinessNumber'
                                },
                                {
                                    fieldLabel: '定金率',
                                    name: 'textfield-depositRate'
                                }
                            ]
                        },
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-designerAccomplishment',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 45,
                                width: 90,
                                margin: '0 2 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>完成:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '签单额',
                                    name: 'textfield-signedBusinessNumber'
                                },
                                {
                                    fieldLabel: '定金率',
                                    name: 'textfield-depositRate'
                                }
                            ]
                        }
                    ]
                }
            }

            Ext.suspendLayouts();
            if (indicatorCt) {
                if (items[0].xtype == 'container') {
                    me.remove(items[0]);
                }
                me.insert(0, indicatorCt);
            }
            else {
                if (items[0].xtype == 'container') {
                    me.remove(items[0]);
                }
            }
            Ext.resumeLayouts(true);
        }

        me.rerenderGrid = function (mode){
            var items = me.items.items,
                grid, cols;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.xtype == 'gridpanel') {
                    grid = item;
                    break;
                }
            }
            if (mode == 'market') {
                cols = [
                    {
                        text: '日期',
                        dataIndex: 'day',
                        flex: 0.5
                    },
                    {
                        text: '规范计划',
                        flex: 1
                    },
                    {
                        text: '完成情况',
                        flex: 1
                    },
                    {
                        text: '相差',
                        flex: 1
                    },
                    {
                        text: '个人计划',
                        flex: 1
                    },
                    {
                        text: '总结日志',
                        flex: 1
                    },
                    {
                        text: '评价',
                        flex: 1
                    }
                ];
            }
            else {
                cols = [
                    {
                        text: '日期',
                        dataIndex: 'day',
                        flex: 0.5
                    },
                    {
                        text: '个人计划',
                        flex: 1
                    },
                    {
                        text: '总结日志',
                        flex: 1
                    },
                    {
                        text: '评价',
                        flex: 1
                    }
                ];
            }
            Ext.suspendLayouts();
            grid.reconfigure(false, cols);
            Ext.resumeLayouts(true);
        }

        me.items = [
            {
                xtype: 'gridpanel',
                flex: 9,
                name: 'gridpanel-logContent',
                itemId: 'gridpanel-logContent',
                columns: {
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            text: '日期'
                        },
                        {
                            text: '个人计划'
                        },
                        {
                            text: '总结日志'
                        },
                        {
                            text: '评价'
                        }
                    ]
                },
                bbar: [
                    {
                        text: '个人计划',
                        icon: 'resources/img/sheet.png',
                        handler: function (){

                        }
                    },
                    {
                        text: '总结日志',
                        icon: 'resources/img/summary.png',
                        handler: function (){

                        }
                    },
                    {
                        text: '评价',
                        hidden: !me.checkMode,
                        icon: 'resources/img/comment-new.png',
                        handler: function (){

                        }
                    }
                ]
            }
        ];

        me.addListener('afterrender', function (cmp, opts){
            me.rerenderIndicatorCt(me.renderMode);
            me.rerenderGrid(me.renderMode);
        })

        me.callParent();
    }
});