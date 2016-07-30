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
                labelWidth: 30,
                editable: false,
                displayField: 'name',
                valueField: 'value',
                value: new Date().getFullYear(),
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    data: (function () {
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
                }),
                listeners: {
                    change: function (combo, newVal, oldVal, opts) {
                        var d = new Date(),
                            y = d.getFullYear(),
                            m = d.getMonth() + 1,
                            start = 1,
                            end,
                            data = [],
                            mCombo = combo.nextSibling(),
                            st = mCombo.getStore();
                        mCombo.clearValue();
                        if (newVal) {
                            if (newVal == y) {
                                end = m;
                            }
                            else {
                                end = 12;
                            }
                            for (var i = start; i <= end; i++) {
                                data.push(
                                    {
                                        name: i,
                                        value: i
                                    }
                                );
                            }
                            st.loadData(data);
                        }
                        else {
                            st.removeAll();
                        }
                    }
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: '月',
                labelWidth: 30,
                editable: false,
                displayField: 'name',
                valueField: 'value',
                value: new Date().getMonth() + 1,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    data: (function (){
                        var d = new Date(),
                            m = d.getMonth() + 1,
                            data = [];
                        for (var i = 1; i <= m; i++) {
                            data.push(
                                {
                                    name: i,
                                    value: i
                                }
                            );
                        }
                        return data;
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