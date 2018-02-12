Ext.define('FamilyDecoration.view.staffsalary.ProjectCommissionList', {
    extend: 'Ext.window.Window',
    alias: 'widget.staffsalary-projectcommissionlist',
    requires: [
        'FamilyDecoration.view.staffsalary.Month',
        'FamilyDecoration.model.Project',
        'FamilyDecoration.store.StaffSalaryCommission'
    ],
    layout: 'border',
    title: '工程提成信息',
    modal: true,
    width: 700,
    height: 400,
    initComponent: function () {
        var me = this,
            projectListSt = Ext.create('Ext.data.Store', {
                autoLoad: true,
                model: 'FamilyDecoration.model.Project',
                proxy: {
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'data',
                        totalProperty: 'total'
                    },
                    extraParams: {
                        action: 'StaffSalaryCommission.getProjectList'
                    }
                }
            }),
            commissionListSt = Ext.create('FamilyDecoration.store.StaffSalaryCommission', {
                autoLoad: false
            });
        
        function _getRes (){
            var get = Ext.bind(me.getComponent, me),

                projectList = get('gridpanel-projectList'),
                projectListSt = projectList.getStore(),
                projectListSelModel = projectList.getSelectionModel(),
                project = projectListSelModel.getSelection()[0],

                commissionList = get('gridpanel-commissionList'),
                commissionListSt = commissionList.getStore(),
                commissionListSelModel = commissionList.getSelectionModel(),
                commission = commissionListSelModel.getSelection()[0];

            return {
                projectList: projectList,
                projectListSt: projectListSt,
                projectListSelModel: projectListSelModel,
                project: project,

                commissionList: commissionList,
                commissionListSt: commissionListSt,
                commissionListSelModel: commissionListSelModel,
                commission: commission
            };
        }

        me.items = [
            {
                xtype: 'gridpanel',
                itemId: 'gridpanel-projectList',
                collapsible: true,
                collapseDirection: 'left',
                width: 300,
                flex: null,
                region: 'west',
                title: '工程列表',
                hideHeaders: true,
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: projectListSt,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                store: projectListSt,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '工程名称',
                            dataIndex: 'projectName'
                        },
                        {
                            text: '合同总额',
                            dataIndex: 'contractTotalPrice',
                            xtype: 'numbercolumn',
                            format: '¥ 0,000.00'
                        }
                    ]
                },
                listeners: {
                    itemclick: function (grid, rec){
                        var selObj = _getRes();
                        selObj.commissionListSt.reload({
                            params: {
                                projectId: rec.get('projectId')
                            }
                        });
                    }
                }
            },
            {
                xtype: 'gridpanel',
                region: 'center',
                itemId: 'gridpanel-commissionList',
                store: commissionListSt,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '员工姓名',
                            dataIndex: 'staffRealName'
                        },
                        {
                            text: '提成金额',
                            dataIndex: 'commissionAmount'
                        },
                        {
                            text: '提成时间',
                            dataIndex: 'commissionTime',
                            renderer: function (val){
                                var d = Ext.Date.parse(val, 'Y-m-d H:i:s'),
                                    res = Ext.Date.format(d, 'Y-m');
                                return res;
                            }
                        }
                    ]
                }
            }
        ];

        me.buttons = [
            {
                text: '添加',
                handler: function (){
                    me.close();
                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ]
        
        this.callParent();
    }
});