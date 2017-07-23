Ext.define('FamilyDecoration.view.materialrequest.MaterialOrderTemplate', {
    extend: 'Ext.window.Window',
    alias: 'widget.materialrequest-materialordertemplate',
    requires: [
        'FamilyDecoration.view.materialrequest.MaterialOrder',
        'FamilyDecoration.store.MaterialOrderTemplate'
    ],
    layout: 'hbox',
    title: '订单模板',
    defaults: {
        height: '100%'
    },
    maximizable: true,
    width: 600,
    height: 400,
    modal: true,
    initComponent: function () {
        var me = this;

        function _getRes (){
            var list = me.getComponent('templateList'),
                content = me.getComponent('templateContent'),
                listSelModel = list.getSelectionModel(),
                tpl = listSelModel.getSelection()[0];

            return {
                list: list,
                listSelModel: listSelModel,
                tpl: tpl,
                content: content
            };
        }

        me.items = [
            {
                xtype: 'gridpanel',
                flex: 1,
                itemId: 'templateList',
                style: {
                    borderRight: '1px solid #999999'
                },
                autoScroll: true,
                store: Ext.create('FamilyDecoration.store.MaterialOrderTemplate', {
                    autoLoad: true
                }),
                hideHeaders: true,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '模版名称',
                            dataIndex: 'templateName'
                        }
                    ]
                },
                listeners: {
                    selectionchange: function (selModel, sels, opts){
                        
                    }
                }
            },
            {
                xtype: 'materialrequest-materialorder',
                previewMode: true,
                flex: 4,
                itemId: 'templateContent'
            }
        ];

        me.buttons = [
            {
                text: '从模板创建',
                handler: function (){
                    var resObj = _getRes();
                    if (resObj.tpl) {

                    }
                }
            },
            {
                text: '关闭',
                handler: function (){
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});