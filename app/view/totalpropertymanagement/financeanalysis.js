Ext.define('FamilyDecoration.view.totalpropertymanagement.FinanceAnalysis', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.totalpropertymanagement-financeanalysis',
    requires: [
        'FamilyDecoration.view.totalpropertymanagement.DateFilter',
        'FamilyDecoration.view.totalpropertymanagement.PieChart',
        'FamilyDecoration.view.totalpropertymanagement.AnalysisTable'
    ],
    layout: 'vbox',
    defaults: {
        width: '100%',
        flex: 1,
        layout: 'hbox',
        defaults: {
            flex: 1,
            height: '100%'
        }
    },
    title: '财务分析',

    initComponent: function () {
        var me = this,
            _getRes = function (){
                var incomeAnalysis = me.getComponent('incomeAnalysis'),
                    incomeAnalysisChart = incomeAnalysis.getComponent('incomeAnalysisChart').down('chart'),
                    incomeAnalysisChartSt = incomeAnalysisChart.getStore(),
                    incomeAnalysisGrid = incomeAnalysis.getComponent('incomeAnalysisGrid'),
                    incomeAnalysisGridSt = incomeAnalysisGrid.getStore(),
                    internalOutcomeAnalysis = me.getComponent('internalOutcomeAnalysis'),
                    internalOutcomeAnalysisChart = internalOutcomeAnalysis.getComponent('internalOutcomeAnalysisChart').down('chart'),
                    internalOutcomeAnalysisChartSt = internalOutcomeAnalysisChart.getStore(),
                    internalOutcomeAnalysisGrid = internalOutcomeAnalysis.getComponent('internalOutcomeAnalysisGrid'),
                    internalOutcomeAnalysisGridSt = internalOutcomeAnalysisGrid.getStore(),
                    projectOutcomeAnalysis = me.getComponent('projectOutcomeAnalysis'),
                    projectOutcomeAnalysisChart = projectOutcomeAnalysis.getComponent('projectOutcomeAnalysisChart').down('chart'),
                    projectOutcomeAnalysisChartSt = projectOutcomeAnalysisChart.getStore(),
                    projectOutcomeAnalysisGrid = projectOutcomeAnalysis.getComponent('projectOutcomeAnalysisGrid'),
                    projectOutcomeAnalysisGridSt = projectOutcomeAnalysisGrid.getStore();
                return {
                    incomeAnalysisChartSt: incomeAnalysisChartSt,
                    incomeAnalysisChartProxy: incomeAnalysisChartSt.getProxy(),
                    incomeAnalysisGridSt: incomeAnalysisGridSt,
                    incomeAnalysisGridProxy: incomeAnalysisGridSt.getProxy(),
                    internalOutcomeAnalysisChartSt: internalOutcomeAnalysisChartSt,
                    internalOutcomeAnalysisChartProxy: internalOutcomeAnalysisChartSt.getProxy(),
                    internalOutcomeAnalysisGridSt: internalOutcomeAnalysisGridSt,
                    internalOutcomeAnalysisGridProxy: internalOutcomeAnalysisGridSt.getProxy(),
                    projectOutcomeAnalysisChartSt: projectOutcomeAnalysisChartSt,
                    projectOutcomeAnalysisChartProxy: projectOutcomeAnalysisChartSt.getProxy(),
                    projectOutcomeAnalysisGridSt: projectOutcomeAnalysisGridSt,
                    projectOutcomeAnalysisGridProxy: projectOutcomeAnalysisGridSt.getProxy()
                }
            }

        me.dockedItems = [
            {
                xtype: 'totalpropertymanagement-datefilter',
                needScale: false,
                filterFunc: function (startTime, endTime, account, scale){
                    var resObj = _getRes();
                    Ext.apply(resObj.incomeAnalysisChartProxy.extraParams, {
                        startTime: Ext.Date.format(startTime, 'Ymd'),
                        endTime: Ext.Date.format(endTime, 'Ymd'),
                        action: 'Account.incomeAnalysis'
                    });
                    resObj.incomeAnalysisChartSt.load();
                    Ext.apply(resObj.incomeAnalysisGridProxy.extraParams, {
                        startTime: Ext.Date.format(startTime, 'Ymd'),
                        endTime: Ext.Date.format(endTime, 'Ymd'),
                        action: 'Account.incomeAnalysis',
                        total: true
                    });
                    resObj.incomeAnalysisGridSt.load();
                    Ext.apply(resObj.internalOutcomeAnalysisChartProxy.extraParams, {
                        startTime: Ext.Date.format(startTime, 'Ymd'),
                        endTime: Ext.Date.format(endTime, 'Ymd'),
                        action: 'Account.corpOutcomeAnalysis'
                    });
                    resObj.internalOutcomeAnalysisChartSt.load();
                    Ext.apply(resObj.internalOutcomeAnalysisGridProxy.extraParams, {
                        startTime: Ext.Date.format(startTime, 'Ymd'),
                        endTime: Ext.Date.format(endTime, 'Ymd'),
                        action: 'Account.corpOutcomeAnalysis',
                        total: true
                    });
                    resObj.internalOutcomeAnalysisGridSt.load();
                    Ext.apply(resObj.projectOutcomeAnalysisChartProxy.extraParams, {
                        startTime: Ext.Date.format(startTime, 'Ymd'),
                        endTime: Ext.Date.format(endTime, 'Ymd'),
                        action: 'Account.projectOutcomeAnalysis'
                    });
                    resObj.projectOutcomeAnalysisChartSt.load();
                    Ext.apply(resObj.projectOutcomeAnalysisGridProxy.extraParams, {
                        startTime: Ext.Date.format(startTime, 'Ymd'),
                        endTime: Ext.Date.format(endTime, 'Ymd'),
                        action: 'Account.projectOutcomeAnalysis',
                        total: true
                    });
                    resObj.projectOutcomeAnalysisGridSt.load();
                }
            }
        ];

        me.items = [
            {
                itemId: 'incomeAnalysis',
                title: '收入分析',
                header: {
                    padding: 2
                },
                items: [
                    {
                        itemId: 'incomeAnalysisChart',
                        xtype: 'totalpropertymanagement-piechart'
                    },
                    {
                        itemId: 'incomeAnalysisGrid',
                        xtype: 'totalpropertymanagement-analysistable'
                    }
                ]
            },
            {
                itemId: 'internalOutcomeAnalysis',
                title: '内部支出分析',
                header: {
                    padding: 2
                },
                items: [
                    {
                        itemId: 'internalOutcomeAnalysisChart',
                        xtype: 'totalpropertymanagement-piechart'
                    },
                    {
                        itemId: 'internalOutcomeAnalysisGrid',
                        xtype: 'totalpropertymanagement-analysistable'
                    }
                ]
            },
            {
                itemId: 'projectOutcomeAnalysis',
                title: '工程支出分析',
                header: {
                    padding: 2
                },
                items: [
                    {
                        itemId: 'projectOutcomeAnalysisChart',
                        xtype: 'totalpropertymanagement-piechart'
                    },
                    {
                        itemId: 'projectOutcomeAnalysisGrid',
                        xtype: 'totalpropertymanagement-analysistable'
                    }
                ]
            }
        ];

        this.callParent();
    }
});