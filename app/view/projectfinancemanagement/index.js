Ext.define('FamilyDecoration.view.projectfinancemanagement.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.projectfinancemanagement-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain',
        'FamilyDecoration.store.WorkCategory',
        'FamilyDecoration.view.projectfinancemanagement.ProjectSummary',
        'FamilyDecoration.view.projectfinancemanagement.SingleProfessionTypeBudget',
        'FamilyDecoration.view.projectfinancemanagement.SingleProjectBudgetTotal'
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
                projectCategory = me.getComponent('gridpanel-projectCategory'),
                projectCategorySt = projectCategory.getStore(),
                projectCategorySelModel = projectCategory.getSelectionModel(),
                projectCategoryItem = projectCategorySelModel.getSelection()[0],
                summaryCt = me.getComponent('container-summary');

            return {
                projectList: projectList,
                projectListSelModel: projectListSelModel,
                projectSt: projectSt,
                project: project,
                projectCategory: projectCategory,
                projectCategorySt: projectCategorySt,
                projectCategorySelModel: projectCategorySelModel,
                projectCategoryItem: projectCategoryItem,
                summaryCt: summaryCt
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
                            var resObj = _getRes(),
                                summarizedGrid,
                                item = resObj.summaryCt.items.items[0];
                            resObj.projectListSelModel.deselectAll();
                            resObj.projectCategory.hide();
                            summarizedGrid = Ext.create('FamilyDecoration.view.projectfinancemanagement.ProjectSummary');
                            resObj.summaryCt.removeAll();
                            resObj.summaryCt.add(summarizedGrid);
                        }
                    }
                ],
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var resObj = _getRes();
                        if (resObj.project) {
                            if (resObj.project.get('projectName')) {
                                if (resObj.projectCategory.isHidden()) {
                                    resObj.projectCategory.show();
                                }
                                resObj.projectCategorySelModel.deselectAll();
                            }
                        }
                        else {

                        }
                    }
                }
            },
            {
                xtype: 'gridpanel',
                width: 60,
                title: '项目',
                hidden: true,
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
                        if (st.last().get('value') != '0000') {
                            st.add(
                                {
                                    name: '合计',
                                    value: '0000'
                                }
                            );
                        }
                    },
                    selectionchange: function (selModel, sels, opts) {
                        var resObj = _getRes(),
                            singleProfessionBudgetGrid,
                            singleProfessionBudgetTotalGrid,
                            item = resObj.summaryCt.items.items[0];
                        if (resObj.projectCategoryItem) {
                            singleProfessionBudgetTotalGrid = Ext.create(
                                'FamilyDecoration.view.projectfinancemanagement.' 
                                    + (resObj.projectCategoryItem.get('value') == '0000' ? 'SingleProjectBudgetTotal' : 'SingleProfessionTypeBudget'), {
                                professionType: resObj.projectCategoryItem.get('value'),
                                projectId: resObj.project.getId()
                            });
                            resObj.summaryCt.removeAll();
                            resObj.summaryCt.add(singleProfessionBudgetTotalGrid);
                        }
                        else {
                            resObj.summaryCt.removeAll();
                        }
                    }
                }
            },
            {
                xtype: 'container',
                itemId: 'container-summary',
                flex: 6,
                layout: 'fit'
            }
        ];

        this.callParent();
    }
});