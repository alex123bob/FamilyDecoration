Ext.define('FamilyDecoration.view.materialrequest.MaterialOrderTemplate', {
    extend: 'Ext.window.Window',
    alias: 'widget.materialrequest-materialordertemplate',
    requires: [
        'FamilyDecoration.view.materialrequest.MaterialOrder'
    ],
    layout: 'hbox',
    title: '订单模板',
    defaults: {
        height: '100%'
    },
    maximizable: true,
    width: 500,
    height: 300,
    modal: true,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'gridpanel',
                flex: 1,
                style: {
                    borderRight: '1px solid #999999'
                },
                columns: {
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            text: '模版名称'
                        }
                    ]
                }
            },
            {
                xtype: 'materialrequest-materialorder',
                previewMode: true,
                flex: 4
            }
        ];

        this.callParent();
    }
});