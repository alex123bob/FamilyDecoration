Ext.define('FamilyDecoration.view.widgets.GridPanel', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.widgets-gridpanel',

	requires: ['Ext.ux.form.SearchField', 'Ext.form.ComboBox', 'FamilyDecoration.store.WorkCategory', 'Ext.grid.plugin.DragDrop'],

    canAutoLoad: true,
    backendSvc: null,
    canDelete: false,
    canEdit: false,
    canRefresh: true,
    onSelectionChange: null,
    addHandler: null,

	initComponent: function () {
		var me = this;

        if (me.backendSvc) {
            var st = Ext.create('FamilyDecoration.store.'+me.backendSvc, {
                autoLoad: me.canAutoLoad
            });
            me.store = st;
        }

        me.tools = me.tools || [];

        me.canRefresh && me.tools.push(
            {
                type: 'refresh',
                tooltip: '刷新当前应用',
                callback: function (){
                    me.store.reload();
                }
            }
        );


        // Create, Update
        if (me.canEdit) {
            me.bbar = me.bbar || [];
            me.bbar.push(
                {
                    text: '添加',
                    icon: './resources/img/flaticon-add.svg',
                    handler: function () {
                        var fields = me.store.model.getFields(),
                            valObj = {};
                        Ext.each(fields, function(field, index, self) {
                            valObj[field.name] = ''
                        });
                        me.store.add(
                            valObj
                        );
                    }
                }
            );

            me.plugins = me.plugins || [];

            me.plugins.push(
                Ext.create('Ext.grid.plugin.RowEditing', {
                    clicksToEdit: 2,
                    clicksToMoveEditor: 1,
                    listeners: {
                        edit: function (editor, e) {
                            var field = e.field,
                                rec = e.record,
                                newValues = e.newValues,
                                editorItems = editor.getEditor().items.items;
                            for (var pro in newValues) {
                                switch (newValues[pro] && newValues[pro].constructor) {
                                    case Date:
                                        var item = editorItems.find(function(el){
                                            return el.name === pro;
                                        });
                                        if (item.format) {
                                            newValues[pro] = Ext.Date.format(newValues[pro], 'Y-m-d');
                                        }
                                        break;
                                
                                    default:
                                        break;
                                }
                            }
                            if (rec.getId()) {
                                ajaxUpdate(me.backendSvc, Ext.apply(newValues, {
                                    id: rec.getId(),
                                }), ['id'], function () {
                                    showMsg('更新成功!');
                                    rec.commit();
                                });
                            }
                            else {
                                if (typeof me.addHandler === 'function') {
                                    me.addHandler(me.backendSvc, newValues, function (res) {
                                        showMsg('添加成功！');
                                        rec.setId(res.data.id);
                                        rec.commit();
                                    });
                                }
                                else {
                                    ajaxAdd(me.backendSvc, newValues, function (res) {
                                        showMsg('添加成功！');
                                        rec.setId(res.data.id);
                                        rec.commit();
                                    });
                                }
                            }
                        }
                    }
                })
            );

        }

        // Delete
        me.canDelete && me.columns.items.push({
            xtype: 'actioncolumn',
            editor: null,
            width: 25,
            flex: null,
            items: [
                {
                    icon: 'resources/img/flaticon-delete.svg',
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex) {
                        var st = grid.getStore();
                        var rec = st.getAt(rowIndex);
                        ajaxDel(me.backendSvc, {
                            id: rec.getId()
                        }, function () {
                            showMsg('已删除!');
                            st.reload();
                        });
                    }
                }
            ]
        });

        if (typeof me.onSelectionChange === 'function') {
            me.addListener('selectionchange', me.onSelectionChange);
        }

		me.callParent();
	}
});