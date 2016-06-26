Ext.define('FamilyDecoration.view.planlabor.ScheduledTimeTable', {
    extend: 'Ext.container.Container',
    alias: 'widget.planlabor-scheduledtimetable',
    layout: 'vbox',
    requires: [
        'FamilyDecoration.store.PlanLabor'
    ],

    initComponent: function () {
        var me = this;

        function removeGridColumnAndData (grid) {
            Ext.suspendLayouts();
            grid.reconfigure(false, []);
            Ext.resumeLayouts(true);
        }

        function renderGridByProfessionType (professionType) {
            var grid = me.down('grid'),
                st = Ext.create('FamilyDecoration.store.PlanLabor');
            if (professionType) {
                var period = project.get('period'),
                    projectTime = period.split(':'),
                    startTime, endTime;
                var configuredColumns = [
                    {
                        text: '工程项目',
                        dataIndex: 'projectName',
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
                removeGridColumnAndData(grid);
            }
        }

        function renderTitle (professionType){
            var fieldCt = me.down('fieldcontainer'),
                dispFd = fieldCt.down('displayfield');
            dispFd.setValue('佳诚装饰&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + professionType.get('cname') + '用工计划时间表');
        }

        me.refresh = function (professionType){
            renderTitle(professionType);
        }

        me.items = [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                width: '100%',
                height: 50,
                items: [
                    {
                        width: 50,
                        height: '100%',
                        xtype: 'image',
                        margin: '0 0 0 240',
                        src: './resources/img/logo.jpg'
                    },
                    {
                        xtype: 'displayfield',
                        margin: '0 0 0 20',
                        value: '',
                        hideLabel: true,
                        fieldStyle: {
                            fontSize: '28px',
                            lineHeight: '50px'
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
                xtype: 'gridpanel',
                width: '100%',
                autoScroll: true,
                flex: 10,
                columns: [
                ],
                viewConfig: {
                    emptyText: '请选择工种加载对应计划时间表',
                    deferEmptyText: false,
                    forceFit: true
                }
            }
        ];

        me.callParent();
    }
});