Ext.define('FamilyDecoration.view.manuallycheckbill.BillTable', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.manuallycheckbill-billtable',
	layout: 'vbox',
	requires: [
		'FamilyDecoration.store.StatementBillItem'
	],
	header: false,
	isPreview: false,
	isAudit: false,
	
	project: undefined,
	professionType: undefined,
	
	bill: undefined,
	isEdit: false, // this one tells current component if he needs to load bill data after rendition or not.

	initComponent: function (){
		var me = this,
			previewMode = me.isPreview,
			auditMode = me.isAudit;
			
		me.getValues = function (){
			var form = me.down('form'),
				txts = form.query('textfield'),
				result = {};
			Ext.each(txts, function (txt, index){
				result[txt.name] = txt.getValue();
			});
			
			// special field value.
			result['billName'] = result['payee'] + '领款单';
			return result;
		};
			
		me.refresh = function (bill){
			me.refreshForm(bill);
			me.refreshGrid(bill);
		};
		
		me.refreshForm = function (bill){
			var form = me.down('form'),
				data, field;
			if (bill) {
				data = bill.data;
				for (var pro in data) {
					if (data.hasOwnProperty(pro)) {
						field = form.query('[name="' + pro + '"]');
						if (field.length > 0) {
							field = field[0];
							field.setValue(data[pro]);
						}
					}
				}
			}
			else {
				field = form.query('textfield');
				Ext.each(field, function (cmp, index, fld){
					cmp.setValue('');
				});
			}
		}
		
		me.refreshGrid = function (bill, callback){
			var grid = me.down('grid'),
				st = grid.getStore();
			if (bill) {
				st.load({
					params: {
						'billId': bill.getId()
					},
					callback: function (recs, ope, success){
						if (typeof callback === 'function') {
							callback(recs, ope, success);
						}
						else {
							// TODO
						}
					}
				});
			}
			else {
				st.removeAll();
			}
		};
		
		me.focusOnLastRow = function (){
			var grid = me.down('grid'),
				view = grid.getView(),
				st = grid.getStore(),
				last = st.last();
			grid.getSelectionModel().select(last);
			view.focusRow(last, 200);
		};
		
		me.setTotalFee = function (totalFee){
			var form = me.down('form'),
				totalFeeField = form.query('[name="totalFee"]')[0];
			totalFeeField.setValue(totalFee);
		}
		
		// there is no need to invoke this functionality coz we put all calculation in the back-end.
		// once we click confirm button to add billItems, all items are written into database with attached billID.
		// don't worry about this circumstance that user added items but give up the bill, 
		// actually in that time, bill couldn't be found, therefore billItems will never get the chance to show up.
		// me.addBillItem = function (rec){
		// 	var grid = me.down('gridpanel'),
		// 		st = grid.getStore();
		// 	st.add(rec);
		// };

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
						margin: '0 0 0 60',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-budgetName',
						value: '佳诚装饰<br />单项工程施工工程款领取审批单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 12px;">公司联</font>',
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
							margin: '0 0 0 4'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '领款人',
								flex: 1,
								height: '100%',
								name: 'payee',
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '工程地址',
								flex: 2,
								height: '100%',
								name: 'projectName',
								readOnly: true,
								value: me.project ? me.project.get('projectName') : ''
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
							margin: '0 0 0 4'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '联系电话',
								flex: 1,
								height: '100%',
								name: 'phoneNumber',
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '总金额',
								flex: 1,
								height: '100%',
								name: 'totalFee',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '申领金额',
								flex: 1,
								height: '100%',
								name: 'claimAmount',
								readOnly: previewMode ? true : false
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
							margin: '0 0 0 4'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '领款次数',
								flex: 1,
								height: '100%',
								name: 'payedTimes',
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '完成情况',
								flex: 2,
								height: '100%',
								name: 'projectProgress',
								readOnly: previewMode ? true : false
							}
						]
					},
				]
			},
			{
				xtype: 'gridpanel',
				flex: 1,
				width: '100%',
				autoScroll: true,
				store: Ext.create('FamilyDecoration.store.StatementBillItem', {
					autoLoad: false
				}),
				// selType: previewMode ? 'row' 'cellmodel',
				plugins: previewMode ? [] : [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1,
						listeners: {
							edit: function (editor, e){
								Ext.suspendLayouts();
								
								e.record.commit();
								editor.completeEdit();
								ajaxUpdate('StatementBillItem', {
									amount: e.record.get('amount'),
									id: e.record.getId(),
									billId: me.bill.getId()
								}, 'id', function (obj){
									me.refreshGrid(me.bill);
									ajaxGet('StatementBill', 'getTotalFee', {
										id: me.bill.getId()
									}, function (obj){
										me.setTotalFee(obj.totalFee);
									});
								});
								
								Ext.resumeLayouts();
							},
							validateedit: function (editor, e, opts){
								var rec = e.record;
								if (e.field == 'amount') {
									if (isNaN(e.value) || !/^-?\d+(\.\d+)?$/.test(e.value) ){
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
				columns: {
					items: [
						{
							hidden: previewMode ? true : false,
							xtype: 'actioncolumn',
							width: 30,
							items: [
								{
									icon: 'resources/img/delete_for_action_column.png',
									tooltip: '删除条目',
									handler: function(view, rowIndex, colIndex) {
										var st = view.getStore(),
											rec = st.getAt(rowIndex),
											index = st.indexOf(rec);
										ajaxDel('StatementBillItem', {
											id: rec.getId()
										}, function (){
											showMsg('删除成功！');
											me.refreshGrid(me.bill, function (recs, ope, success){
												if (success) {
													var newRec = st.getAt(index);
													if (newRec) {
														view.getSelectionModel().select(newRec);
														view.focusRow(newRec, 200);	
													}
												}
											});
										})
									}
								}
							]
						},
						{
							text: '序号',
							dataIndex: 'serialNumber',
							flex: 1
						},
						{
							text: '项目',
							dataIndex: 'billItemName',
							flex: 1
						},
						{
							text: '单位',
							dataIndex: 'unit',
							flex: 1
						},
						{
							text: '参考量',
							dataIndex: 'referenceNumber',
							flex: 1,
							hidden: auditMode ? false : true
						},
						{
							text: '数量',
							dataIndex: 'amount',
							flex: 1,
							editor: !previewMode ? {
				                xtype: 'textfield',
				                allowBlank: false
				            } : {},
						},
						{
							text: '审核数量',
							dataIndex: 'checkedNumber',
							flex: 1,
							hidden: auditMode ? false : true
						},
						{
							text: '单价(元)',
							dataIndex: 'unitPrice',
							flex: 1
						},
						{
							text: '小计',
							dataIndex: 'subtotal',
							flex: 1
						}
					],
					defaults: {
						align: 'center'
					}
				}
			}
		];
		
		me.listeners = {
			afterrender: function (panel, opts){
				if (panel.isEdit) {
					panel.refresh(panel.bill);
				}
			}
		};

		me.callParent();
	}
});