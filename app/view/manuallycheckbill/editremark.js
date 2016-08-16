Ext.define('FamilyDecoration.view.manuallycheckbill.EditRemark', {
    extend: 'Ext.window.Window',
    alias: 'widget.manuallycheckbill-editremark',
    requires: [

    ],
    modal: true,
    title: '编辑备注',
    width: 500,
    height: 400,
    resizable: false,
    bodyPadding: 5,
    closable: false,
    maximizable: true,

    layout: 'vbox',
    isDirty: false, // field to judge if current window has done several back interaction operation.

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                width: '100%',
                flex: 1,
                autoScroll: true,
                allowBlank: false,
                fieldLabel: '评论'
            },
            {
                title: '评论列表',
                xtype: 'gridpanel',
                width: '100%',
                flex: 2,
                autoScroll: true,
                cls: 'gridpanel-editbillitemremark',
                collapsible: true,
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            edit: function (editor, e) {
                                Ext.suspendLayouts();

                                e.record.commit();
                                editor.completeEdit();
                                if (e.field == 'content') {
                                    ajaxUpdate(me.isComment ? 'ProjectProgressAudit' : 'ProjectProgress', {
                                        content: e.record.get('content'),
                                        id: e.record.getId()
                                    }, 'id', function (obj) {
                                        showMsg('编辑成功！');
                                        e.record.store.reload();
                                        me.isDirty = true;
                                    });
                                }

                                Ext.resumeLayouts();
                            },
                            validateedit: function (editor, e, opts) {
                                var rec = e.record;
                                if (e.field == 'content') {
                                    if (e.value == e.originalValue) {
                                        return false;
                                    }
                                    else if (me.isComment && rec.get('auditor') != User.getName()) {
                                        showMsg('不允许编辑非本人填写的信息！');
                                        return false;
                                    }
                                    else if (!me.isComment && rec.get('committer') != User.getName()) {
                                        showMsg('不允许编辑非本人填写的信息！');
                                        return false;
                                    }
                                }
                            }
                        }
                    })
                ],
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [
                            {
                                icon: 'resources/img/delete_for_action_column.png',
                                tooltip: '删除',
                                handler: function (view, rowIndex, colIndex) {
                                }
                            }
                        ]
                    },
                    {
                        text: '内容',
                        dataIndex: 'content',
                        flex: 2,
                        editor: {
                            xtype: 'textarea',
                            autoScroll: true,
                            allowBlank: false
                        },
                        renderer: function (val, meta, rec) {
                            return val.replace(/\n/ig, '<br />');
                        }
                    },
                    {
                        text: '评论人'
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {

                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});