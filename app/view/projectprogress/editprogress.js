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

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                width: '100%',
                flex: 4,
                autoScroll: true,
                allowBlank: false,
                fieldLabel: '工程进度',
                value: me.progress ? me.progress.get('progress') : ''
            },
            {
                xtype: 'combobox',
                width: '100%',
                flex: 1,
                displayField: 'parentItemName',
                editable: false,
                valueField: 'id',
                fieldLabel: '对应大项'
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {

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