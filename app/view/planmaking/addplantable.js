Ext.define('FamilyDecoration.view.planmaking.AddPlanTable', {
    extend: 'Ext.window.Window',
    alias: 'widget.planmaking-addplantable',
    layout: 'fit',
    requires: [
        'FamilyDecoration.store.PlanMaking'
    ],
    isEdit: false,
    modal: true,
    width: 500,
    height: 400,

    project: undefined,
    planId: undefined,
    maximizable: true,

    callbackAfterClose: Ext.emptyFn,

    initComponent: function () {
        var me = this,
            projectTime;
        
        if (me.project) {
            projectTime = me.project.get('period').split(':');
        }

        me.title = me.isEdit ? '修改计划' : '添加计划';

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                refresh: function (){
                    var st = this.getStore(),
                        view = this.getView(),
                        selModel = this.getSelectionModel(),
                        rec = selModel.getSelection()[0],
                        index = st.indexOf(rec);
                    st.reload({
                        callback: function (recs, ope, success){
                            if (success) {
                                selModel.deselectAll();
                                view.getSelectionModel().select(index);
					            view.focusRow(index, 200);
                            }
                        }
                    });	
                },
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
							edit: function (editor, e){
								Ext.suspendLayouts();
								
								e.record.commit();
								editor.completeEdit();
                                var period,
                                    startTime = new Date(e.record.get('startTime')),
                                    endTime = new Date(e.record.get('endTime'));
                                startTime = isNaN(startTime) ? '' : startTime;
                                endTime = isNaN(endTime) ? '' : endTime;
								if (e.field == 'startTime' || e.field == 'endTime') {
                                    period = Ext.Date.format(startTime, 'Y-m-d') + '~'
                                             + Ext.Date.format(endTime, 'Y-m-d');
									ajaxUpdate('PlanMaking.updateItem', {
										time: period,
										id: e.record.getId()
									}, 'id', function (obj){
										showMsg('编辑成功！');
                                        me.down('gridpanel').refresh();
									});
								}
								
								Ext.resumeLayouts();
							},
							validateedit: function (editor, e, opts){
								var rec = e.record;
								if (e.field == 'startTime' || e.field == 'endTime') {
									if (Ext.Date.format(e.value, 'Y-m-d') == e.originalValue) {
										return false;
									}
                                    if (e.field == 'startTime') {
                                        var endTime = new Date(rec.get('endTime') + ' 00:00:00');
                                        if (!isNaN(endTime)) {
                                            if (e.value - endTime > 0) {
                                                showMsg('开始时间不能大于结束时间！');
                                                return false;
                                            }
                                        }
                                    }
                                    else if (e.field == 'endTime') {
                                        var startTime = new Date(rec.get('startTime') + ' 00:00:00');
                                        if (!isNaN(startTime)) {
                                            if (e.value - startTime < 0) {
                                                showMsg('开始时间不能大于结束时间！');
                                                return false;
                                            }
                                        }
                                    }
								}
							}
						}
                    })
                ],
                store: Ext.create('FamilyDecoration.store.PlanMaking', {
                    autoLoad: false
                }),
                columns: {
                    defaults: {
                        align: 'center',
                        flex: 1
                    },
                    items: [
                        {
                            text: '大项',
                            dataIndex: 'parentItemName'
                        },
                        {
                            text: '小项',
                            dataIndex: 'itemName'
                        },
                        {
                            text: '开始时间',
                            dataIndex: 'startTime',
                            flex: 2,
                            renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                            editor: {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                editable: false,
                                minValue: projectTime[0],
                                maxValue: projectTime[1],
                                listeners: {
                                    select: function (picker, val, opts){
                                        console.log(picker);
                                    },
                                    expand: function (picker, opts){
                                        if (!picker.getValue()){
                                            picker.setValue(projectTime[0]);
                                        }
                                    }
                                }
                            }
                        },
                        {
                            text: '结束时间',
                            dataIndex: 'endTime',
                            flex: 2,
                            renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                            editor: {
                                xtype: 'datefield',
                                format: 'Y-m-d',
                                editable: false,
                                minValue: projectTime[0],
                                maxValue: projectTime[1],
                                listeners: {
                                    expand: function (picker, opts){
                                        if (!picker.getValue()){
                                            picker.setValue(projectTime[1]);
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ];

        me.buttons = [
            {
                text: '关闭',
                handler: function (){
                    me.close();
                    me.callbackAfterClose();
                }
            }
        ];

        me.listeners = {
            show: function (win){
                if (win.planId) {
                    var grid = win.down('gridpanel');
                    grid.getStore().load({
                        params: {
                            planId: win.planId
                        }
                    });
                }
            }
        };

        me.callParent();
    }
});