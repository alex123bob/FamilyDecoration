Ext.define('FamilyDecoration.view.basicitem.AddBasicSubItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.basicitem-addbasicsubitem',
	requires: ['Ext.grid.plugin.CellEditing', 'FamilyDecoration.view.basicitem.SubItemTable'],

	// resizable: false,
	modal: true,
	layout: 'fit',
	maximizable: true,

	title: '添加小类项目',
	width: 800,
	height: 500,
	autoScroll: true,

	parentId: undefined,
	subItem: undefined,

	initComponent: function (){
		var me = this,
			gridSt;

		me.title = me.subItem ? '编辑"' + me.subItem.get('subItemName') + '"' : '添加小类项目';

		if (me.subItem) {
			gridSt = Ext.create('FamilyDecoration.store.BasicSubItem', {
				autoLoad: false,
				data: me.subItem.getData(),
				proxy: {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			});
		}
		else {
			gridSt = Ext.create('FamilyDecoration.store.BasicSubItem', {
				autoLoad: false,
				proxy: {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			});
		}

		me.items = [{
			xtype: 'basicitem-subitemtable',
			header: false,
			store: gridSt,
			tbar: [{
				xtype: 'button',
				text: '添加',
				hidden: me.subItem ? true : false,
				handler: function (){
					var grid = this.up('gridpanel'),
						st = grid.getStore(),
						count = st.getCount();
					st.insert(count, {
						subItemName: '',
						subItemUnit: '',
						mainMaterialPrice: 0,
						auxiliaryMaterialPrice: 0,
						manpowerPrice: 0,
						machineryPrice: 0,
						lossPercent: 0
					});

					grid.plugins[0].startEditByPosition({
			            row: count, 
			            column: 1
			        });
				}
			}, {
				xtype: 'button',
				text: '删除',
				hidden: me.subItem ? true : false,
				handler: function (){
					var grid = this.up('gridpanel'),
						st = grid.getStore(),
						rec = grid.getSelectionModel().getSelection();
					if (rec.length > 0) {
						rec = rec[0];
						st.remove(rec);
						showMsg('已删除！');
					}
					else {
						showMsg('请选择条目！');
					}
				}
			}],
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1,
		            listeners: {
		            	edit: function (editor, e){
		            		e.record.commit();
		            		editor.completeEdit();
		            	}
		            }
		        })
			],
			selType: 'cellmodel',
			isItemEmpty: function (rec) {
				var flag = Ext.isEmpty(rec.get('subItemName')) || Ext.isEmpty(rec.get('subItemUnit')) || !Ext.isNumber(rec.get('mainMaterialPrice'))
							|| !Ext.isNumber(rec.get('auxiliaryMaterialPrice')) || !Ext.isNumber(rec.get('manpowerPrice')) || !Ext.isNumber(rec.get('machineryPrice'))
							|| !Ext.isNumber(rec.get('lossPercent')) || !Ext.isNumber(rec.get('manpowerCost')) || !Ext.isNumber(rec.get('mainMaterialCost'))
							|| Ext.isEmpty(rec.get('workCategory'));

				return flag;
			}
		}];

		me.buttons = [{
			xtype: 'button',
			text: '保存',
			handler: function (){
				var grid = me.down('gridpanel'),
					st = grid.getStore(),
					items = st.data.items,
					flag = true,
					p = {
						subItemName: [],
						subItemUnit: [],
						mainMaterialPrice: [],
						auxiliaryMaterialPrice: [],
						manpowerPrice: [],
						machineryPrice: [],
						lossPercent: [],
						manpowerCost: [],
						mainMaterialCost: [],
						remark: [],
						workCategory: []
					};

				if (items.length <= 0) {
					Ext.Msg.info('请添加项目');
				}
				else {
					for (var i = 0; i < items.length; i++) {
						if (grid.isItemEmpty(items[i])) {
							flag = false;
							break;
						}
						else {
							p.subItemName.push(items[i].get('subItemName'));
							p.subItemUnit.push(items[i].get('subItemUnit').replace(/M²/gi, '㎡'));
							p.mainMaterialPrice.push(items[i].get('mainMaterialPrice'));
							p.auxiliaryMaterialPrice.push(items[i].get('auxiliaryMaterialPrice'));
							p.manpowerPrice.push(items[i].get('manpowerPrice'));
							p.machineryPrice.push(items[i].get('machineryPrice'));
							p.lossPercent.push(items[i].get('lossPercent'));
							p.manpowerCost.push(items[i].get('manpowerCost'));
							p.mainMaterialCost.push(items[i].get('mainMaterialCost'));
							p.remark.push(items[i].get('remark'));
							p.workCategory.push(items[i].get('workCategory'));
						}
					}

					if (flag) {
						p.subItemName = p.subItemName.join('>>><<<');
						p.subItemUnit = p.subItemUnit.join('>>><<<');
						p.mainMaterialPrice = p.mainMaterialPrice.join('>>><<<');
						p.auxiliaryMaterialPrice = p.auxiliaryMaterialPrice.join('>>><<<');
						p.manpowerPrice = p.manpowerPrice.join('>>><<<');
						p.machineryPrice = p.machineryPrice.join('>>><<<');
						p.lossPercent = p.lossPercent.join('>>><<<');
						p.manpowerCost = p.manpowerCost.join('>>><<<');
						p.mainMaterialCost = p.mainMaterialCost.join('>>><<<');
						p.remark = p.remark.join('>>><<<');
						p.workCategory = p.workCategory.join('>>><<<');
						p.parentId = me.parentId;

						if (me.subItem) {
							Ext.apply(p, {
								subItemId: me.subItem.getId()
							});
						}

						Ext.Ajax.request({
							url: me.subItem ? './libs/subitem.php?action=edit' : './libs/subitem.php?action=addsome',
							method: 'POST',
							params: p,
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText),
										grid = Ext.getCmp('gridpanel-basicSubItem'),
										selModel = grid.getSelectionModel();
									if (obj.status == 'successful') {
										var msg = me.subItem ? '编辑成功！' : '添加成功！';
										showMsg(msg);
										me.close();
										grid.getStore().reload({
											callback: function(recs, ope, success) {
												grid.focusRow(me.subItem);
											}
										});
									}
								}
							}
						})
					}
					else {
						Ext.Msg.info('第' + (i + 1) + '项有条目未填写或填写不符合规范，请填写完整再保存！');
					}
				}
			}
		}, {
			xtype: 'button',
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		this.callParent();
	}
});