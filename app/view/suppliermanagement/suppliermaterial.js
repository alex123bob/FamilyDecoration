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
                    dataIndex: 'id'
                },
                {
                    text: '项目',
                    dataIndex: 'name'
                },
                {
                    text: '数量',
                    dataIndex: 'amount'
                },
                {
                    text: '单位',
                    dataIndex: 'unit'
                },
                {
                    text: '单价(元)',
                    dataIndex: 'price'
                },
                {
                    text: '工种',
                    dataIndex: 'professionType',
                    renderer: function (val, meta, rec) {
                        if (val) {
                            return FamilyDecoration.store.WorkCategory.renderer(val);
                        }
                        else {
                            return '';
                        }
                    }
                }
            ]
        };

        this.callParent();
    }
});