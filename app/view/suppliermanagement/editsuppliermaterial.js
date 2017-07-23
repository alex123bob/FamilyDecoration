Ext.define('FamilyDecoration.view.suppliermanagement.EditSupplierMaterial', {
    extend: 'Ext.window.Window',
    alias: 'widget.suppliermanagement-editsuppliermaterial',
    requires: [
        'FamilyDecoration.store.SupplierMaterial',
        'FamilyDecoration.store.WorkCategory'
    ],
    modal: true,
    title: '编辑供应商材料',
    width: 600,
    height: 400,
    bodyPadding: 5,
    maximizable: true,
    layout: 'fit',
    closable: false,

    supplier: undefined,
    callback: Ext.emptyFn,
    isDirty: false,

    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.SupplierMaterial', {
                autoLoad: false,
                proxy: {
                    url: './libs/api.php',
                    type: 'rest',
                    extraParams: {
                        action: 'SupplierMaterial.get',
                        supplierId: me.supplier.getId()
                    },
                    reader: {
                        type: 'json',
                        root: 'data',
                        totalProperty: 'total'
                    }
                }
            });
        
        /**
         * returns polished html font tag by passing operational type and displayed content.
         * @param {*Object} obj includes type and content
         */
        function fontalize (obj){
            var colorMap = {
                add: 'green',
                update: 'rgb(0, 166, 228)',
                delete: 'rgb(255, 76, 76)'
            };
            return '<font style="color:' + colorMap[obj.type] + '">' + obj.content + '</font>';
        }

        me.refresh = function () {
            var grid = this.down('gridpanel'),
                st = grid.getStore(),
                selModel = grid.getSelectionModel(),
                selRec = selModel.getSelection()[0],
                index = st.indexOf(selRec);
            st.reload({
                callback: function (recs, ope, success) {
                    if (success) {
                        if (index != -1) {
                            selModel.deselectAll();
                            selModel.select(index);
                        }
                    }
                }
            });
        };

        me.tbar = [
            {
                text: '添加',
                name: 'add',
                icon: 'resources/img/add.png',
                handler: function () {
                    var grid = me.down('gridpanel'),
                        st = grid.getStore(),
                        content = {
                            supplierId: me.supplier.getId(),
                            price: 0
                        };

                    User.isSupplier() ? ajaxAdd('SupplierMaterialAudit.addMaterial', content, function(){
                        showMsg('申请添加材料已提交，请等待审批！');
                        me.refresh();
                        me.isDirty = true;
                    }, Ext.emptyFn, true) : ajaxAdd('SupplierMaterial', content, function (obj) {
                        showMsg('添加成功！');
                        me.refresh();
                        me.isDirty = true;
                    });
                }
            }
        ];

        function materialRenderer (val, rec, dataIndex){
            if (rec.get(dataIndex)) {
                return fontalize({
                    type: rec.get('auditOperation'),
                    content: rec.get(dataIndex)
                });
            }
            else {
                return val;
            }
        }

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                store: st,
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: st,
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            beforeedit: function (editor, e, opts){
                                var field = e.field,
                                    rec = e.record;
                                field = field.charAt(0).toUpperCase() + field.slice(1);
                                if (rec.get('auditOperation') && rec.get('audit' + field)) {
                                    e.value = rec.get('audit' + field);
                                }
                            },
                            edit: function (editor, e) {
                                Ext.suspendLayouts();

                                e.record.commit();
                                editor.completeEdit();

                                var updateObj = User.isSupplier() ? {
                                    materialId: e.record.getId()
                                } :{
                                    id: e.record.getId()
                                };
                                updateObj[e.field] = e.value;
                                User.isSupplier() ? ajaxUpdate('SupplierMaterialAudit.updateMaterial', updateObj, 'materialId', function(obj) {
                                    showMsg('申请材料修改已提交，请等待审批！更新的材料值请在关闭本窗口或刷新表格后看到!');
                                    me.isDirty = true;
                                }, true) : ajaxUpdate('SupplierMaterial', updateObj, 'id', function (obj) {
                                    showMsg('更新成功！');
                                    me.isDirty = true;
                                    // me.refresh();
                                });

                                Ext.resumeLayouts();
                            },
                            validateedit: function (editor, e, opts) {
                                var rec = e.record;
                                if ( e.field == 'amount' || e.field == 'referenceNumber' || e.field == 'price') {
                                    if (isNaN(e.value) || !/^-?\d+(\.\d+)?$/.test(e.value) || e.value == e.originalValue) {
                                        return false;
                                    }
                                }
                                else if (e.field == 'name' || e.field == 'unit' || e.field == 'professionType') {
                                    if (e.value == e.originalValue) {
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
                                    var rec = grid.getStore().getAt(rowIndex);
                                    Ext.Msg.warning('确定要删除当前材料吗？', function (btnId) {
                                        if ('yes' == btnId) {
                                            User.isSupplier() ? ajaxDel('SupplierMaterialAudit.deleteMaterial', {
                                                materialId: rec.getId()
                                            }, function (obj){
                                                showMsg('申请删除材料已提交');
                                                me.refresh();
                                                me.isDirty = true;
                                            }, true) : ajaxDel('SupplierMaterial', {
                                                id: rec.getId()
                                            }, function (obj) {
                                                showMsg('删除成功！');
                                                me.refresh();
                                                me.isDirty = true;
                                            });
                                        }
                                    });
                                }
                            }
                        ]
                    },
                    {
                        text: '序号',
                        dataIndex: 'id',
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
                        align: 'center',
                        renderer: function (val, meta, rec){
                            return materialRenderer(val, rec, 'auditName');
                        }
                    },
                    {
                        text: '单位',
                        dataIndex: 'unit',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec){
                            return materialRenderer(val, rec, 'auditUnit');
                        }
                    },
                    {
                        text: '数量',
                        dataIndex: 'amount',
                        editor: {
                            xtype: 'numberfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center',
                        hidden: true // hide amount temporarily, coz we don't know the amount of specific material of one supplier'
                    },
                    {
                        text: '参考量',
                        dataIndex: 'referenceNumber',
                        flex: 1,
                        align: 'center'
                    },
                    {
                        text: '单价(元)',
                        dataIndex: 'price',
                        editor: {
                            xtype: 'numberfield',
                            allowBlank: false
                        },
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec){
                            return materialRenderer(val, rec, 'auditPrice');
                        }
                    },
                    {
                        text: '工种',
                        dataIndex: 'professionType',
                        editor: {
                            xtype: 'combobox',
                            editable: false,
                            allowBlank: false,
                            store: FamilyDecoration.store.WorkCategory,
                            displayField: 'name',
                            valueField: 'value'
                        },
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec) {
                            var content;
                            if (rec.get('auditProfessionType')) {
                                content = FamilyDecoration.store.WorkCategory.renderer(rec.get('auditProfessionType'));
                                return fontalize({
                                    type: rec.get('auditOperation'),
                                    content: content
                                });
                            }
                            else if (val) {
                                return FamilyDecoration.store.WorkCategory.renderer(val);
                            }
                            else {
                                return '';
                            }
                        }
                    },
                    {
                        text: '状态',
                        dataIndex: 'auditApproved',
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec){
                            var operationObj = {
                                add: fontalize({type: 'add', content: '申请添加'}),
                                update: fontalize({type: 'update', content: '申请修改'}),
                                delete: fontalize({type: 'delete', content: '申请删除'})
                            };
                            if (val && 'false' == val) {
                                return operationObj[rec.get('auditOperation')];
                            }
                            else {
                                return '';
                            }
                        }
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '关闭',
                handler: function () {
                    me.close();
                    if (me.isDirty) {
                        me.callback();
                    }
                }
            }
        ];

        me.addListener({
            show: function (win, opts) {
                win.refresh();
            }
        });

        this.callParent();
    }
});