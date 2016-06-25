Ext.define('FamilyDecoration.view.projectprogress.EditProgress', {
    extend: 'Ext.window.Window',
    alias: 'widget.projectprogress-editprogress',
    requires: [

    ],

    // resizable: false,
    modal: true,

    title: '添加工程进度',
    width: 400,
    height: 240,
    resizable: false,
    
    project: null,
    progress: null,
    progressGrid: null,
    bodyPadding: 5,

    layout: 'vbox',
    isComment: false,

    initComponent: function () {
        var me = this;

        me.title = me.isComment ? '添加监理意见' : '添加工程进度';

        me.items = [
            {
                xtype: 'textarea',
                width: '100%',
                flex: 1,
                autoScroll: true,
                allowBlank: false,
                fieldLabel: me.isComment ? '监理意见' : '工程进度'
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txtarea = me.down('textarea');
                    if (txtarea.isValid()) {
                        var msg = me.isComment ? '确定要添加此监理意见吗？添加后不可更改。' : '确定需要添加进度吗？添加之后不可更改。';
                        Ext.Msg.warning(msg, function (btnId){
                            if ('yes' == btnId) {
                                var params = {
                                    itemId: me.progress.getId(),
                                    content: txtarea.getValue()
                                };
                                ajaxAdd(me.isComment ? 'ProjectProgressAudit' : 'ProjectProgress', params, function (obj){
                                    showMsg('添加成功！');
                                    me.progressGrid.refresh();
                                    me.close();
                                });
                            }
                        });
                    }
                }
            }, {
                text: '取消',
                handler: function () {
                    me.close();
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