Ext.define('FamilyDecoration.view.contractmanagement.EditContract', {
    extend: 'Ext.window.Window',
    alias: 'widget.contractmanagement-editcontract',
    requires: [
        'FamilyDecoration.view.contractmanagement.ProjectContract'
    ],
    defaults: {
    },
    layout: 'fit',
    contract: undefined,
    width: 700,
    height: 500,
    maximizable: true,
    modal: true,

    initComponent: function (){
        var me = this;

        me.title = me.contract ? '编辑合同' : '添加合同';

        me.items = [
            {
                xtype: 'contractmanagement-projectcontract'
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
        ];

        this.callParent();
    }
});