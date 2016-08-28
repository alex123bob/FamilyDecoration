Ext.define('FamilyDecoration.view.suppliermanagement.EditSupplierMaterial', {
    extend: 'Ext.window.Window',
    alias: 'widget.suppliermanagement-editsuppliermaterial',
    requires: [
        'FamilyDecoration.store.SupplierMaterial'
    ],
    modal: true,
    title: '材料项目添加',
    width: 500,
    height: 400,
    bodyPadding: 5,
    maximizable: true,
    layout: 'fit',

    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                text: '添加',
                name: 'add',
                icon: 'resources/img/add.png',
                handler: function () {
                    var grid = me.down('gridpanel'),
                        st = grid.getStore();
                    st.add({
                        name: ''
                    });
                }
            }
        ];

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                store: Ext.create('FamilyDecoration.store.SupplierMaterial', {
                    autoLoad: false
                }),
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            edit: function (editor, e) {
                                Ext.suspendLayouts();

                                e.record.commit();
                                editor.completeEdit();

                                Ext.resumeLayouts();
                            },
                            validateedit: function (editor, e, opts) {
                                var rec = e.record;
                                if (e.field == 'amount' || e.field == 'referenceNumber' || e.field == 'unitPrice') {
                                    if (isNaN(e.value) || !/^-?\d+(\.\d+)?$/.test(e.value)) {
                                        return false;
                                    }
                                    else if (e.value == e.originalValue) {
                                        return false;
                                    }
                                }
                            }
                        }
                    })
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '序号',
                            dataIndex: 'serialNumber'
                        },
                        {
                            text: '项目',
                            dataIndex: 'name',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '单位',
                            dataIndex: 'unit',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '数量',
                            dataIndex: 'amount',
                            editor: {
                                xtype: 'numberfield',
                                allowBlank: false
                            }
                        },
                        {
                            text: '参考量',
                            dataIndex: 'referenceNumber'
                        },
                        {
                            text: '单价(元)',
                            dataIndex: 'unitPrice',
                            editor: {
                                xtype: 'numberfield',
                                allowBlank: false
                            }
                        }
                    ]
                }
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