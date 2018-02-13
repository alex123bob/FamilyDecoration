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
    width: 800,
    height: 400,
    // get from parent component: data {staffName, staffRealName, salaryTime: {year, month}, rec}
    data: null,
    callbackAfterAdded: Ext.emptyFn,
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
                projects = projectListSelModel.getSelection(),

                commissionList = get('gridpanel-commissionList'),
                commissionListSt = commissionList.getStore(),
                commissionListSelModel = commissionList.getSelectionModel(),
                commission = commissionListSelModel.getSelection()[0];

            return {
                projectList: projectList,
                projectListSt: projectListSt,
                projectListSelModel: projectListSelModel,
                projects: projects,

                commissionList: commissionList,
                commissionListSt: commissionListSt,
                commissionListSelModel: commissionListSelModel,
                commission: commission,

                add: me.down('[itemId="add"]')
            };
        }

        me.items = [
            {
                xtype: 'gridpanel',
                itemId: 'gridpanel-projectList',
                width: 300,
                flex: null,
                region: 'west',
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: projectListSt,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                selModel: {
                    mode: 'SIMPLE'
                },
                selType: 'checkboxmodel',
                store: projectListSt,
                columns: {
                    defaults: {
                        align: 'center'
                    },
                    items: [
                        {
                            flex: 1,
                            text: '工程名称',
                            dataIndex: 'projectName'
                        },
                        {
                            flex: 1,
                            text: '合同总额',
                            dataIndex: 'contractTotalPrice',
                            xtype: 'numbercolumn',
                            format: '¥ 0,000.00'
                        }
                    ]
                },
                listeners: {
                    selectionchange: function (grid, sels){
                        var recs = sels,
                            selObj = _getRes();
                        recs.length > 0 ? selObj.commissionListSt.reload({
                            params: {
                                projectId: (function() {
                                    var arr = [];
                                    Ext.each(recs, function (rec){
                                        arr.push(rec.get('projectId'));
                                    });
                                    arr = arr.join(',');
                                    return arr;
                                })()
                            }
                        }) : selObj.commissionListSt.removeAll();
                        selObj.add.setDisabled(recs.length <= 0);
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
                            dataIndex: 'commissionAmount',
                            xtype: 'numbercolumn',
                            format: '¥ 0,000.00'
                        },
                        {
                            text: '提成时间',
                            dataIndex: 'commissionTime',
                            renderer: function (val){
                                var d = Ext.Date.parse(val, 'Y-m-d H:i:s'),
                                    res = Ext.Date.format(d, 'Y-m');
                                return res;
                            }
                        },
                        {
                            text: '工程名称',
                            dataIndex: 'projectName'
                        }
                    ]
                }
            }
        ];

        me.buttons = [
            {
                text: '添加',
                itemId: 'add',
                disabled: true,
                handler: function (){
                    var selObj = _getRes();
                    ajaxAdd('StaffSalaryCommission', {
                        staffSalaryId: me.data.rec.getId(),
                        projectIds: (function (){
                            var arr = [];
                            Ext.each(selObj.projects, function (project){
                                arr.push(project.getId());
                            });
                            return arr.join(',');
                        })(),
                        staffName: me.data.staffName,
                        staffRealName: me.data.staffRealName,
                        commissionTime: [me.data.salaryTime.year, me.data.salaryTime.month, '01'].join('-')
                    }, function (obj){
                        showMsg('添加成功!');
                        me.close();
                        me.callbackAfterAdded();
                    }, function (obj){
                        Ext.Msg.error(obj.errMsg);
                    })
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