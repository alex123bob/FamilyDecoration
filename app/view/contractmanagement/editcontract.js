Ext.define('FamilyDecoration.view.contractmanagement.EditContract', {
    extend: 'Ext.window.Window',
    alias: 'widget.contractmanagement-editcontract',
    requires: [
        'FamilyDecoration.view.contractmanagement.ProjectContract'
    ],
    defaults: {
    },
    layout: 'fit',
    width: 700,
    height: 500,
    maximizable: true,
    modal: true,
    callback: Ext.emptyFn,

    business: undefined,
    type: undefined,
    project: undefined,

    // edit contract or add.
    contract: undefined,

    initComponent: function (){
        var me = this,
            isEdit = me.contract ? true : false;

        me.title = isEdit ? '编辑合同' : '添加合同';

        me.items = [
            {
                business: me.business,
                xtype: 'contractmanagement-projectcontract',
                contract: isEdit ? me.contract : false,
                project: me.project
            }
        ];

        me.buttons = [
            {
                hidden: isEdit,
                text: '确定',
                handler: function (){
                    var contractCmp;
                    // project contract
                    if (me.type === '0001') {
                        contractCmp = me.down('contractmanagement-projectcontract');
                        if (isEdit) {
                            showMsg('edit contract interface is under development.');
                        }
                        else {
                            // add contract
                            if (contractCmp.getValues()) {
                                ajaxAdd('ContractEngineering', contractCmp.getValues(), function (obj){
                                    showMsg('添加成功!');
                                    me.close();
                                    me.callback(obj);
                                });
                            }
                        }
                    }
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