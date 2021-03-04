Ext.define('FamilyDecoration.view.costlistitem.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.costlistitem-index',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	requires: ['FamilyDecoration.store.CostListItem', 'FamilyDecoration.store.NormCost', 'FamilyDecoration.store.NormCostItem', 'Ext.ux.form.SearchField',
		'Ext.form.ComboBox', 'FamilyDecoration.store.WorkCategory', 'Ext.grid.plugin.DragDrop'],

	initComponent: function () {
		var me = this;

		var costItemSt = Ext.create('FamilyDecoration.store.CostListItem', {
			autoLoad: true
		});

		var normCostSt = Ext.create('FamilyDecoration.store.NormCost', {
			autoLoad: true
		});

		var normCostItemSt = Ext.create('FamilyDecoration.store.NormCostItem', {
			autoLoad: false
		});

		me.items = [
			{
				id: 'gridpanel-costlistitem',
				name: 'gridpanel-costlistitem',
				xtype: 'gridpanel',
				flex: 1,
				tools: [
					{
						type: 'refresh',
						tooltip: '刷新当前应用',
						callback: function (){
							costItemSt.reload();
						}
					}
				],
				plugins: [
					Ext.create('Ext.grid.plugin.RowEditing', {
						clicksToEdit: 2,
						clicksToMoveEditor: 1,
						listeners: {
							edit: function (editor, e) {
								var field = e.field,
									rec = e.record,
									newValues = e.newValues;
								if (rec.getId()) {
									ajaxUpdate('CostListItem', Ext.apply(newValues, {
										id: rec.getId(),
										version: rec.get('version')
									}), ['id', 'version'], function () {
										showMsg('更新成功!');
										rec.commit();
									});
								}
								else {
									ajaxAdd('CostListItem', newValues, function (res) {
										showMsg('添加成功！');
										rec.setId(res.data.id);
										rec.commit();
									});
								}
							}
						}
					}),
				],
				viewConfig: {
					stripeRows: true,
					allowCopy: true,
					copy: true,
					plugins: [
						{
							ptype: 'gridviewdragdrop',
							dragText: '添加清单项目',
							dragGroup: 'costlistitem-dragzone',
							dropGroup: 'normcost-dropzone',
						}
					],
					listeners: {
						beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
							var editor = Ext.getCmp('gridpanel-normCostEditor');
							var rec = data.records[0];
							ajaxDel('CostRefNormItem', {
								normId: rec.get('normId'),
								itemId: rec.getId(),
								version: rec.get('version')
							}, function() {
								showMsg('删除成功!');
								costItemSt.reload();
								editor.loadItems(Ext.create(FamilyDecoration.model.NormCost, {
									id: rec.get('normId'),
								}));
							});
						}
					}
				},
				selModel: {
					mode: 'MULTI'
				},
				columns: {
					defaults: {
						flex: 1,
						editor: 'textfield'
					},
					items: [
						{
							text: '名称',
							dataIndex: 'name',
						},
						{
							text: '单位',
							dataIndex: 'unit',
						},
						{
							text: '工种',
							dataIndex: 'professionType',
							editor: {
								editable: false,
								xtype: 'combobox',
								store: FamilyDecoration.store.WorkCategory,
								queryMode: 'local',
								displayField: 'name',
								valueField: 'value'
							},
							renderer: function (val, meta, rec) {
								return FamilyDecoration.store.WorkCategory.renderer(val);
							}
						},
						{
							text: '人工',
							dataIndex: 'isLabour',
							editor: {
								xtype: 'checkbox'
							},
							renderer: function (val) {
								return val === 'true' ? '是' : '否';
							}
						},
						{
							text: '备注',
							dataIndex: 'remark'
						},
						{
							xtype: 'actioncolumn',
							editor: null,
							width: 25,
							flex: null,
							items: [
								{
									icon: 'resources/img/flaticon-delete.svg',
									tooltip: '删除',
									handler: function (grid, rowIndex, colIndex) {
										var rec = grid.getStore().getAt(rowIndex);
										ajaxDel('CostListItem', {
											id: rec.getId()
										}, function () {
											showMsg('已删除!');
											costItemSt.reload();
										});
									}
								},
							]
						}
					]
				},
				// dockedItems: [{
				// 	dock: 'top',
				// 	xtype: 'toolbar',
				// 	items: [{
				// 		xtype: 'searchfield',
				// 		flex: 1,
				// 		store: biSt,
				// 		paramName: 'itemName'
				// 	}]
				// }],
				title: '清单项目',
				margin: '0 1 0 0',
				store: costItemSt,
				tbar: [
					{
						text: '添加',
						icon: './resources/img/flaticon-add.svg',
						handler: function () {
							var rowEditing = this.ownerCt.ownerCt.plugins[0];
							costItemSt.add(
								{
									name: '',
									unit: '',
									professionType: ''
								}
							);
						}
					}
				],
				listeners: {
					selectionchange: function (selModel, items, opts) {

					}
				}
			},
			{
				xtype: 'container',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				flex: 1,				
				items: [
					{
						id: 'gridpanel-normCostEditor',
						name: 'gridpanel-normCostEditor',
						normCostId: null,
						loadItems: function(normCost) {
							if (normCost) {
								var proxy = normCostItemSt.getProxy();
								Ext.override(proxy, {
									extraParams: {
										action: 'CostRefNormItem.get',
										normId: normCost.getId()
									},
								});
								normCostItemSt.setProxy(proxy);
								this.normCostId = normCost.getId();
								normCost.get('name') && this.setTitle(('编辑:' + `<font color="red">${normCost.get('name')}</font>`));
								normCost && normCostItemSt.reload();
							}
							else {
								this.normCostId = null;
								this.setTitle('编辑成本定额');
								normCostItemSt.removeAll();
							}
						},
						flex: 1,
						xtype: 'gridpanel',
						title: '编辑成本定额',
						store: normCostItemSt,
						viewConfig: {
							copy: true,
							allowCopy: true,
							plugins: [
								{
									ptype: 'gridviewdragdrop',
									dragText: '移除清单项目',
									dropGroup: 'costlistitem-dragzone',
									dragGroup: 'normcost-dropzone',
								}
							],
							listeners: {
								beforedrop: function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
									var editor = Ext.getCmp('gridpanel-normCostEditor');
									// 添加清单项目
									function addItems(recs, normId, normName) {
										// bulk add
										if (recs.length > 1) {
											ajaxAdd('CostRefNormItem.bulkAdd', {
												normIds: Array(recs.length).fill(normId).join(','),
												itemIds: recs.map(function(rec) {
													return rec.getId();
												}).join(','),
												versions: recs.map(function(rec) {
													return rec.get('version')
												}).join(',')
											}, function() {
												showMsg('添加成功!');
												editor.loadItems(Ext.create(FamilyDecoration.model.NormCost, {
													id: normId,
													name: normName
												}));
											}, function() {
												// error handler
											}, true);
										}
										else {
											ajaxAdd('CostRefNormItem', {
												normId: editor.normCostId,
												itemId: recs[0].getId(),
												version: recs[0].get('version')
											}, function() {
												showMsg('添加成功!');
												editor.loadItems(Ext.create(FamilyDecoration.model.NormCost, {
													id: normId,
													name: normName
												}));
											})
										}
									}
									if (!editor.normCostId) {
										Ext.Msg.read('请输入要创建的成本定额名称:', function(name) {
											ajaxAdd('CostNorm', {
												name: name,
												remark: ''
											}, function(res) {
												swal.close();
												showMsg('添加成功!');
												editor.normCostId = res.data.id;
												editor.setTitle('编辑:' + `<font color="red">${name}</font>`);
												normCostSt.reload();
												addItems(data.records, editor.normCostId, name);
											});
										});
										return false;
									}
									else {
										if (data.records.length > 0) {
											addItems(data.records, editor.normCostId, name);
										}
									}
								}
							}
						},
						columns: {
							defaults: {
								flex: 1,
							},
							items: [
								{
									text: '名称',
									dataIndex: 'itemName',
								},
								{
									text: '单位',
									dataIndex: 'itemUnit',
								},
								{
									text: '工种',
									dataIndex: 'itemProfessionType',
									renderer: function (val, meta, rec) {
										return FamilyDecoration.store.WorkCategory.renderer(val);
									}
								},
								{
									text: '人工',
									dataIndex: 'itemIsLabour',
									renderer: function (val) {
										return val === 'true' ? '是' : '否';
									}
								},
								{
									text: '备注',
									dataIndex: 'itemRemark'
								}
							]
						}
					},
					{
						flex: 1,
						xtype: 'gridpanel',
						id: 'gridpanel-normcost',
						name: 'gridpanel-normcost',
						title: '成本定额',
						store: normCostSt,
						selModel: {
							mode: 'SINGLE',
							allowDeselect: true
						},
						// selType: 'checkboxmodel',
						dockedItems: [{
							dock: 'top',
							xtype: 'toolbar',
							items: [{
								xtype: 'searchfield',
								flex: 1,
								store: normCostSt,
								paramName: 'name'
							}]
						}],
						columns: {
							defaults: {
								flex: 1
							},
							items: [
								{
									text: '名称',
									dataIndex: 'name'
								}
							]
						},
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var rec = sels[0];
								var editor = Ext.getCmp('gridpanel-normCostEditor');
								editor.loadItems(rec);
							}
						}
					}
				]
			}
		];

		me.callParent();
	}
});