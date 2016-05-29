Ext.define('FamilyDecoration.view.checkbillitem.AddCheckBillItem', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.checkbillitem-addcheckbillitem',
	requires: [
		'FamilyDecoration.store.StatementBasicItem',
		'FamilyDecoration.view.checkbillitem.PickBasicItemWithSameType'
	],
	title: '项目',
	autoScroll: true,

	isEditable: false,
	workCategory: undefined,

	initComponent: function (){
		var me = this;

		if (me.isEditable) {
			me.selType = 'cellmodel';
		    me.plugins = [
		        Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1,
		            listeners: {
		            	edit: function (editor, e){
		            		e.record.commit();
		            		editor.completeEdit();
		            	},
		            	validateedit: function (editor, e, opts){
		            		var rec = e.record;
		            		if (e.field == 'referenceNumber' || e.field == 'unitPrice') {
		            			if (isNaN(e.value) || !/^-?\d+(\.\d+)?$/.test(e.value) ){
			            			return false;
			            		}
		            		}
		            	}
		            }
		        })
		    ];
		    me.tbar = [
		    	{
		    		text: '添加',
		    		icon: 'resources/img/add1.png',
		    		handler: function (){
		    			var rec = Ext.create('FamilyDecoration.model.StatementBasicItem'),
		    				grid = me,
		    				st = grid.getStore();
		    			st.add(rec);
		    		}
		    	}
		    ];
		}

		me.refresh = function (){
			var grid = me,
				st = grid.getStore();
			if (me.workCategory) {
				st.load({
					params: {
						professionType: me.workCategory
					}
				});
			}
			else {
				st.removeAll();
			}
		}

		me.columns = {
			defaults: {
				align: 'center'
			},
			items: [
				{
					hidden: me.isEditable ? false : true,
					xtype: 'actioncolumn',
					width: 30,
					items: [
						{
							icon: 'resources/img/delete_for_action_column.png',
							tooltip: '删除条目',
							handler: function(grid, rowIndex, colIndex) {
								var st = grid.getStore(),
									rec = st.getAt(rowIndex);
								st.remove(rec);
							}
						}
					]
				},
				{
					flex: 1,
					text: '序号',
					dataIndex: 'serialNumber',
					hidden: me.isEditable ? true : false
				},
				{
					flex: 3,
					text: '项目',
					dataIndex: 'billItemName',
					editor: me.isEditable ? {
				                xtype: 'textfield',
				                allowBlank: false
				            } : null,
				    renderer: function (val, meta, rec){
				    	return Ext.String.trim(val);
				    }
				},
				{
					flex: 1,
					text: '单位',
					dataIndex: 'unit',
					editor: me.isEditable ? {
				                xtype: 'textfield',
				                allowBlank: false
				            } : null,
				    renderer: function (val, meta, rec){
				    	return Ext.String.trim(val);
				    }
				},
				{
					flex: 1,
					text: '数量',
					dataIndex: 'amount',
					hidden: me.isEditable ? true : false
				},
				{
					flex: 1,
					text: '参考量',
					dataIndex: 'referenceNumber'
				},
				{
					flex: 1,
					text: '单价(元)',
					dataIndex: 'unitPrice',
					editor: me.isEditable ? {
				                xtype: 'textfield',
				                allowBlank: false
				            } : null
				}
			]
		};

		me.store = Ext.create('FamilyDecoration.store.StatementBasicItem', {
			autoLoad: false
		});

		me.listeners = {
			cellclick: function (view, td, cellIndex, rec, tr, rowIndex, e, opts){
				if (me.isEditable) {
					/**
					  var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
		              var clickedColumnName = view.panel.headerCt.getHeaderAtIndex(cellIndex).text;
		              var clickedCellValue = rec.get(clickedDataIndex);
					 */
					var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
					if (clickedDataIndex == 'referenceNumber') {
						var win = Ext.create('FamilyDecoration.view.checkbillitem.PickBasicItemWithSameType', {
							workCategory: me.workCategory,
							basicBillItem: rec
						});
						win.show();
					}
				}
			}
		};

		me.callParent();
	}
});