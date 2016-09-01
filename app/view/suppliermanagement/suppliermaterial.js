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

        me.refresh = function (){

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
                icon: 'resources/img/material_add.png',
                handler: function (){
                    var win = Ext.create('FamilyDecoration.view.suppliermanagement.EditSupplierMaterial', {

                    });
                    win.show();
                }
            },
            {
                text: '修改',
                name: 'edit',
                icon: 'resources/img/material_edit.png',
                handler: function (){
                    
                }
            },
            {
                text: '删除',
                name: 'del',
                icon: 'resources/img/material_delete.png',
                handler: function (){
                    
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