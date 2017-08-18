Ext.define('FamilyDecoration.view.contractmanagement.EditAppendix', {
    extend: 'Ext.window.Window',
    alias: 'widget.contractmanagement-editappendix',
    requires: [
        
    ],
    layout: 'fit',
    defaults: {
        
    },
    modal: true,
    width: 500,
    height: 300,
    maxHeight: 350,
    title: '添加附件条款',
    appendix: undefined,
    bodyPadding: 4,

    initComponent: function () {
        var me = this;

        me.setTitle(me.appendix ? '编辑附加条款' : '添加附加条款');

        me.items = [
            {
                xtype: 'form',
                defaultType: 'textfield',
                layout: 'form',
                autoScroll: true,
                items: [
                    {
                        fieldLabel: '内容',
                        xtype: 'textarea',
                        name: 'content',
                        height: 100,
                    },
                    {
                        fieldLabel: '调整工期',
                        xtype: 'datefield',
                        name: 'projectPeriod'
                    },
                    {
                        fieldLabel: '调整项目经理',
                        readOnly: true,
                        name: 'captain'
                    },
                    {
                        fieldLabel: '调整设计师',
                        readOnly: true,
                        name: 'designer'
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){

                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ]
        
        this.callParent();
    }
});