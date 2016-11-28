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
                fields: ['id', 'name', 'value'],
                data: [
                    {
                        name: 'aaa',
                        value: 123
                    },
                    {
                        name: 'bbb',
                        value: 100
                    },
                    {
                        name: 'ccc',
                        value: 67
                    },{
                        name: 'ddd',
                        value: 80
                    },
                    {
                        name: 'eee',
                        value: 201
                    }
                ],
                proxy: {
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'data'
                    },
                    extraParams: {
                        action: 'FinanceManagement.get'
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
                        field: 'value',
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
                                    total += rec.get('value');
                                });
                                this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('value') / total * 100) + '%');
                            }
                        },
                        highlight: {
                            segment: {
                                margin: 20
                            }
                        },
                        label: {
                            field: 'name',
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