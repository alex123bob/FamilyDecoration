Ext.define('FamilyDecoration.view.contractmanagement.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.contractmanagement-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain',
        'FamilyDecoration.store.ContractType',
        'FamilyDecoration.view.contractmanagement.ProjectContract'
    ],
    layout: 'hbox',
    defaults: {
        height: '100%',
        flex: 1
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                hideHeaders: true,
                title: '合同种类',
                xtype: 'gridpanel',
                style: {
                    borderRight: '1px solid #cccccc'
                },
                store: Ext.create('FamilyDecoration.store.ContractType', {
                }),
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '合同种类',
                            dataIndex: 'name'
                        }
                    ]
                }
            },
            {
                searchFilter: true,
                xtype: 'progress-projectlistbycaptain',
                title: '合同列表',
                flex: 1.3,
                style: {
                    borderRight: '1px solid #cccccc'
                }
            },
            {
                xtype: 'panel',
                title: '合同详情',
                flex: 6,
                layout: 'fit',
                items: [
                    {
                        xtype: 'contractmanagement-projectcontract'
                    }
                ],
                bbar: [
                    {
                        text: '添加',
                        handler: function (){

                        }
                    },
                    {
                        text: '编辑',
                        handler: function (){
                            
                        }
                    }
                ]
            }
        ];
        
        this.callParent();
    }
});