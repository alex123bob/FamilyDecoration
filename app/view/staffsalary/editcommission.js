Ext.define('FamilyDecoration.view.staffsalary.EditCommission', {
    extend: 'Ext.window.Window',
    alias: 'widget.staffsalary-editcommission',
    requires: [
        'Ext.grid.Panel',
        'FamilyDecoration.view.staffsalary.ProjectCommissionList'
    ],
    layout: 'fit',
    title: '添加提成',
    defaults: {
    },
    modal: true,
    width: 600,
    height: 500,
    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'button',
                text: '工程列表',
                icon: 'resources/img/project_list.png',
                handler: function (){
                    var win = Ext.create('FamilyDecoration.view.staffsalary.ProjectCommissionList', {

                    });
                    win.show();
                }
            }
        ];

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '工程地址',
                            dataIndex: 'projectName'
                        },
                        {
                            text: '合同总额',
                            dataIndex: 'totalPrice'
                        },
                        {
                            text: '提成',
                            dataIndex: 'commissionAmount'
                        }
                    ]
                }
            }
        ]

        
        this.callParent();
    }
});