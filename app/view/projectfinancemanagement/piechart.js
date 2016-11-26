Ext.define('FamilyDecoration.view.projectfinancemanagement.PieChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectfinancemanagement-piechart',
    requires: [
        'FamilyDecoration.store.CostComposition',
        'Ext.chart.series.Pie'
    ],
    layout: 'fit',
    defaults: {

    },
    projectId: undefined,
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.CostComposition', {
                proxy: {
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'pie'
                    },
                    extraParams: {
                        projectId: me.projectId,
                        action: 'Project.financeReport'
                    }
                }
            });

        me.items = [
            {
                xtype: 'chart',
                animate: true,
                store: st,
                shadow: true,
                legend: {
                    position: 'right'
                },
                insetPadding: 20,
                theme: 'Base:gradients',
                series: [
                    {
                        type: 'pie',
                        field: 'cost',
                        showInLegend: true,
                        donut: false,
                        tips: {
                            trackMouse: true,
                            width: 140,
                            height: 28,
                            renderer: function (storeItem, item) {
                                //calculate percentage.
                                var total = 0;
                                st.each(function (rec) {
                                    total += rec.get('cost');
                                });
                                this.setTitle(storeItem.get('costType') + ': ' + Math.round(storeItem.get('cost') / total * 100) + '%');
                            }
                        },
                        highlight: {
                            segment: {
                                margin: 20
                            }
                        },
                        label: {
                            field: 'costType',
                            display: 'rotate',
                            contrast: true,
                            font: '18px Arial'
                        }
                    }
                ]
            }
        ];

        this.callParent();
    }
});