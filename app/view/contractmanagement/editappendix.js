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
    isEdit: false,

    initComponent: function () {
        var me = this;

        me.setTitle(me.appendix ? '编辑附加条款' : '添加附加条款');

        function _getRes (){
            var frm = me.down('form'),
                content = frm.getComponent('content'),
                projectPeriodFst = frm.getComponent('fieldset-projectPeriod'),
                startTime = projectPeriodFst.getComponent('startTime'),
                endTime = projectPeriodFst.getComponent('endTime'),
                captainFst = frm.getComponent('fieldset-captain'),
                captain = captainFst.getComponent('captain'),
                captainName = captainFst.getComponent('captainName'),
                designerFst = frm.getComponent('fieldset-designer'),
                designer = designerFst.getComponent('designer'),
                designerName = designerFst.getComponent('designerName');

            return {
                content: content,
                projectPeriodFst: projectPeriodFst,
                startTime: startTime,
                endTime: endTime,
                captainFst: captainFst,
                captain: captain,
                captainName: captainName,
                designerFst: designerFst,
                designer: designer,
                designerName: designerName
            };
        }

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
                        allowBlank: false
                    },
                    {
                        checkboxToggle: true,
                        xtype: 'fieldset',
                        collapsed: true,
                        layout: 'hbox',
                        title: '调整工期',
                        itemId: 'fieldset-projectPeriod',
                        disabled: !me.isEdit,
                        defaults: {
                            flex: 1,
                            margin: 4,
                            allowBlank: false
                        },
                        items: [
                            {
                                fieldLabel: '开始',
                                xtype: 'datefield',
                                name: 'startTime',
                                itemId: 'startTime',
                                submitFormat: 'Y-m-d',
                                format: 'Y-m-d'
                            },
                            {
                                fieldLabel: '结束',
                                xtype: 'datefield',
                                name: 'endTime',
                                itemId: 'endTime',
                                submitFormat: 'Y-m-d',
                                format: 'Y-m-d'
                            }
                        ],
                        listeners: {
                            expand: function (fst){
                                var resObj = _getRes();
                                resObj.captainFst.collapse();
                                resObj.designerFst.collapse();
                            }
                        }
                    },
                    {
                        xtype: 'fieldset',
                        collapsed: true,
                        checkboxToggle: true,
                        layout: 'hbox',
                        title: '调整项目经理',
                        itemId: 'fieldset-captain',
                        disabled: !me.isEdit,
                        defaults: {
                            flex: 1,
                            margin: 4,
                            allowBlank: false
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
                                                var resObj = _getRes();
                                                cmp.setValue(rec.get('realname'));
                                                resObj.captainName.setValue(rec.get('name'));
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
                        ],
                        listeners: {
                            expand: function (fst){
                                var resObj = _getRes();
                                resObj.projectPeriodFst.collapse();
                                resObj.designerFst.collapse();
                            }
                        }
                    },
                    {
                        xtype: 'fieldset',
                        collapsed: true,
                        checkboxToggle: true,
                        layout: 'hbox',
                        title: '调整设计师',
                        disabled: !me.isEdit,
                        defaults: {
                            flex: 1,
                            margin: 4,
                            allowBlank: false
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
                                                var resObj = _getRes();
                                                cmp.setValue(rec.get('realname'));
                                                resObj.designerName.setValue(rec.get('name'));
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
                        ],
                        listeners: {
                            expand: function (fst){
                                var resObj = _getRes();
                                resObj.projectPeriodFst.collapse();
                                resObj.captainFst.collapse();
                            }
                        }
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){
                    var resObj = _getRes(),
                        str = '';
                    if (resObj.content.isValid()) {
                        if (!resObj.projectPeriodFst.collapsed) {
                            if (resObj.startTime.isValid() && resObj.endTime.isValid()) {
                                if (resObj.startTime.getValue() > resObj.endTime.getValue()) {
                                    showMsg('开始时间不能晚于结束时间');
                                }
                                else {
                                    str = '调整项目工期，项目工期时间为：' + Ext.Date.format(resObj.startTime.getValue(), 'Y-m-d') + '~' + Ext.Date.format(resObj.endTime.getValue(), 'Y-m-d') + '，更改原因：' + resObj.content.getValue();
                                }
                            }
                        }
                        else if (!resObj.captainFst.collapsed) {
                            if (resObj.captain.isValid()) {
                                str = '调整项目经理，新项目经理为：' + resObj.captain.getValue() + '，调整原因：' + resObj.content.getValue();
                            }
                        }
                        else if (!resObj.designerFst.collapsed) {
                            if (resObj.designer.isValid()) {
                                str = '调整设计师，新设计师为：' + resObj.designer.getValue() + '，调整原因：' + resObj.content.getValue();
                            }
                        }
                        else {
                            str = resObj.content.getValue();
                        }
                        me.callback(str);
                    }
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