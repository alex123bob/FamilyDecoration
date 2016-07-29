Ext.define('FamilyDecoration.view.targetsetting.TargetBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.targetsetting-targetboard',
    requires: [],
    autoScroll: true,
    title: '目标量',
    columns: [],

    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'combobox',
                fieldLabel: '年',
                labelWidth: 40,
                editable: false,
                displayField: 'name',
                valueField: 'value',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    data: (function (){
                        var start = 2014,
                            end = new Date().getFullYear(),
                            arr = [];
                        for (var i = start; i <= end; i++) {
                            arr.push({
                                name: i,
                                value: i
                            });
                        }
                        return arr;
                    })()
                })
            },
            {
                xtype: 'combobox',
                fieldLabel: '月',
                labelWidth: 40,
                editable: false,
                displayField: 'name',
                valueField: 'value',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    data: (function (){
                        var start = 1,
                            end = 12,
                            arr = [];
                        for (var i = start; i <= end; i++) {
                            arr.push({
                                name: i,
                                value: i
                            });
                        }
                        return arr;
                    })()
                })
            }
        ];

        me.refresh = function (depa, year, month) {
            var cols = [
                {
                    text: '人员',
                    align: 'center',
                    dataIndex: 'staffName',
                    flex: 1
                },
                {
                    text: '目标量',
                    columns: []
                },
                {
                    text: '汇总量',
                    columns: []
                }
            ],
            prefix = ['plan_', 'accomplishment_'];

            function renderCol(prefix, depa) {
                var arr = [];
                if (depa == 'marketDepartment') {
                    arr = [
                        {
                            text: '扫楼',
                            align: 'center',
                            dataIndex: prefix + 'buildingSwiping',
                            flex: 1,
                            width: 80
                        },
                        {
                            text: '电销',
                            align: 'center',
                            dataIndex: prefix + 'telemarketing',
                            flex: 1,
                            width: 80
                        },
                        {
                            text: '到店',
                            align: 'center',
                            dataIndex: prefix + 'companyVisit',
                            flex: 1,
                            width: 80
                        },
                        {
                            text: '定金',
                            align: 'center',
                            dataIndex: prefix + 'deposist',
                            flex: 1,
                            width: 80
                        }
                    ];
                }
                else if (depa == 'designDepartment') {
                    arr = [
                        {
                            text: '定金率',
                            align: 'center',
                            dataIndex: prefix + 'depositRate',
                            flex: 1,
                            width: 160
                        },
                        {
                            text: '签单额',
                            align: 'center',
                            dataIndex: prefix + 'signedBusinessNumber',
                            flex: 1,
                            width: 160
                        }
                    ];
                }
                else {
                    arr = [];
                }
                return arr;
            }

            cols[1].columns = renderCol(prefix[0], depa);
            cols[2].columns = renderCol(prefix[1], depa);

            me.reconfigure(false, cols);
        };

        me.callParent();
    }
})