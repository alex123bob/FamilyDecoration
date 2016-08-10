Ext.define('FamilyDecoration.view.targetsetting.TargetBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.targetsetting-targetboard',
    requires: [
        'FamilyDecoration.store.BusinessGoal',
        'FamilyDecoration.view.targetsetting.AddTarget'
    ],
    autoScroll: true,
    title: '目标量',
    columns: [],
    depa: undefined,

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
                month = toolbar.getComponent('combobox-month'),
                st = me.getStore();
            return {
                year: year,
                month: month,
                st: st
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
                            st = mCombo.getStore(),
                            resObj = _getRes(),
                            proxy = resObj.st.getProxy();
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
                                        name: i >= 10 ? i : ('0' + i),
                                        value: i >= 10 ? i : ('0' + i)
                                    }
                                );
                            }
                            data.unshift({
                                name: '请选择',
                                value: null
                            });
                            st.loadData(data);
                            if (proxy.extraParams) {
                                proxy.extraParams.year = newVal;
                                delete proxy.extraParams.month;
                                resObj.st.setProxy(proxy);
                                resObj.st.load();
                            }
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
                        var timeObj = _getTimeObj(),
                            resObj = _getRes(),
                            proxy = resObj.st.getProxy();
                        if (proxy.extraParams) {
                            if (newVal) {
                                proxy.extraParams.month = newVal;
                            }
                            else {
                                delete proxy.extraParams.month;
                            }
                            resObj.st.setProxy(proxy);
                            resObj.st.load();
                        }
                        else {
                        }
                    }
                }
            }
        ];

        me.bbar = [
            {
                itemId: 'button-add',
                xtype: 'button',
                text: '添加',
                icon: 'resources/img/add_target.png',
                handler: function () {
                    if (me.depa) {
                        var timeObj = _getTimeObj();
                        if (timeObj.year && timeObj.month) {
                            var win = Ext.create('FamilyDecoration.view.targetsetting.AddTarget', {
                                depa: me.depa,
                                timeObj: timeObj
                            });
                            win.show();
                        }
                        else {
                            showMsg('添加指标之前必须指定年和月!');
                        }
                    }
                    else {
                        showMsg('请先选择部门！');
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
                prefix = ['', 'a'],
                timeObj = _getTimeObj(),
                st,
                params = timeObj.month ? {
                    month: timeObj.month
                } : {};

            function renderCol(prefix, depa, needEditor) {
                var arr = [];
                if (depa == 'marketDepartment') {
                    arr = [
                        {
                            text: '扫楼',
                            align: 'center',
                            dataIndex: prefix + 'c1',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? {
                                xtype: 'textfield',
                                allowBlank: false
                            } : null
                        },
                        {
                            text: '电销',
                            align: 'center',
                            dataIndex: prefix + 'c2',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? {
                                xtype: 'textfield',
                                allowBlank: false
                            } : null
                        },
                        {
                            text: '到店',
                            align: 'center',
                            dataIndex: prefix + 'c3',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? {
                                xtype: 'textfield',
                                allowBlank: false
                            } : null
                        },
                        {
                            text: '定金',
                            align: 'center',
                            dataIndex: prefix + 'c4',
                            flex: 1,
                            width: 80,
                            editor: needEditor ? {
                                xtype: 'textfield',
                                allowBlank: false
                            } : null
                        }
                    ];
                }
                else if (depa == 'designDepartment') {
                    arr = [
                        {
                            text: '定金率',
                            align: 'center',
                            dataIndex: prefix + 'c1',
                            flex: 1,
                            width: 160,
                            editor: needEditor ? {
                                xtype: 'textfield',
                                allowBlank: false
                            } : null
                        },
                        {
                            text: '签单额',
                            align: 'center',
                            dataIndex: prefix + 'c2',
                            flex: 1,
                            width: 160,
                            editor: needEditor ? {
                                xtype: 'textfield',
                                allowBlank: false
                            } : null
                        }
                    ];
                }
                else {
                    arr = [];
                }
                return arr;
            }

            if (depa) {
                Ext.apply(params, {
                    year: timeObj.year,
                    action: 'BusinessGoal.getByDepa',
                    depa: (function () {
                        if (me.depa.get('value') == 'marketDepartment') {
                            return '004';
                        }
                        else if (me.depa.get('value') == 'designDepartment') {
                            return '002';
                        }
                    })()
                })
                st = Ext.create('FamilyDecoration.store.BusinessGoal', {
                    autoLoad: true,
                    proxy: {
                        type: 'rest',
                        reader: {
                            type: 'json'
                        },
                        url: './api.php',
                        extraParams: params
                    }
                });
                cols[1].columns = renderCol(prefix[0], depa, true);
                cols[2].columns = renderCol(prefix[1], depa, false);
            }
            else {
                st = false;
                cols = [];
            }

            me.reconfigure(st, cols);
        };

        me.addListener({
            afterrender: function (grid, opts) {
                var resObj = _getRes(),
                    combo = resObj.year,
                    mCombo = resObj.month,
                    m = new Date().getMonth() + 1;
                m = (m >= 10 ? m : '0' + m);
                combo.fireEventArgs('change', [combo, combo.getValue()]);
                mCombo.setValue(m);
            }
        })

        me.callParent();
    }
})