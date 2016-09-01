Ext.define('FamilyDecoration.view.suppliermanagement.SupplierMaterial', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.suppliermanagement-suppliermaterial',
    title: '材料',
    requires: [
        'FamilyDecoration.store.SupplierMaterial',
        'FamilyDecoration.view.suppliermanagement.EditSupplierMaterial'
    ],

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
                add: me.down('button[name="add"]'),
                edit: me.down('button[name="edit"]'),
                del: me.down('button[name="del"]'),
            };
        }

        function _initBtn(supplier) {
            var btnObj = _getBtns(),
                resObj = _getRes();
            btnObj.add.setDisabled(!supplier);
            btnObj.edit.setDisabled(!supplier || !resObj.material);
            btnObj.del.setDisabled(!supplier || !resObj.material);
        }

        function _initGrid(supplier) {
            var resObj = _getRes();
            if (supplier) {
                resObj.st.reload({
                    callback: function (recs, ope, success){
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

                    });
                    win.show();
                }
            },
            {
                text: '修改',
                name: 'edit',
                disabled: true,
                icon: 'resources/img/material_edit.png',
                handler: function () {

                }
            },
            {
                text: '删除',
                name: 'del',
                disabled: true,
                icon: 'resources/img/material_delete.png',
                handler: function () {

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
                    text: '序号'
                },
                {
                    text: '项目'
                },
                {
                    text: '数量'
                },
                {
                    text: '单位'
                },
                {
                    text: '单价(元)'
                }
            ]
        };

        this.callParent();
    }
});