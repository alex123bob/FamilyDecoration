Ext.define('FamilyDecoration.view.paymentrequest.AttachmentManagement', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymentrequest-attachmentmanagement',
    layout: 'fit',
    title: '附件管理',
    modal: true,
    requires: [
        'FamilyDecoration.view.chart.UploadForm',
        'FamilyDecoration.store.AttachmentManagement'
    ],
    width: 650,
    height: 350,
    maximizable: true,

    infoObj: undefined, // refType, refId

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'gridpanel',
                selType: 'checkboxmodel',
                store: Ext.create('FamilyDecoration.store.AttachmentManagement', {
                    autoLoad: true,
                    proxy: {
                        url: './libs/api.php',
                        type: 'rest',
                        reader: {
                            type: 'json',
                            root: 'data'
                        },
                        extraParams: {
                            refType: me.infoObj.refType,
                            refId: me.infoObj.refId,
                            action: 'UploadFiles.get'
                        }
                    }
                }),
                selModel: {
                    mode: 'SIMPLE'
                },
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            edit: function (editor, e) {
                                Ext.suspendLayouts();

                                e.record.commit();
                                editor.completeEdit();
                                if (e.field == 'desc') {
                                    ajaxUpdate('UploadFiles', {
                                        desc: e.record.get('desc'),
                                        id: e.record.getId()
                                    }, 'id', function (obj){
                                        showMsg('更新成功！');
                                        var grid = me.down('gridpanel');
                                        grid.getStore().reload();
                                    });
                                }

                                Ext.resumeLayouts();
                            },
                            validateedit: function (editor, e, opts) {
                                var rec = e.record;
                                if (e.field == 'desc') {
                                }
                            }
                        }
                    })
                ],
                columns: [
                    {
                        text: '名字',
                        dataIndex: 'name',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '时间',
                        dataIndex: 'createTime',
                        flex: 2,
                        align: 'center'
                    },
                    {
                        text: '大小',
                        dataIndex: 'size',
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec) {
                            if (val) {
                                val = (val >> 10) + 'KB';
                            }
                            return val;
                        }
                    },
                    {
                        text: '内容',
                        dataIndex: 'path',
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec) {
                            var img = '';
                            if (val) {
                                img = '<img width="20" height="20" src="' + val + '" />';
                            }
                            return img;
                        }
                    },
                    {
                        text: '备注',
                        dataIndex: 'desc',
                        flex: 1,
                        align: 'center',
                        editor: {
                            xtype: 'textfield'
                        }
                    },
                    {
                        text: '其他',
                        dataIndex: 'other',
                        flex: 1,
                        align: 'center'
                    }
                ],
                listeners: {
                    cellclick: function (view, td, cellIndex, rec, tr, rowIndex, e, opts) {
                        if (cellIndex == 4) {
                            var arr = rec.get('other').split('x'),
                                w, h, portion;
                            arr[0].trim();
                            arr[1].trim();
                            w = parseInt(arr[0], 10);
                            h = parseInt(arr[1], 10);
                            portion = w / h;
                            w = 500;
                            h = 500 / portion;
                            var win = Ext.create('Ext.window.Window', {
                                layout: 'fit',
                                title: rec.get('name'),
                                width: w,
                                height: h,
                                modal: true,
                                autoScroll: true,
                                maximizable: true,
                                items: [
                                    {
                                        xtype: 'image',
                                        src: rec.get('path')
                                    }
                                ]
                            });
                            win.show();
                            win.focus();
                        }
                    }
                }
            }
        ];

        me.buttons = [
            {
                text: '上传',
                handler: function () {
                    var certUpload = Ext.create('FamilyDecoration.view.chart.UploadForm', {
                        title: '附件上传',
                        typeArray: ['image/jpg', 'image/jpeg'],
                        url: './libs/upload_pic.php',
                        supportMult: true,
                        extraParams: {
                            refType: me.infoObj.refType,
                            refId: me.infoObj.refId,
                            desc: ''
                        },
                        afterUpload: function (fp, o) {
                            certUpload.close();
                            showMsg('上传成功！');
                            me.down('gridpanel').getStore().reload();
                        }
                    });
                    certUpload.show();
                }
            },
            {
                text: '删除',
                handler: function () {
                    var grid = me.down('gridpanel'),
                        selModel = grid.getSelectionModel(),
                        recs = selModel.getSelection();
                    if (recs.length > 0) {
                        Ext.Msg.warning('确定要删除选中附件吗？', function (btnId) {
                            if ('yes' == btnId) {
                                for (var i = 0; i < recs.length; i++) {
                                    var rec = recs[i];
                                    ajaxDel('UploadFiles', {
                                        id: rec.getId()
                                    }, function (obj) {
                                        showMsg('删除成功！');
                                        grid.getStore().reload();
                                    });
                                }
                            }
                        });
                    }
                    else {
                        showMsg('请选择要删除的文件！');
                    }
                }
            }
        ]

        me.callParent();
    }
});