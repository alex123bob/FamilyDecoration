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
    width: 500,
    height: 350,

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
                    type: 'SIMPLE'
                },
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
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '大小',
                        dataIndex: 'size',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '内容',
                        dataIndex: 'path',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '备注',
                        dataIndex: 'desc',
                        flex: 1,
                        align: 'center'
                    }
                ],
                listeners: {
                    cellclick: function (){

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
                            // var p = {},
                            //     content = '',
                            //     originalName = '',
                            //     details = o.result.details,
                            //     flag = ',';

                            // Ext.each(details, function (obj, i, arr) {
                            //     if (obj['success']) {
                            //         content += obj['file'] + flag;
                            //         originalName += obj['original_file_name'] + flag;
                            //     }
                            // });
                            // content = content.slice(0, parseInt('-' + flag.length, 10));
                            // originalName = originalName.slice(0, parseInt('-' + flag.length, 10));
                            certUpload.close();
                            me.getStore().reload();
                        }
                    });
                    certUpload.show();
                }
            },
            {
                text: '删除',
                handler: function () {
                    var grid = me;
                }
            }
        ]

        me.callParent();
    }
});