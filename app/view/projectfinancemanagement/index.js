Ext.define('FamilyDecoration.view.projectfinancemanagement.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.projectfinancemanagement-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain',
        'FamilyDecoration.store.WorkCategory'
    ],
    // autoScroll: true,
    layout: 'hbox',
    defaults: {
        height: '100%'
    },

    initComponent: function () {
        var me = this;

        function _getRes() {
            var projectList = me.getComponent('treepanel-projectList'),
                projectListSelModel = projectList.getSelectionModel(),
                projectSt = projectList.getStore(),
                project = projectListSelModel.getSelection()[0],
                projectCategory = me.getComponent('gridpanel-projectCategory');

            return {
                projectList: projectList,
                projectListSelModel: projectListSelModel,
                projectSt: projectSt,
                project: project,
                projectCategory: projectCategory
            };
        };

        me.items = [
            {
                xtype: 'progress-projectlistbycaptain',
                searchFilter: true,
                title: '工程项目',
                itemId: 'treepanel-projectList',
                loadAll: false,
                flex: 1,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                bbar: [
                    {
                        text: '汇总',
                        icon: 'resources/img/sum.png',
                        handler: function () {
                            var resObj = _getRes();
                            resObj.projectListSelModel.deselectAll();
                            resObj.projectCategory.hide();
                        }
                    }
                ],
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var resObj = _getRes();
                        if (resObj.project) {
                            if (resObj.project.get('projectName')) {
                                resObj.projectCategory.isHidden() && resObj.projectCategory.show();
                            }
                            else {

                            }
                        }
                        else {
                            
                        }
                    }
                }
            },
            {
                xtype: 'gridpanel',
                width: 100,
                title: '项目',
                hideHeaders: true,
                itemId: 'gridpanel-projectCategory',
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '项目',
                            dataIndex: 'name'
                        }
                    ]
                },
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                store: FamilyDecoration.store.WorkCategory,
                listeners: {
                    afterrender: function (grid, opts) {
                        var st = grid.getStore();
                        st.add(
                            {
                                name: '合计',
                                value: '0000'
                            }
                        );
                    }
                }
            },
            {
                xtype: 'container',
                flex: 4
            }
        ];

        this.callParent();
    }
});