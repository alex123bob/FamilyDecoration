Ext.define('FamilyDecoration.view.costanalysis.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.costanalysis-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectList', 'FamilyDecoration.view.costanalysis.TotalCost',
        'FamilyDecoration.view.costanalysis.CostAnalysis', 'FamilyDecoration.store.Budget',
        'FamilyDecoration.view.progress.ProjectListByCaptain'
    ],
    autoScroll: true,
    width: '100%',
    height: '100%',

    layout: 'hbox',

    initComponent: function (){
        var me = this;

        me.items = [{
            xtype: 'container',
            layout: 'vbox',
            flex: 2,
            margin: '0 1 0 0',
            height: '100%',
            items: [
                {
                    xtype: 'progress-projectlistbycaptain',
                    id: 'projectlistbycaptain-projectlistForBudget',
                    name: 'projectlistbycaptain-projectlistForBudget',
                    flex: 1,
                    width: '100%',
                    title: '工程项目名称',
                    searchFilter: true,
                    includeFrozen: true,
                    listeners: {
                        itemclick: function (view, record, item){
                            var pro = record,
                                totalCost = Ext.getCmp('gridpanel-totalCost'),
                                costAnalysis = Ext.getCmp('gridpanel-costAnalysis'),
                                businessBudgetGrid = Ext.getCmp('gridpanel-businessBudget');
                            if (pro && pro.get('projectName') && pro.get('budgets').length > 0) {
                                var win = Ext.create('Ext.window.Window', {
                                    title: '预算列表',
                                    width: 500,
                                    height: 400,
                                    modal: true,
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            columns: [
                                                {
                                                    text: '工程地址',
                                                    dataIndex: 'projectName',
                                                    flex: 1
                                                },
                                                {
                                                    text: '预算名称',
                                                    dataIndex: 'budgetName',
                                                    flex: 1
                                                }
                                            ],
                                            store: Ext.create('FamilyDecoration.store.Budget', {
                                                autoLoad: true,
                                                filters: [
                                                    function (item){
                                                        return item.get('projectId') == pro.getId();
                                                    }
                                                ]
                                            }),
                                            listeners: {
                                                itemdblclick: function(view, rec, item, index, e, opts) {
                                                    totalCost.getStore().load({
                                                        params: {
                                                            budgetId: rec.get('budgetId')
                                                        }
                                                    });
                                                    costAnalysis.getStore().load({
                                                        params: {
                                                            budgetId: rec.get('budgetId')
                                                        }
                                                    });
                                                    win.close();
                                                }
                                            }
                                        }
                                    ],
                                    buttons: [{
                                        text: '加载',
                                        handler: function (){
                                            var grid = win.down('gridpanel'),
                                                rec = grid.getSelectionModel().getSelection()[0];
                                            totalCost.getStore().load({
                                                params: {
                                                    budgetId: rec.get('budgetId')
                                                }
                                            });
                                            costAnalysis.getStore().load({
                                                params: {
                                                    budgetId: rec.get('budgetId')
                                                }
                                            });
                                            win.close();
                                        }
                                    }, {
                                        text: '取消',
                                        handler: function (){
                                            win.close();
                                        }
                                    }]
                                });

                                win.show();
                            }
                            else {
                                showMsg('该工程没有预算！');
                            }
                            // remove selection of the grid underneath
                            businessBudgetGrid.getSelectionModel().deselectAll();
                        }
                    }
                },
                {
                    title: '业务预算',
                    xtype: 'gridpanel',
                    id: 'gridpanel-businessBudget',
                    name: 'gridpanel-businessBudget',
                    width: '100%',
                    flex: 1,
                    columns: [
                        {
                            flex: 1,
                            text: '业务名称',
                            dataIndex: 'businessAddress',
                            renderer: function (val, meta, rec){
                                return rec.get('businessRegion') + ' ' + val;
                            }
                        }
                    ],
                    store: Ext.create('FamilyDecoration.store.Budget', {
                        autoLoad: true,
                        proxy: {
                            type: 'rest',
                            url: './libs/budget.php',
                            extraParams: {
                                action: 'list',
                                onlyBusiness: true,
                                isTransfered: false // cost analysis: hide those businesses which have been transferred to project
                            },
                            reader: {
                                type: 'json'
                            }
                        }
                    }),
                    listeners: {
                        selectionchange: function (selModel, recs, opts){
                            var businessBudgetGrid = Ext.getCmp('gridpanel-businessBudget'),
                                st = businessBudgetGrid.getStore(),
                                totalCostGrid = Ext.getCmp('gridpanel-totalCost'),
                                costAnalysisGrid = Ext.getCmp('gridpanel-costAnalysis'),
                                projectListByCaptain = Ext.getCmp('projectlistbycaptain-projectlistForBudget');
                            if (recs.length > 0) {
                                var rec = recs[0];
                                totalCostGrid.getStore().load({
                                    params: {
                                        budgetId: rec.get('budgetId')
                                    }
                                });
                                costAnalysisGrid.getStore().load({
                                    params: {
                                        budgetId: rec.get('budgetId')
                                    }
                                });
                                // remove selection in the treepanel above
                                projectListByCaptain.getSelectionModel().deselectAll();
                            }
                            else {
                                totalCostGrid.getStore().removeAll();
                                costAnalysisGrid.getStore().removeAll();
                            }
                        },
                        afterrender: function (grid, opts){
                            var view = grid.getView();
                            var tip = Ext.create('Ext.tip.ToolTip', {
                                // The overall target element.
                                target: view.el,
                                // Each grid row causes its own separate show and hide.
                                delegate: view.cellSelector,
                                // Moving within the row should not hide the tip.
                                trackMouse: true,
                                // Render immediately so that tip.body can be referenced prior to the first show.
                                renderTo: Ext.getBody(),
                                listeners: {
                                    // Change content dynamically depending on which element triggered the show.
                                    beforeshow: function updateTipBody(tip) {
                                        var gridColumns = view.getGridColumns();
                                        var column = gridColumns[tip.triggerElement.cellIndex];
                                        var rec = view.getRecord(tip.triggerElement.parentNode);
                                        var val = rec.get(column.dataIndex);
                                        if (val) {
                                            val = '<strong>预算名称：</strong> ' + rec.get('budgetName') + '<br />';
                                            val += '<strong>预算地址：</strong> ' + rec.get('businessRegion') + ' ' + rec.get('businessAddress') + '<br />';
                                            val += '<strong>预算说明：</strong> ' + rec.get('comments').replace(/\n/g, '<br />') + '<br />';
                                            val += '<strong>户型大小：</strong> ' + rec.get('areaSize') + '<br />';
                                            val += '<strong>客户名称：</strong> ' + rec.get('custName') + '<br />';
                                            val += '<strong>预算总价：</strong> ' + rec.get('totalFee') + '<br />';
                                            val += '<strong>创建时间：</strong> ' + rec.get('createTime') + '<br />';
                                            tip.update(val);
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        }, {
            xtype: 'panel',
            height: '100%',
            flex: 8,
            // title: '成本分析',
            header: false,
            layout: 'vbox',
            items: [{
                xtype: 'costanalysis-totalcost',
                id: 'gridpanel-totalCost',
                name: 'gridpanel-totalCost',
                title: '总成本',
                flex: 3,
                width: '100%'
            }, {
                xtype: 'costanalysis-costanalysis',
                id: 'gridpanel-costAnalysis',
                name: 'gridpanel-costAnalysis',
                title: '成本分析',
                flex: 2,
                width: '100%'
            }]
        }];

        this.callParent();
    }
});