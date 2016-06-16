Ext.define('FamilyDecoration.view.planmaking.PlanTable', {
    extend: 'Ext.container.Container',
    alias: 'widget.planmaking-plantable',
    layout: 'vbox',
    requires: [
        'FamilyDecoration.store.PlanMaking'
    ],

    initComponent: function () {
        var me = this;

        function monthDiff(d1, d2) {
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth() + 1;
            months += d2.getMonth();
            return months <= 0 ? 0 : months;
        }

        me.removeGridColumnAndData = function (grid) {
            Ext.suspendLayouts();
            grid.reconfigure(false, []);
            Ext.resumeLayouts(true);
        }

        me.rerenderGridByProject = function (project) {
            var grid = me.down('grid'),
                st = Ext.create('FamilyDecoration.store.PlanMaking');
            if (project) {
                var period = project.get('period'),
                    projectTime = period.split(':'),
                    startTime, endTime, daysInBetween;
                var configuredColumns = [
                    {
                        text: '序号',
                        dataIndex: 'serialNumber',
                        width: 60,
                        minWidth: 50,
                        align: 'center',
                        sortable: false,
                        menuDisabled: true
                    },
                    {
                        text: '项目',
                        dataIndex: 'parentItemName',
                        width: 70,
                        minWidth: 50,
                        align: 'center',
                        sortable: false,
                        menuDisabled: true
                    },
                    {
                        text: '子项目',
                        dataIndex: 'itemName',
                        width: 70,
                        minWidth: 60,
                        align: 'center',
                        sortable: false,
                        menuDisabled: true
                    }
                ];
                if (projectTime.length == 2 && isDate(projectTime)) {
                    Ext.suspendLayouts();
                    projectStartTime = Ext.Date.parse(projectTime[0], 'Y-m-d');
                    projectEndTime = Ext.Date.parse(projectTime[1], 'Y-m-d');

                    for (var d = new Date(projectStartTime); d.getTime() <= projectEndTime.getTime(); d.setDate(d.getDate() + 1)) {
                        var index;
                        if (d.getDate() == 1 || d.getTime() === projectStartTime.getTime()) {
                            index = configuredColumns.push({
                                text: (d.getMonth() + 1) + '月',
                                columns: []
                            });
                        }
                        else {
                            index = configuredColumns.length;
                        }
                        configuredColumns[index - 1].columns.push({
                            text: d.getDate() + '日',
                            flex: 1,
                            align: 'center',
                            dataIndex: 'startTime',
                            sortable: false,
                            curTime: Ext.Date.format(d, 'Y-m-d'),
                            renderer: function (val, meta, rec, rowIndex, colIndex, st, view){
                                
                                var startTime = Ext.Date.parse(val, 'Y-m-d'),
                                    endTime = Ext.Date.parse(rec.get('endTime'), 'Y-m-d'),
                                    curTime = Ext.Date.parse(meta.column.curTime, 'Y-m-d');
                                if (isDate([startTime, endTime, curTime])) {
                                    if (curTime.getTime() >= startTime.getTime() && curTime.getTime() <= endTime.getTime()) {
                                        meta.style = 'background: grey;';
                                    }
                                    return '';
                                }
                                return '';
                            }
                        });
                    }
                    st.load({
                        params: {
                            projectId: project.getId()
                        },
                        silent: true,
                        callback: function (recs, ope, success){
                            if (success) {
                                grid.reconfigure(st, configuredColumns);
                                Ext.resumeLayouts(true);
                            }
                            else {
                                me.removeGridColumnAndData(grid);
                                Ext.resumeLayouts(true);
                            }
                        }
                    });
                }
                else {
                    showMsg('时间格式不对!');
                    me.removeGridColumnAndData(grid);
                }
            }
            else {
                me.removeGridColumnAndData(grid);
            }
        }

        me.goThroughField = function (project){
            var header = me.down('[name="fieldcontainer-plantableHeader"]'),
                footer = me.down('[name="fieldcontainer-plantableFooter"]'),
                headerItems = header.items.items,
                footerItems = footer.items.items;
            if (project) {
                Ext.Array.each(headerItems, function (item, index, arr){
                    item.setValue(project.get(item.name));
                });
                Ext.Array.each(footerItems, function (item, index, arr){
                    if (item.name != 'phoneNumber') {
                        item.setValue(project.get(item.name));
                    }
                });
            }
            else {
                Ext.Array.each(headerItems, function (item, index, arr){
                    item.setValue('');
                });
                Ext.Array.each(footerItems, function (item, index, arr){
                    if (item.name != 'phoneNumber') {
                        item.setValue('');
                    }
                });
            }
        }

        me.renderHeaderAndFooterInfo = function (project){
            if (project) {
                var projectTime = project.get('period').split(':');
                project.set({
                    startTime: projectTime[0],
                    endTime: projectTime[1]
                });
                if (project.get('businessId')) {
                    Ext.Ajax.request({
                        url: './libs/business.php',
                        method: 'GET',
                        params: {
                            action: 'getBusinessById',
                            businessId: project.get('businessId')
                        },
                        callback: function (opts, success, res){
                            if (success) {
                                var obj = Ext.decode(res.responseText);
                                if (obj.length > 0) {
                                    project.set({
                                        custName: obj[0]['customer']
                                    });
                                    me.goThroughField(project);
                                }
                                else {
                                    showMsg('该工程没有客户名称！');
                                    me.goThroughField(project);
                                }
                            }
                        }
                    })
                }
                else {
                    me.goThroughField(project);
                }
            }
            else {
                me.goThroughField();
            }
        }

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
                name: 'fieldcontainer-plantableHeader',
                defaults: {
                    xtype: 'displayfield',
                    labelWidth: 70
                },
                items: [
                    {
                        fieldLabel: '客户姓名',
                        name: 'custName',
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
                cls: 'gridpanel-planmaking',
                columns: [
                ],
                viewConfig: {
                    emptyText: '请选择项目加载对应计划表',
                    deferEmptyText: false,
                    forceFit: true
                },
                listeners: {
                    afterrender: function (grid, opts){
                        var view = grid.getView();
                        var tip = Ext.create('Ext.tip.ToolTip', {
                            // The overall target element.
                            target: view.el,
                            // Each grid row causes its own separate show and hide.
                            delegate: view.cellSelector,
                            // Moving within the row should not hide the tip.
                            trackMouse: true,
                            // Render immediately so that tip.body can be referenced prior to the first show.
                            renderTo: Ext.getBody(),
                            listeners: {
                                // Change content dynamically depending on which element triggered the show.
                                beforeshow: function updateTipBody(tip) {
                                    var gridColumns = view.getGridColumns();
                                    var column = gridColumns[tip.triggerElement.cellIndex];
                                    var rec = view.getRecord(tip.triggerElement.parentNode);
                                    var val = rec.get(column.dataIndex);
                                    if (val && (column.dataIndex == 'parentItemName' || column.dataIndex == 'itemName') ) {
                                        tip.update(val);
                                    }
                                    else {
                                        return false;
                                    }
                                }
                            }
                        });
                    }
                }
            },
            {
                xtype: 'fieldcontainer',
                width: '100%',
                flex: 0.5,
                layout: 'hbox',
                name: 'fieldcontainer-plantableFooter',
                defaults: {
                    xtype: 'displayfield',
                    labelWidth: 70
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
            }
        };

        me.callParent();
    }
});