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
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.setTitle(me.appendix ? '编辑附加条款' : '添加附加条款');

        me.items = [
            {
                xtype: 'form',
                layout: 'form',
                autoScroll: true,
                items: [
                    {
                        fieldLabel: '内容',
                        xtype: 'textarea',
                        name: 'content',
                        itemId: 'content',
                        height: 100,
                    },
                    {
                        checkboxToggle: true,
                        xtype: 'fieldset',
                        collapsed: true,
                        layout: 'hbox',
                        title: '调整工期',
                        itemId: 'fieldset-projectPeriod',
                        defaults: {
                            flex: 1,
                            margin: 4
                        },
                        items: [
                            {
                                // fieldLabel: '调整工期',
                                xtype: 'datefield',
                                name: 'projectPeriod',
                                itemId: 'projectPeriod'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        collapsed: true,
                        checkboxToggle: true,
                        layout: 'hbox',
                        title: '调整项目经理',
                        itemId: 'fieldset-captain',
                        defaults: {
                            flex: 1,
                            margin: 4
                        },
                        items: [
                            {
                                fieldLabel: '项目经理',
                                readOnly: true,
                                name: 'captain',
                                itemId: 'captain',
                                xtype: 'textfield',
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            userFilter: /^003-\d{3}$/i,
                                            callback: function (rec){
                                                var ct = cmp.ownerCt,
                                                    captainName = ct.getComponent('captainName');
                                                cmp.setValue(rec.get('realname'));
                                                captainName.setValue(rec.get('name'));
                                                win.close();
                                            }
                                        });
        
                                        win.show();
                                    }
                                }
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'captainName',
                                name: 'captainName'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        collapsed: true,
                        checkboxToggle: true,
                        layout: 'hbox',
                        title: '调整设计师',
                        defaults: {
                            flex: 1,
                            margin: 4
                        },
                        itemId: 'fieldset-designer',
                        items: [
                            {
                                fieldLabel: '设计师',
                                readOnly: true,
                                xtype: 'textfield',
                                name: 'designer',
                                itemId: 'designer',
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            userFilter: /^002-\d{3}$/i,
                                            callback: function (rec){
                                                var ct = cmp.ownerCt,
                                                    designerName = ct.getComponent('designerName');
                                                cmp.setValue(rec.get('realname'));
                                                designerName.setValue(rec.get('name'));
                                                win.close();
                                            }
                                        });
        
                                        win.show();
                                    }
                                }
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'designerName',
                                name: 'designerName'
                            }
                        ]
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){
                    var frm = me.down('form'),
                        content = frm.getComponent('content');
                    me.callback(content.getValue());
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