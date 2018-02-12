Ext.define('FamilyDecoration.view.staffsalary.DetailedSalary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.staffsalary-detailedsalary',
    requires: [
        'FamilyDecoration.view.staffsalary.Month',
        'FamilyDecoration.store.StaffSalary',
        'Ext.form.field.Number',
        'FamilyDecoration.view.staffsalary.EditCommission'
    ],
    layout: 'fit',
    title: '工资详情',
    defaults: {
    },
    selChange: Ext.emptyFn,
    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'staffsalary-monthfield',
                format: 'm/Y',
                value: new Date(),
                listeners: {
                    change: function (cmp, newVal, oldVal, opts){
                        me.selChange();
                    }
                }
            },
            {
                xtype: 'button',
                text: '同步',
                handler: function (){
                    var st = me.getStore();
                    st.reload();
                }
            }
        ];

        me.getTime = function (){
            var month = this.down('staffsalary-monthfield'),
                val = month.getValue();
            Ext.isDate(val) && (val = Ext.Date.format(val, 'm/Y'));
            return val ? {
                year: val.split('/')[1],
                month: val.split('/')[0]
            } : -1;
        };
        
        me.plugins = [
            Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToEdit: 2,
                listeners: {
                    edit: function(editor, e) {
                        var field = e.field,
                            rec = e.record,
                            newValues = e.newValues,
                            params = {};
                        Ext.apply(newValues, {
                            id: rec.getId()
                        });
                        for (var pro in newValues) {
                            switch (pro) {
                                case 'staffRealName':
                                case 'staffLevel':
                                case 'commission':
                                case 'actualPaid':
                                    continue;
                                    break;
                            
                                default:
                                    params[pro] = newValues[pro];
                                    break;
                            }
                        }
                        ajaxUpdate('StaffSalary', params, ['id'], function (obj){
                            var pickedTime = me.getTime();
                            showMsg(newValues.staffRealName + pickedTime.year + '年' + pickedTime.month + '月工资信息编辑成功！合计与实发信息需点击[同步]按钮获取。');
                        }, false, true);
                        e.record.commit();
                    }
                }
            })
        ];

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    allowDecimals: true
                },
                xtype: 'numbercolumn',
                format: '¥ 0,000.00'
            },
            items: [
                {
                    xtype: 'actioncolumn',
                    width: 25,
                    flex: null,
                    items: [
                        {
                            icon: 'resources/img/commission.png',
                            tooltip: '编辑提成',
                            handler: function (){
                                var win = Ext.create('FamilyDecoration.view.staffsalary.EditCommission', {

                                });
                                win.show();
                            }
                        }
                    ],
                    editor: null
                },
                {
                    text: '姓名',
                    dataIndex: 'staffRealName',
                    xtype: 'gridcolumn',
                    editor: null
                },
                {
                    text: '职务',
                    dataIndex: 'staffLevel',
                    renderer: function (val){
                        return User.renderRole(val);
                    },
                    xtype: 'gridcolumn',
                    editor: null
                },
                {
                    text: '底薪',
                    dataIndex: 'basicSalary'
                },
                {
                    text: '提成',
                    dataIndex: 'commission',
                    editor: null
                },
                {
                    text: '全勤',
                    dataIndex: 'fullAttendanceBonus'
                },
                {
                    text: '奖励',
                    dataIndex: 'bonus'
                },
                {
                    text: '违扣',
                    dataIndex: 'deduction'
                },
                {
                    text: '合计',
                    dataIndex: 'total',
                    editor: null
                },
                {
                    text: '五险',
                    dataIndex: 'insurance'
                },
                {
                    text: '公积金',
                    dataIndex: 'housingFund'
                },
                {
                    text: '个税',
                    dataIndex: 'incomeTax'
                },
                {
                    text: '其他',
                    dataIndex: 'others'
                },
                {
                    text: '实发',
                    dataIndex: 'actualPaid',
                    editor: null
                }
            ]
        }

        me.store = Ext.create('FamilyDecoration.store.StaffSalary');
        
        this.callParent();
    }
});