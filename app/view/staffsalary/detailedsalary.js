Ext.define('FamilyDecoration.view.staffsalary.DetailedSalary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.staffsalary-detailedsalary',
    requires: [
        'FamilyDecoration.view.staffsalary.Month',
        'FamilyDecoration.store.StaffSalary'
    ],
    layout: 'fit',
    title: '工资详情',
    defaults: {
    },
    selChange: Ext.emptyFn,
    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'staffsalary-monthfield',
                format: 'm/Y',
                value: new Date(),
                listeners: {
                    change: function (cmp, newVal, oldVal, opts){
                        me.selChange();
                    }
                }
            }
        ];

        me.getTime = function (){
            var month = this.down('staffsalary-monthfield'),
                val = month.getValue();
            Ext.isDate(val) && (val = Ext.Date.format(val, 'm/Y'));
            return val ? {
                year: val.split('/')[1],
                month: val.split('/')[0]
            } : -1;
        };

        me.columns = {
            defaults: {
                flex: 1
            },
            items: [
                {
                    text: '姓名',
                    dataIndex: 'staffName'
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

        me.store = Ext.create('FamilyDecoration.store.StaffSalary');
        
        this.callParent();
    }
});