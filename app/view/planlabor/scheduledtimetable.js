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

        function renderGridByProfessionType (professionType, startTime, endTime) {
            var grid = me.down('grid'),
                st = Ext.create('FamilyDecoration.store.PlanLabor');
            if (professionType) {
                var startTime, endTime;
                var configuredColumns = [
                    {
                        text: '工程项目',
                        dataIndex: 'projectName',
                        width: 74,
                        minWidth: 60,
                        align: 'center',
                        sortable: false,
                        menuDisabled: true
                    }
                ];
                if (startTime && endTime) {
                    Ext.suspendLayouts();
                    startTime = Ext.Date.parse(startTime, 'Y-m-d');
                    endTime = Ext.Date.parse(endTime, 'Y-m-d');

                    for (var d = new Date(startTime); d.getTime() <= endTime.getTime(); d.setDate(d.getDate() + 1)) {
                        var index;
                        if (d.getDate() == 1 || d.getTime() === startTime.getTime()) {
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
                            dataIndex: 'period',
                            sortable: false,
                            curTime: Ext.Date.format(d, 'Y-m-d'),
                            renderer: function (val, meta, rec, rowIndex, colIndex, st, view){
                                var curTime = Ext.Date.parse(meta.column.curTime, 'Y-m-d');
                                console.log(val, curTime);
                            }
                        });
                    }
                    st.load({
                        params: {
                            value: professionType.get('value')
                        },
                        silent: true,
                        callback: function (recs, ope, success){
                            if (success) {
                                grid.reconfigure(st, configuredColumns);
                                Ext.resumeLayouts(true);
                            }
                            else {
                                removeGridColumnAndData(grid);
                                Ext.resumeLayouts(true);
                            }
                        }
                    });
                }
                else {
                    showMsg('时间格式不对!');
                    removeGridColumnAndData(grid);
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

        me.refresh = function (professionType, startTime, endTime){
            renderTitle(professionType);
            renderGridByProfessionType(professionType, startTime, endTime);
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