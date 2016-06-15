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

    initComponent: function () {
        var me = this;

        me.title = me.isEdit ? '修改计划' : '添加计划';

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1
                    })
                ],
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
                            renderer: Ext.util.Format.dateRenderer('M d, Y'),
                            editor: {
                                xtype: 'datefield',
                                format: 'm/d/y'
                                // minValue: '01/01/06',
                                // disabledDays: [0, 6],
                                // disabledDaysText: 'Plants are not available on the weekends'
                            }
                        },
                        {
                            text: '结束时间',
                            dataIndex: 'endTime',
                            flex: 2,
                            editor: {
                                xtype: 'datefield',
                                format: 'm/d/y'
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

                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ];

        me.listeners = {
        };

        me.callParent();
    }
});