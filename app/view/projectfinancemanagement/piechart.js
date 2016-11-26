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
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.CostComposition', {
                data: [
                    {
                        costType: '材料',
                        costPercent: 10
                    },
                    {
                        costType: '人工',
                        costPercent: 15
                    },
                    {
                        costType: '其他',
                        costPercent: 12
                    }
                ],
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
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
                        field: 'costPercent',
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
                                    total += rec.get('costPercent');
                                });
                                this.setTitle(storeItem.get('costType') + ': ' + Math.round(storeItem.get('costPercent') / total * 100) + '%');
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