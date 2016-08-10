Ext.define('FamilyDecoration.view.targetsetting.TargetBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.targetsetting-targetboard',
    requires: [
        'FamilyDecoration.store.BusinessGoal'
    ],
    autoScroll: true,
    title: '目标量',
    columns: [],

    initComponent: function () {
        var me = this;

        me.plugins = [
            Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToEdit: 1,
                listeners: {
                    beforeedit: function (editor, e) {
                        var rec = e.record;
                    },
                    edit: function (editor, e) {
                        var rec = e.record;
                        Ext.suspendLayouts();

                        Ext.resumeLayouts();
                    },
                    validateedit: function (editor, e, opts) {
                        var rec = e.record;
                    }
                }
            })
        ];

        function _getRes() {
            var toolbar = me.down('toolbar'),
                year = toolbar.getComponent('combobox-year'),
                month = toolbar.getComponent('combobox-month');
            return {
                year: year,
                month: month
            };
        }

        function _getTimeObj() {
            var resObj = _getRes();
            return {
                year: resObj.year.getValue(),
                month: resObj.month.getValue()
            };
        }

        me.tbar = [
            {
                xtype: 'combobox',
                itemId: 'combobox-year',
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
                            data.unshift({
                                name: '请选择',
                                value: null
                            });
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
                itemId: 'combobox-month',
                fieldLabel: '月',
                labelWidth: 30,
                editable: false,
                displayField: 'name',
                valueField: 'value',
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    },
                    data: []
                }),
                listeners: {
                    change: function (combo, newVal, oldVal, opts) {
                        console.log(_getTimeObj());
                    }
                }
            }
        ];

        me.refresh = function (depa, year, month) {
            var cols = [
                {
                    text: '人员',
                    align: 'center',
                    dataIndex: 'user',
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
                prefix = ['plan_', 'accomplishment_'],
                st = Ext.create('FamilyDecoration.store.BusinessGoal', {
                    autoLoad: false
                });

            function renderCol(prefix, depa, needEditor) {
                var arr = [];
                if (depa == 'marketDepartment') {
                    arr = [
                        {
                            text: '扫楼',
                            align: 'center',
                            dataIndex: prefix + 'buildingSwiping',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? null : {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '电销',
                            align: 'center',
                            dataIndex: prefix + 'telemarketing',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? null : {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '到店',
                            align: 'center',
                            dataIndex: prefix + 'companyVisit',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? null : {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '定金',
                            align: 'center',
                            dataIndex: prefix + 'deposist',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? null : {
                                xtype: 'textfield',
                                allowBlank: false
                            }
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
                            width: 160,
                            editor: needEditor ? null : {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '签单额',
                            align: 'center',
                            dataIndex: prefix + 'signedBusinessNumber',
                            flex: 1,
                            width: 160,
                            editor: needEditor ? null : {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }
                    ];
                }
                else {
                    arr = [];
                }
                return arr;
            }

            cols[1].columns = renderCol(prefix[0], depa, true);
            cols[2].columns = renderCol(prefix[1], depa, false);

            me.reconfigure(st, cols);
        };

        me.addListener({
            afterrender: function (grid, opts) {
                var resObj = _getRes(),
                    combo = resObj.year,
                    mCombo = resObj.month,
                    m = new Date().getMonth() + 1;
                combo.fireEventArgs('change', [combo, combo.getValue()]);
                mCombo.setValue(m);
            }
        })

        me.callParent();
    }
})