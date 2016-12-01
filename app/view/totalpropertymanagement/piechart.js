Ext.define('FamilyDecoration.view.totalpropertymanagement.PieChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.totalpropertymanagement-piechart',
    requires: [
        'Ext.chart.series.Pie'
    ],
    layout: 'fit',
    defaults: {

    },
    initComponent: function () {
        var me = this,
            st = Ext.create('Ext.data.Store', {
                autoLoad: false,
                fields: ['id', 'billType', 'amount'],
                proxy: {
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'data'
                    },
                    extraParams: {
                        action: 'Account.get' // Account.incomeAnalysis
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
                        field: 'amount',
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
                                    total += rec.get('amount');
                                });
                                this.setTitle(storeItem.get('billType') + ': ' + Math.round(storeItem.get('amount') / total * 100) + '%');
                            }
                        },
                        highlight: {
                            segment: {
                                margin: 20
                            }
                        },
                        label: {
                            field: 'billType',
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