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
	hasPrePaidBill: false, // if current bill has its prePaid deposit bill or not. default false.
	
	project: undefined,
	professionType: undefined,
	
	bill: undefined,
	isEdit: false, // this one tells current component if he needs to load bill data after rendition or not.

	initComponent: function (){
		var me = this,
			previewMode = me.isPreview,
			auditMode = me.isAudit,
			hasPrePaidBill = me.hasPrePaidBill,
			isRegularBill;
		
		if (me.bill) {
			isRegularBill = (me.bill.get('billType') == 'reg');
		}
		else {
			isRegularBill = undefined;
		}
			
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
			me.refreshPrePaidItems(bill);
		};

		me.refreshPrePaidItems = function (bill){
			var form = me.down('form'),
				remainingTotalFeeField = form.down('[name="remainingTotalFee"]'),
				prePaidFeeField = form.down('[name="prePaidFee"]');

			if (bill && previewMode) {
				remainingTotalFeeField
					.setValue(bill.get('remainingTotalFee'))
					.setVisible(bill.get('hasPrePaidBill') == 'true');

				prePaidFeeField
					.setValue(bill.get('prePaidFee'))
					.setVisible(bill.get('hasPrePaidBill') == 'true');
			}
			else {
				remainingTotalFeeField.setValue('').hide();
				prePaidFeeField.setValue('').hide();
			}
		}
		
		me.refreshForm = function (bill){
			var form = me.down('form'),
				title = me.down('[name="displayfield-budgetName"]'),
				data, field;
			if (bill) {
				data = bill.data;
				title.setValue(me.getBillTitle(data.professionTypeName,data.id));
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
				title.setValue(me.getBillTitle());
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
				st.setProxy({
					url: './libs/api.php',
					type: 'rest',
					extraParams: {
						billId: bill.getId(),
						action: 'StatementBillItem.get'
					},
					reader: {
						type: 'json',
						root: 'data'
					}
				});
				st.loadPage(1, {
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
		
		me.setTotalFee = function (){
			var form = me.down('form'),
				totalFeeField = form.query('[name="totalFee"]')[0],
				claimAmountField = form.query('[name="claimAmount"]')[0];
			ajaxGet('StatementBill', 'getTotalFee', {
				id: me.bill.getId()
			}, function (obj){
				totalFeeField.setValue(obj.totalFee);
				!isRegularBill && claimAmountField.setValue(obj.totalFee);
			});
		};
		me.getBillTitle = function(str,billId){
			str = str === undefined ? "" : "("+str+")";
			billId = billId === undefined ? "" : "-"+billId;
			return '佳诚装饰<br />单项工程施工工程款领取审批单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 12px;">公司联'+billId+str+'</font>';
		}	
		var statementBillItemSt = Ext.create('FamilyDecoration.store.StatementBillItem', {
			autoLoad: false
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
						margin: '0 0 0 60',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-budgetName',
						value: me.getBillTitle(),
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
							},
							{
								xtype: 'textfield',
								fieldLabel: '项目经理',
								flex: 1,
								height: '100%',
								name: 'captain',
								readOnly: true,
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
								readOnly: previewMode || !isRegularBill ? true : false
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
								fieldLabel: '完成情况(%)',
								labelWidth: 80,
								flex: 2,
								height: '100%',
								// editable: false,
								name: 'projectProgress',
								afterSubTpl: '%',
								maskRe: /[\d\.]/,
								// minValue: 0,
								// maxValue: 100,
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '剩余总金额',
								flex: 1,
								height: '100%',
								name: 'remainingTotalFee',
								readOnly: true,
								hidden: !hasPrePaidBill ? true : (previewMode ? false : true)
							},
							{
								xtype: 'textfield',
								fieldLabel: '预付款',
								flex: 1,
								height: '100%',
								name: 'prePaidFee',
								readOnly: true,
								hidden: !hasPrePaidBill ? true : (previewMode ? false : true)
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
				store: statementBillItemSt,
				// selType: previewMode ? 'row' 'cellmodel',
				plugins: previewMode && !auditMode ? [] : [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1,
						listeners: {
							edit: function (editor, e){
								Ext.suspendLayouts();
								
								e.record.commit();
								editor.completeEdit();
								if (e.field == 'amount') {
									ajaxUpdate('StatementBillItem', {
										amount: e.record.get('amount'),
										id: e.record.getId(),
										billId: me.bill.getId()
									}, 'id', function (obj){
										me.refreshGrid(me.bill);
										showMsg('编辑成功！');
										me.setTotalFee()
									});
								}
								else if (e.field == 'checkedNumber') {
									ajaxUpdate('StatementBillItem', {
										checkedNumber: e.record.get('checkedNumber'),
										id: e.record.getId(),
										billId: me.bill.getId()
									}, 'id', function (obj){
										showMsg('编辑成功！');
										me.refreshGrid(me.bill);
									});
								}
								else if (e.field == 'unitPrice') {
									ajaxUpdate('StatementBillItem', {
										unitPrice: e.record.get('unitPrice'),
										id: e.record.getId(),
										billId: me.bill.getId()
									}, 'id', function (obj){
										me.refreshGrid(me.bill);
										showMsg('编辑成功！');
										me.setTotalFee()
									});
								}
								
								Ext.resumeLayouts();
							},
							validateedit: function (editor, e, opts){
								var rec = e.record;
								if (e.field == 'amount' || e.field == 'checkedNumber' || e.field == 'unitPrice') {
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
							hidden: previewMode || !isRegularBill ? true : false,
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
											me.setTotalFee();
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
							editor: !previewMode ? (isRegularBill ? {
				                xtype: 'textfield',
				                allowBlank: false
				            } : false) : false,
						},
						{
							text: '审核数量',
							dataIndex: 'checkedNumber',
							flex: 1,
							hidden: auditMode ? false : true,
							editor: auditMode ? {
								xtype: 'textfield',
								allowBlank: false
							} : false
						},
						{
							text: '单价(元)',
							dataIndex: 'unitPrice',
							flex: 1,
							editor: !isRegularBill && !previewMode ? {
								xtype: 'textfield',
								allowBlank: false
							} : false
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
				},
				dockedItems: [
					{
						xtype: 'pagingtoolbar',
						store: statementBillItemSt,
						dock: 'bottom',
						displayInfo: true
					}
				]
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