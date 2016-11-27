Ext.define('FamilyDecoration.view.projectfinancemanagement.ColumnChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.projectfinancemanagement-columnchart',
    requires: [
        'FamilyDecoration.store.AnalyticTable'
    ],
    layout: 'fit',
    defaults: {

    },
    rootName: undefined, // colMan, colMat
    projectId: undefined,
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.AnalyticTable', {
                autoLoad: true,
                // data: [
                //     {
                //         reality: 1,
                //         budget: 2,
                //         professionType: '水电'
                //     },
                //     {
                //         reality: 4,
                //         budget: 5,
                //         professionType: '泥工'
                //     },
                //     {
                //         reality: 3.1,
                //         budget: 2.2,
                //         professionType: '木工'
                //     },
                //     {
                //         reality: 1.2,
                //         budget: 4,
                //         professionType: '油漆'
                //     },
                //     {
                //         reality: 4.3,
                //         budget: 4,
                //         professionType: '杂项'
                //     }
                // ],
                proxy: {
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: me.rootName
                    },
                    extraParams: {
                        projectId: me.projectId,
                        action: 'Project.financeReport'
                    }
                }
            });

        me.items = [
            {
                title: '人工',
                xtype: 'chart',
                style: 'background:#fff',
                animate: true,
                shadow: true,
                store: st,
                legend: {
                    position: 'right'
                },
                axes: [
                    {
                        type: 'Numeric',
                        position: 'left',
                        fields: ['reality', 'budget'],
                        minimum: 0,
                        label: {
                            renderer: Ext.util.Format.numberRenderer('0,0.0')
                        },
                        grid: true,
                        title: '金额(元)'
                    },
                    {
                        type: 'Category',
                        position: 'bottom',
                        fields: ['professionType'],
                        title: '项目'
                    }
                ],
                series: [
                    {
                        type: 'column',
                        axis: 'left',
                        xField: 'professionType',
                        yField: ['reality', 'budget'],
                        title: ['实际', '预算'],
                        tips: {
                            trackMouse: true,
                            width: 140,
                            height: 28,
                            renderer: function (storeItem, item) {
                                this.setTitle(item.value[0] + ': ' + item.value[1]);
                            }
                        },
                    }
                ]
            }
        ];

        this.callParent();
    }
});