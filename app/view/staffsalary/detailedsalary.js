Ext.define('FamilyDecoration.view.staffsalary.DetailedSalary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.staffsalary-detailedsalary',
    requires: [
        'FamilyDecoration.view.staffsalary.Month'
    ],
    layout: 'fit',
    title: '工资详情',
    defaults: {
    },
    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'staffsalary-monthfield',
                format: 'm/Y',
                value: new Date(),
                listeners: {
                    change: function (cmp, newVal, oldVal, opts){
                        
                    }
                }
            }
        ];

        me.columns = {
            defaults: {
                flex: 1
            },
            items: [
                {
                    text: '姓名'
                },
                {
                    text: '职务'
                },
                {
                    text: '底薪'
                },
                {
                    text: '提成'
                },
                {
                    text: '全勤'
                },
                {
                    text: '奖励'
                },
                {
                    text: '违扣'
                },
                {
                    text: '合计'
                },
                {
                    text: '五险'
                },
                {
                    text: '公积金'
                },
                {
                    text: '个税'
                },
                {
                    text: '其他'
                },
                {
                    text: '实发'
                }
            ]
        }
        
        this.callParent();
    }
});