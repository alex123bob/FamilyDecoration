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
                cls: 'gridpanel-editprogress',
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
                                        id: e.record.getId(),
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
                                    Ext.Msg.warning('确定要删除当前' + (me.isComment ? '监理意见' : '工程进度') + '吗？', function (btnId) {
                                        if (btnId == 'yes') {
                                            var st = view.getStore(),
                                                rec = st.getAt(rowIndex),
                                                index = st.indexOf(rec);
                                            ajaxDel(me.isComment ? 'ProjectProgressAudit' : 'ProjectProgress', {
                                                id: rec.getId()
                                            }, function () {
                                                showMsg('删除成功！');
                                                me.isDirty = true;
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
                                                });
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
                        dataIndex: 'committer'
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
                            itemId: me.progress.getId(),
                            content: txtarea.getValue()
                        };
                        ajaxAdd(me.isComment ? 'ProjectProgressAudit' : 'ProjectProgress',
                            params,
                            function (obj) {
                                showMsg('添加成功！');
                                me.progressGrid.refresh();
                                me.close();
                            });
                    }
                }
            }, {
                text: '取消',
                handler: function () {
                    me.close();
                    if (me.isDirty) {
                        me.progressGrid.refresh();
                    }
                }
            },
            {
                text: '添加图片',
                hidden: true,
                handler: function () {
                    var win = Ext.create('FamilyDecoration.view.chart.UploadForm', {
                        url: './libs/upload_progress_pic.php',
                        afterUpload: function (fp, o) {

                        },
                        beforeUpload: function () {
                            // from an input element
                            var input = $(':file').get(0);
                            var filesToUpload = input.files;
                            var file = filesToUpload[0];
                        }
                    });

                    win.show();
                }
            }]

        this.callParent();
    }
});