Ext.define('FamilyDecoration.view.materialrequest.MaterialOrderTemplate', {
    extend: 'Ext.window.Window',
    alias: 'widget.materialrequest-materialordertemplate',
    requires: [
        'FamilyDecoration.view.materialrequest.MaterialOrder',
        'FamilyDecoration.store.MaterialOrderTemplate',
        'FamilyDecoration.view.materialrequest.EditMaterialOrder'
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
    project: undefined,

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
                        var resObj = _getRes();
                        if (resObj.tpl) {
                            resObj.content.previewTemplate(resObj.tpl.getId());
                        }
                    }
                }
            },
            {
                xtype: 'materialrequest-materialorder',
                previewMode: true,
                flex: 4,
                itemId: 'templateContent',
                listeners: {
                    beforerender: function (ct){
                        var grid = ct.down('gridpanel'),
                            pagingtoolbar = grid.getDockedItems('[dock="bottom"]');

                        grid.removeDocked(pagingtoolbar[0]);
                    }
                }
            }
        ];

        me.buttons = [
            {
                text: '从模板创建',
                handler: function (){
                    var resObj = _getRes();
                    if (resObj.tpl) {
                        ajaxUpdate('SupplierOrderTemplate.template2Order', {
                            templateId: resObj.tpl.getId(),
                            projectId: me.project.getId()
                        }, 'templateId', function (obj){
                            showMsg('创建成功!');
                            var data = obj.data[0];
                            // var win = Ext.create('FamilyDecoration.view.materialrequest.EditMaterialOrder', {
                            //     project: me.project,
                            //     order: Ext.create('FamilyDecoration.model.MaterialOrderList', obj.data),
                            //     callback: function () {
                            //         var resObj = _getRes();
                            //         resObj.billRecPaneSt.reload({
                            //             callback: function (recs, ope, success) {
                            //                 if (success) {
                            //                     var index = resObj.billRecPaneSt.indexOf(resObj.billRec);
                            //                     if (-1 != index) {
                            //                         resObj.billRecPaneSelModel.deselectAll();
                            //                         resObj.billRecPaneSelModel.select(index);
                            //                     }
                            //                 }
                            //             }
                            //         });
                            //     }
                            // });
                            win.show();
                        }, true);
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