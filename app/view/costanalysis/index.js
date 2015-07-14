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
            xtype: 'progress-projectlistbycaptain',
            flex: 2,
            height: '100%',
            title: '工程项目名称',
            searchFilter: true,
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px'
            },
            listeners: {
                itemclick: function (view, record, item){
                    var pro = record,
                        totalCost = Ext.getCmp('gridpanel-totalCost'),
                        costAnalysis = Ext.getCmp('gridpanel-costAnalysis');
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
                                    })
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
                }
            }
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