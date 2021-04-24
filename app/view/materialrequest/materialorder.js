Ext.define('FamilyDecoration.view.materialrequest.MaterialOrder', {
	extend: 'Ext.container.Container',
	alias: 'widget.materialrequest-materialorder',
	layout: 'vbox',
	requires: [
		'FamilyDecoration.store.MaterialOrderItem',
		'FamilyDecoration.model.MaterialOrderList',
		'FamilyDecoration.store.WorkCategory'
	],
    defaults: {
        width: '100%'
    },
	previewMode: false,
	project: undefined,
	order: undefined,

    initComponent: function () {
        var me = this;

		function _getFrmField() {
			return {
				supplier: me.down('[name="supplier"]'),
				supplierId: me.down('[name="supplierId"]'),
				projectName: me.down('[name="projectName"]'),
				captain: me.down('[name="captain"]'),
				phone: me.down('[name="phone"]'),
				totalFee: me.down('[name="totalFee"]'),
				totalFeeUppercase: me.down('[name="totalFeeUppercase"]'),
				payedTimes: me.down('[name="payedTimes"]'),
				projectProgress: me.down('[name="projectProgress"]')
			};
		}

		function _refreshForm() {
			var frm = _getFrmField();
			if (me.order) {
				ajaxGet('SupplierOrder', 'getWithSupplier', {
					id: me.order.getId()
				}, function (obj) {
					var data = obj.data[0];
					me.order = Ext.create('FamilyDecoration.model.MaterialOrderList', data);
					frm.supplier.setValue(data.supplier);
					frm.supplierId.setValue(data.supplierId);
					frm.totalFee.setValue(data.totalFee);
					frm.projectName.setValue(data.projectName);
					frm.captain.setValue(data.creatorRealName);
					frm.phone.setValue(data.phoneNumber);
					frm.totalFee.setValue(data.totalFee);
					frm.totalFeeUppercase.setValue(data.totalFeeUppercase);
					frm.payedTimes.setValue(data.payedTimes);
					frm.projectProgress.setValue(data.projectProgress);
				});
			}
			else {
				_clearFrm();
			}
		}

		function _clearFrm() {
			var frm = _getFrmField();
			for (var key in frm) {
				if (frm.hasOwnProperty(key)) {
					var elem = frm[key];
					elem.setValue('');
				}
			}
		}

		function _refreshGrid() {
			var grid = me.down('gridpanel'),
				st = grid.getStore(),
				proxy = st.getProxy();
			if (me.order) {
				Ext.apply(proxy.extraParams, {
					billId: me.order.getId()
				});
				st.setProxy(proxy);
				st.loadPage(1);
			}
			else {
				st.removeAll();
			}
		}

		function _reloadGrid() {
			var grid = me.down('gridpanel'),
				st = grid.getStore(),
				selModel = grid.getSelectionModel(),
				rec = selModel.getSelection()[0],
				index = st.indexOf(rec);
			st.reload({
				callback: function (recs, ope, success) {
					if (success) {
						if (-1 != index) {
							selModel.deselectAll();
							selModel.select(index);
						}
					}
				}
			});
		}

		me.getFrm = function () {
			return _getFrmField();
		}

		// reloadMode: if set true, we are gonna reload current store.
		// or, we will configure the store's proxy and reload current store from its first page via loadPage functionality.
		me.refresh = function (reloadMode) {
			_refreshForm();
			if (reloadMode === true) {
				_reloadGrid();
			}
			else {
				_refreshGrid();
			}
		}

		// reloadMode: if set true, we are gonna reload current store.
		// or, we will configure the store's proxy and reload current store from its first page via loadPage functionality.
		me.halfRefresh = function (reloadMode) {
			_setTotalFee();
			if (reloadMode === true) {
				_reloadGrid();
			}
			else {
				_refreshGrid();
			}
		}

		me.previewTemplate = function (templateId){
			ajaxGet('SupplierOrderItemTemplate', false, {
				templateId: templateId
			}, function (obj){
				var frm = _getFrmField(),
					grid = me.down('gridpanel'),
					st = grid.getStore();
				frm.supplier.setValue(obj.supplierName);
				st.removeAll();
				st.add(obj.data);
			});
		}

		function _setTotalFee() {
			var frm = _getFrmField();
			ajaxGet('SupplierOrder', 'getTotalFee', {
				id: me.order.getId()
			}, function (obj) {
				frm.totalFee.setValue(obj.totalFee);
				frm.totalFeeUppercase.setValue(obj.totalFeeUppercase);
			});
		};

		var st = Ext.create('FamilyDecoration.store.MaterialOrderItem', {
			autoLoad: false,
			proxy: {
				type: 'rest',
				url: './libs/api.php',
				reader: {
					type: 'json',
					root: 'data'
				},
				extraParams: {
					action: 'SupplierOrderItem.get'
				}
			}
		});

        me.items = [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
				width: '100%',
				height: 60,
				items: [
					{
						width: 60,
						height: '100%',
						xtype: 'image',
						margin: '0 0 0 180',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-materialRequestName',
						value: '佳诚装饰<br />工程材料订购单&nbsp;&nbsp;<span style="font-size: 12px;">公司联</font>',
						hideLabel: true,
						fieldStyle: {
							fontSize: '24px',
							lineHeight: '30px'
						},
						style: {
							fontFamily: '黑体'
						},
						flex: 1,
						height: '100%'
					}
				]
            },
			{
				xtype: 'form',
				layout: 'vbox',
				height: 90,
				width: '99%',
				items: [
					{
						xtype: 'fieldcontainer',
						flex: 1,
						width: '100%',
						layout: 'hbox',
						defaults: {
							labelWidth: 70,
							margin: '0 0 0 4',
							height: '100%'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '供应商',
								flex: 1,
								name: 'supplier',
								readOnly: true
							},
							{
								xtype: 'hidden',
								name: 'supplierId'
							},
							{
								xtype: 'textfield',
								fieldLabel: '工程地址',
								flex: 1,
								name: 'projectName',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '项目经理',
								flex: 1,
								name: 'captain',
								readOnly: true,
								hidden: !me.previewMode,
								value: me.project ? me.project.get('captain') : ''
							}
						]
					},
					{
						xtype: 'fieldcontainer',
						flex: 1,
						width: '100%',
						layout: 'hbox',
						defaults: {
							labelWidth: 70,
							margin: '0 0 0 4',
							height: '100%'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '联系电话',
								flex: 1,
								name: 'phone',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '总金额',
								flex: 1,
								name: 'totalFee',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '大写',
								flex: 1,
								name: 'totalFeeUppercase',
								readOnly: true
							}
						]
					},
					{
						xtype: 'fieldcontainer',
						flex: 1,
						width: '100%',
						layout: 'hbox',
						defaults: {
							labelWidth: 70,
							margin: '0 0 0 4',
							height: '100%'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '申购次数',
								flex: 1,
								name: 'payedTimes',
								readOnly: me.previewMode,
								maskRe: /[\d]/,
								value: me.order && me.order.get('payedTimes')
							},
							{
								xtype: 'textfield',
								fieldLabel: '完成情况(%)',
								labelWidth: 80,
								flex: 2,
								name: 'projectProgress',
								afterSubTpl: '%',
								maskRe: /[\d\.]/,
								readOnly: me.previewMode,
								value: me.order && me.order.get('projectProgress')
							}
						]
					}
				]
			},
			{
				xtype: 'gridpanel',
				flex: 1,
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
				plugins: me.previewMode && !(User.isAdmin()) ? [] : [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1,
						listeners: {
							edit: function (editor, e) {
								Ext.suspendLayouts();

								e.record.commit();
								editor.completeEdit();
								if (e.field == 'amount') {
									ajaxUpdate('SupplierOrderItem', {
										amount: e.record.get('amount'),
										id: e.record.getId()
									}, 'id', function (obj) {
										showMsg('编辑成功！');
										me.halfRefresh(true);
									});
								}
								else if (e.field == 'remark') {
									ajaxUpdate('SupplierOrderItem', {
										remark: e.record.get('remark'),
										id: e.record.getId()
									}, 'id', function (obj) {
										showMsg('编辑成功！');
										me.halfRefresh(true);
									});
								}
								else if (e.field == 'checkedNumber') {
									ajaxUpdate('SupplierOrderItem', {
										checkedNumber: e.record.get('checkedNumber'),
										id: e.record.getId(),
									}, 'id', function (obj) {
										showMsg('编辑成功！');
										me.halfRefresh(true);
									});
								}

								Ext.resumeLayouts();
							},
							validateedit: function (editor, e, opts) {
								var rec = e.record;
								if (e.field == 'amount' || e.field == 'checkedNumber') {
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
						hidden: me.previewMode ? true : false,
						width: 30,
						items: [
							{
								icon: 'resources/img/delete_for_action_column.png',
								tooltip: '删除条目',
								handler: function (view, rowIndex, colIndex) {
									var st = view.getStore(),
										rec = st.getAt(rowIndex),
										index = st.indexOf(rec);
									ajaxDel('SupplierOrderItem', {
										id: rec.getId()
									}, function () {
										showMsg('删除成功！');
										me.halfRefresh();
									});
								}
							}
						]
					},
					{
						text: '材料名称',
						dataIndex: 'billItemName',
						align: 'center',
						flex: 1
					},
					{
						text: '数量',
						dataIndex: 'amount',
						align: 'center',
						flex: 1,
						editor: me.previewMode ? false : {
							xtype: 'textfield',
							allowBlank: false
						}
					},
					{
						text: '单位',
						dataIndex: 'unit',
						align: 'center',
						flex: 1
					},
					{
						text: '单价(元)',
						dataIndex: 'unitPrice',
						align: 'center',
						flex: 1
					},
					{
						text: '总价(元)',
						dataIndex: 'subtotal',
						align: 'center',
						flex: 1
					},
					{
						text: '参考量',
						dataIndex: 'referenceNumber',
						align: 'center',
						flex: 1
					},
					{
                        text: '审核数量',
                        dataIndex: 'checkedNumber',
                        flex: 0.6,
                        hidden: User.isAdmin() ? false : true,
                        editor: User.isAdmin() ? {
                            xtype: 'textfield',
                            allowBlank: false
                        } : false
                    },
					{
						text: '备注',
						dataIndex: 'remark',
						align: 'center',
						flex: 1,
						editor: me.previewMode ? false : {
							xtype: 'textfield',
							allowBlank: false
						}
					},
					{
						text: '工种',
						dataIndex: 'professionType',
						align: 'center',
						flex: 0.7,
						renderer: function (val, meta, rec) {
							return FamilyDecoration.store.WorkCategory.renderer(val);
						}
					}
				]
			}
        ];

        me.callParent();
    }
});