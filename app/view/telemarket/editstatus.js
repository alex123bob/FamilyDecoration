Ext.define('FamilyDecoration.view.telemarket.EditStatus', {
    extend: 'Ext.window.Window',
    alias: 'widget.telemarket-editstatus',
    requires: [
        'FamilyDecoration.store.PotentialBusinessDetail'
    ],

    // resizable: false,
    modal: true,

    title: '添加扫楼状态',
    width: 500,
    height: 400,
    resizable: false,

    bodyPadding: 5,
    maximizable: true,
    business: undefined,
    grid: undefined,

    layout: 'vbox',

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                width: '100%',
                flex: 1,
                autoScroll: true,
                allowBlank: false,
                fieldLabel: '扫楼状态'
            },
            {
                title: '状态列表',
                xtype: 'gridpanel',
                width: '100%',
                flex: 2,
                autoScroll: true,
                cls: 'gridpanel-editstatus',
                collapsible: true,
                refresh: function (){
                    var grid = this,
                        st = grid.getStore();
                    st.load({
                        params: {
                            potentialBusinessId: me.business.getId()
                        }
                    });
                },
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            edit: function (editor, e) {
                                Ext.suspendLayouts();

                                e.record.commit();
                                editor.completeEdit();
                                if (e.field == 'comments') {
                                    ajaxUpdate('PotentialBusinessDetail', {
                                        comments: e.record.get('comments'),
                                        id: e.record.getId()
                                    }, 'id', function (obj){
                                        showMsg('更改成功！');
                                        e.record.store.reload();
                                    });
                                }

                                Ext.resumeLayouts();
                            },
                            validateedit: function (editor, e, opts) {
                                var rec = e.record;
                                if (e.field == 'comments') {
                                    if (e.value == e.originalValue) {
                                        return false;
                                    }
                                    else if (rec.get('committer') != User.getName()) {
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
                                    Ext.Msg.warning('确定要删除当前状态吗？', function (btnId) {
                                        if (btnId == 'yes') {
                                            var st = view.getStore(),
                                                rec = st.getAt(rowIndex),
                                                index = st.indexOf(rec);
                                            ajaxDel('PotentialBusinessDetail', {
                                                id: rec.getId()
                                            }, function (obj){
                                                showMsg('删除成功！');
                                                st.reload({
                                                    callback: function (recs, ope, success) {
                                                        if (success) {
                                                            var newRec = st.getAt(index);
                                                            if (newRec) {
                                                                view.getSelectionModel().select(newRec);
                                                                view.focusRow(newRec, 200);
                                                            }
                                                        }
                                                    }
                                                })
                                            });
                                        }
                                    });
                                }
                            }
                        ]
                    },
                    {
                        text: '内容',
                        dataIndex: 'comments',
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
                        text: '编辑人',
                        dataIndex: 'committerRealName'
                    }
                ],
                store: Ext.create('FamilyDecoration.store.PotentialBusinessDetail', {
                    
                })
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txtarea = me.down('textarea');
                    if (txtarea.isValid()) {
                        var params = {
                            comments: txtarea.getValue(),
                            committer: User.getName(),
                            potentialBusinessId: me.business.getId()
                        };
                        ajaxAdd('PotentialBusinessDetail', params, 
                            function (obj){
                                showMsg('添加成功！');
                                me.close();
                                me.grid.getStore().reload();
                            }
                        );
                    }
                }
            },
            {
                text: '关闭',
                handler: function () {
                    me.close();
                    me.grid.getStore().reload();
                }
            }
        ];

        me.listeners = {
            afterrender: function (win, opts){
                var grid = win.down('grid'),
                    st = grid.getStore();
                st.load({
                    params: {
                        potentialBusinessId: win.business.getId()
                    }
                })
            }
        }

        this.callParent();
    }
});