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
    material: undefined,

    initComponent: function () {
        var me = this;

        me.setTitle(me.material ? '编辑材料项目' : '添加材料项目');

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
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 25,
                        items: [
                            {
                                icon: 'resources/img/delete.png',
                                tooltip: '删除',
                                handler: function (grid, rowIndex, colIndex) {
                                    var st = grid.getStore(),
                                        rec = st.getAt(rowIndex);
                                }
                            }
                        ]
                    },
                    {
                        text: '序号',
                        dataIndex: 'serialNumber',
                        flex: 0.7,
                        align: 'center'
                    },
                    {
                        text: '项目',
                        dataIndex: 'name',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '单位',
                        dataIndex: 'unit',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '数量',
                        dataIndex: 'amount',
                        editor: {
                            xtype: 'numberfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '参考量',
                        dataIndex: 'referenceNumber',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '单价(元)',
                        dataIndex: 'unitPrice',
                        editor: {
                            xtype: 'numberfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center'
                    }
                ]
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