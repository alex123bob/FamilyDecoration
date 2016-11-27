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
        var me = this;

        me.dockedItems = [
            {
                xtype: 'totalpropertymanagement-datefilter'
            }
        ];

        me.items = [
            {
                title: '收入分析',
                header: {
                    padding: 2
                },
                items: [
                    {
                        xtype: 'totalpropertymanagement-piechart'
                    },
                    {
                        xtype: 'totalpropertymanagement-analysistable'
                    }
                ]
            },
            {
                title: '内部支出分析',
                header: {
                    padding: 2
                },
                items: [
                    {
                        xtype: 'totalpropertymanagement-piechart'
                    },
                    {
                        xtype: 'totalpropertymanagement-analysistable'
                    }
                ]
            },
            {
                title: '工程支出分析',
                header: {
                    padding: 2
                },
                items: [
                    {
                        xtype: 'totalpropertymanagement-piechart'
                    },
                    {
                        xtype: 'totalpropertymanagement-analysistable'
                    }
                ]
            }
        ];

        this.callParent();
    }
});