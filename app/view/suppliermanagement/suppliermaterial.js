Ext.define('FamilyDecoration.view.suppliermanagement.SupplierMaterial', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.suppliermanagement-suppliermaterial',
    title: '材料',
    requires: [
        'FamilyDecoration.store.SupplierMaterial',
        'FamilyDecoration.view.suppliermanagement.EditSupplierMaterial',
        'FamilyDecoration.store.WorkCategory'
    ],
    supplier: undefined,

    initComponent: function () {
        var me = this;

        var st = Ext.create('FamilyDecoration.store.SupplierMaterial', {
            autoLoad: false
        });

        function _getRes() {
            var st = me.getStore(),
                selModel = me.getSelectionModel(),
                material = selModel.getSelection()[0];
            return {
                st: st,
                selModel: selModel,
                material: material
            };
        }

        function _getBtns() {
            return {
                add: me.down('button[name="add"]')
            };
        }

        function _initBtn(supplier) {
            var btnObj = _getBtns(),
                resObj = _getRes();
            btnObj.add.setDisabled(!supplier);
        }

        function _initGrid(supplier) {
            var resObj = _getRes();
            if (supplier) {
                var proxy = resObj.st.getProxy();
                proxy.extraParams.supplierId = supplier.getId();
                resObj.st.setProxy(proxy);
                resObj.st.loadPage(1, {
                    callback: function (recs, ope, success) {
                        if (success) {
                            var index = resObj.st.indexOf(resObj.material);
                            resObj.selModel.deselectAll();
                            if (-1 != index) {
                                resObj.selModel.select(index);
                            }
                        }
                    }
                });
            }
            else {
                resObj.st.removeAll();
            }
        }

        me.refresh = function (supplier) {
            me.supplier = supplier;
            _initBtn(supplier);
            _initGrid(supplier);
        };

        me.store = st;

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: st,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.tbar = [
            {
                text: '添加',
                name: 'add',
                disabled: true,
                icon: 'resources/img/material_add.png',
                handler: function () {
                    var win = Ext.create('FamilyDecoration.view.suppliermanagement.EditSupplierMaterial', {
                        supplier: me.supplier,
                        callback: function (){
                            me.refresh(me.supplier);
                        }
                    });
                    win.show();
                }
            }
        ];

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    text: '序号',
                    dataIndex: 'id',
                    renderer: function (val, meta, rec) {
                        return renderId(val, meta, rec);
                    }
                },
                {
                    text: '项目',
                    dataIndex: 'name',
                    renderer: function (val, meta, rec) {
                        return renderAudit(val, meta, rec, 'Name');
                    }
                },
                {
                    text: '数量',
                    dataIndex: 'amount',
                    hidden: true // hide amount temporarily, coz we don't know the amount of specific material of one supplier
                },
                {
                    text: '单位',
                    dataIndex: 'unit',
                    renderer: function (val, meta, rec) {
                        return renderAudit(val, meta, rec, 'Unit');
                    }
                },
                {
                    text: '单价(元)',
                    dataIndex: 'price',
                    renderer: function (val, meta, rec) {
                        return renderAudit(val, meta, rec, 'Price');
                    }
                },
                {
                    text: '工种',
                    dataIndex: 'professionType',
                    renderer: function (val, meta, rec) {
                        return renderAudit(val, meta, rec, 'ProfessionType');
                    }
                },
                {
                    xtype: 'actioncolumn',
                    hidden: User.isSupplier(),
                    width: 50,
                    text: '操作',
                    items: [
                        {
                            icon: 'resources/img/supplier_material_approve.png',
                            tooltip: '批准材料改动申请',
                            isDisabled: function (view, rowIndex, colIndex, item, rec){
                                return !rec.get('auditOperation');
                            },
                            handler: function (grid, rowIndex, colIndex){
                                var rec = grid.getStore().getAt(rowIndex);
                                Ext.Msg.warning('确定要批准当前材料改动吗？', function(btnId) {
                                    if ('yes' == btnId) {
                                        ajaxUpdate('SupplierMaterialAudit.passUpdateMaterialRequest', {
                                            id: rec.get('auditId')
                                        }, 'id', function(obj) {
                                            showMsg('批准材料改动成功!');
                                            me.refresh(me.supplier);
                                        }, true);
                                    }
                                });
                            }
                        },
                        {
                            icon: 'resources/img/supplier_material_disapprove.png',
                            tooltip: '拒绝材料改动申请',
                            isDisabled: function (view, rowIndex, colIndex, item, rec){
                                return !rec.get('auditOperation');
                            },
                            handler: function (grid, rowIndex, colIndex){
                                var rec = grid.getStore().getAt(rowIndex);
                                Ext.Msg.warning('确定要拒绝当前材料改动吗？', function(btnId) {
                                    if ('yes' == btnId) {
                                        ajaxUpdate('SupplierMaterialAudit.revertUpdateMaterial', {
                                            id: rec.get('auditId')
                                        }, 'id', function(obj) {
                                            showMsg('材料变动申请已否决!');
                                            me.refresh(me.supplier);
                                        }, true);
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        };

        function fontalize (obj){
            return '<font style="color:' + obj.color + '">' + obj.content + '</font>';
        }

        function renderAudit(val, meta, rec, index) {
            var newValue = rec.data['audit' + index];
            var color = {
                'add':'green',
                'delete':'rgb(255, 76, 76)',
                'update':'rgb(0, 166, 228)'
            }[rec.data.auditOperation] || '';
            var concatIcon = '&nbsp;<img src="resources/img/supplier_material_arrow_right.png" />&nbsp;';

            val = val === null ? '' : val;
            newValue = newValue === null ? '' : newValue;

            if(index === 'ProfessionType') {
                val = FamilyDecoration.store.WorkCategory.renderer(val);
                newValue = FamilyDecoration.store.WorkCategory.renderer(newValue);
            }
            if(!newValue) {
                concatIcon = '';
            }
            if(rec.data.auditOperation == 'delete'){
                newValue = '';
                concatIcon = '';
            }
            if(rec.data.auditOperation == 'add'){
                val = newValue;
                newValue = '';
                concatIcon = '';
            }
            if(color){
                return fontalize({
                    color: color,
                    content: val + concatIcon + newValue
                });
            }
            return val;
        }
        function renderId(val, meta, rec) {
            var newValue = rec.data['auditId'];
            var color = {
                'add':'green',
                'delete':'rgb(255, 76, 76);',
                'update':'rgb(0, 166, 228)'
            }[rec.data.auditOperation] || '';
            newValue = {
                'add': '<img src="resources/img/supplier_material_add.png" alt="添加" />&nbsp;&nbsp;',
                'delete': '<img src="resources/img/supplier_material_delete.png" alt="删除" />&nbsp;&nbsp;',
                'update': '<img src="resources/img/supplier_material_update.png" alt="修改" />&nbsp;&nbsp;'
            }[rec.data.auditOperation] || '';
            return newValue + val;
        }

        this.callParent();
    }
});