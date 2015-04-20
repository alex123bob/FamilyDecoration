Ext.define('FamilyDecoration.view.costanalysis.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.costanalysis-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectList', 'FamilyDecoration.view.costanalysis.TotalCost',
        'FamilyDecoration.view.costanalysis.CostAnalysis'
    ],
    autoScroll: true,
    width: '100%',
    height: '100%',

    layout: 'hbox',

    initComponent: function (){
        var me = this;

        me.items = [{
            xtype: 'progress-projectlist',
            flex: 2,
            height: '100%',
            title: '工程项目名称',
            searchFilter: true,
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px'
            },
            listeners: {
                selectionchange: function (selModel, sels, opts){
                    showMsg('海洋，帮忙实现下。');
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
                title: '总成本',
                flex: 3,
                width: '100%'
            }, {
                xtype: 'costanalysis-costanalysis',
                title: '成本分析',
                flex: 2,
                width: '100%'
            }]
        }];

        this.callParent();
    }
});