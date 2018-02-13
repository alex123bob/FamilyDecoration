Ext.define('FamilyDecoration.view.staffsalary.EditCommission', {
    extend: 'Ext.window.Window',
    alias: 'widget.staffsalary-editcommission',
    requires: [
        'Ext.grid.Panel',
        'FamilyDecoration.store.StaffSalaryCommission',
        'FamilyDecoration.view.staffsalary.ProjectCommissionList'
    ],
    layout: 'fit',
    title: '添加提成',
    defaults: {
    },
    modal: true,
    width: 600,
    height: 400,
    closable: false,
    // get from parent component: data {staffName, staffRealName, salaryTime: {year, month}, rec}
    data: null,
    callbackAfterEdit: Ext.emptyFn,
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.StaffSalaryCommission', {
                autoLoad: false
            }),
            proxy = st.getProxy();
        Ext.apply(proxy.extraParams, {
            staffSalaryId: me.data.rec.getId()
        });

        st.setProxy(proxy);
        st.load();

        me.tbar = [
            {
                xtype: 'button',
                text: '工程列表',
                icon: 'resources/img/project_list.png',
                handler: function (){
                    var win = Ext.create('FamilyDecoration.view.staffsalary.ProjectCommissionList', {
                        data: me.data,
                        callbackAfterAdded: function (){
                            st.reload();
                        }
                    });
                    win.show();
                }
            }
        ];

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                store: st,
                plugins: [
                    Ext.create('Ext.grid.plugin.RowEditing', {
                        clicksToEdit: 2,
                        listeners: {
                            edit: function(editor, e, field, value, row, column, rowIdx, colIdx) {
                                var field = e.field,
                                    rec = e.record,
                                    newValues = e.newValues,
                                    params = {};
                                Ext.apply(newValues, {
                                    id: rec.getId()
                                });
                                for (var pro in newValues) {
                                    switch (pro) {
                                        case 'projectName':
                                        case 'totalPrice':
                                        case 'commissionTime':
                                            continue;
                                            break;
                                    
                                        default:
                                            params[pro] = newValues[pro];
                                            break;
                                    }
                                }
                                ajaxUpdate('StaffSalaryCommission', params, ['id'], function (obj){
                                    showMsg(rec.get('staffRealName') + me.data.salaryTime.year + '年' + me.data.salaryTime.month + '月对工程[' + newValues.projectName + ']的提成编辑成功!');
                                }, false, true);
                                e.record.commit();
                            }
                        }
                    })
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '工程地址',
                            dataIndex: 'projectName'
                        },
                        {
                            text: '合同总额',
                            dataIndex: 'totalPrice'
                        },
                        {
                            text: '提成',
                            xtype: 'numbercolumn',
                            format: '¥ 0,000.00',
                            dataIndex: 'commissionAmount',
                            editor: {
                                xtype: 'numberfield',
                                allowBlank: false,
                                allowDecimals: true,
                                minValue: 0
                            }
                        },
                        {
                            text: '提成时间',
                            dataIndex: 'commissionTime',
                            renderer: function (val){
                                return Ext.Date.format(Ext.Date.parse(val, 'Y-m-d H:i:s'), 'Y-m');
                            }
                        }
                    ]
                }
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){
                    var allFilled = true;
                    st.each(function (rec){
                        if (!rec.get('commissionAmount')) {
                            return allFilled = false;
                        }
                    });
                    if (!allFilled) {
                        Ext.Msg.error('存在未编辑的提成条目，请编辑完再按确定!');
                    }
                    else {
                        ajaxUpdate('StaffSalary.calculateCommission', {
                            id: me.data.rec.getId()
                        }, ['id'], function (obj){
                            showMsg('提成编辑成功!');
                            me.callbackAfterEdit();
                        }, true);
                        me.close();
                    }
                }
            }
        ];

        this.callParent();
    }
});