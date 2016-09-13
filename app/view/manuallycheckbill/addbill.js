Ext.define('FamilyDecoration.view.manuallycheckbill.AddBill', {
	extend: 'Ext.window.Window',
	alias: 'widget.manuallycheckbill-addbill',

	requires: [
		'FamilyDecoration.store.StatementBasicItem',
		'FamilyDecoration.view.manuallycheckbill.CustomizedBillItem'
	],

	layout: 'fit',
	width: 615,
	height: 410,
	modal: true,
	title: '添加单据',
	maximizable: true,

	project: undefined,
	professionType: undefined,
	closable: false,

	bill: undefined, // bill indicates the statementBill attached to the window.
	isEdit: false, // this one indicates the mode of editing

	callbackAfterClose: Ext.emptyFn, // we could define the content of callback function whereever we instantiate this class.

	initComponent: function () {
		var me = this;

		if (me.isEdit) {
			me.title = '编辑单据';
		}

		function operationBeforeClose() {
			var warnMsg = me.isEdit ?
				'编辑模式下取消将导致单据表头更改的信息无法保存<br />确定要取消吗？'
				: '取消会将当前单据所有内容删除，<br />确定要取消吗？';
			Ext.Msg.warning(warnMsg, function (btnId) {
				if ('yes' == btnId) {
					if (me.isEdit) {
						me.close();
					}
					else {
						ajaxDel('StatementBill', {
							id: me.bill.getId()
						}, function (obj) {
							showMsg('单据已删除！');
							me.close();
							me.callbackAfterClose();
						});
					}
				}
			});
		}

		me.getButtons = function () {
			return {
				addBillItemBtn: me.down('[name="addBillItemBtn"]'),
				addBlankItemBtn: me.down('[name="addBlankItemBtn"]'),
				addPrePaidItemBtn: me.down('[name="addPrePaidItemBtn"]')
			};
		}

		me.refreshBtn = function () {
			var btns = me.getButtons(),
				billType = me.bill.get('billType');
			for (var key in btns) {
				if (btns.hasOwnProperty(key)) {
					var btn = btns[key];
					switch (key) {
						case 'addBillItemBtn':
							btn.setVisible(billType == 'reg');
							break;
						case 'addBlankItemBtn':
							btn.setVisible(billType == 'reg');
							break;
						case 'addPrePaidItemBtn':
							btn.setVisible(billType == 'ppd' || billType == 'qgd');
							break;
						default:
							break;
					}
				}
			}
		}

		me.items = [
			{
				xtype: 'manuallycheckbill-billtable',
				project: me.project,
				professionType: me.professionType,
				bill: me.bill,
				isEdit: me.isEdit,
				hasPrePaidBill: me.bill.get('hasPrePaidBill') == 'true'
			}
		];
		me.tbar = [
			{
				text: '添加小项',
				name: 'addBillItemBtn',
				icon: 'resources/img/addsmallitem.png',
				handler: function () {
					var statementBasicSt = Ext.create('FamilyDecoration.store.StatementBasicItem', {
						autoLoad: true,
						proxy: {
							type: 'rest',
							url: './libs/api.php',
							reader: {
								type: 'json',
								root: 'data',
								totalProperty: 'total'
							},
							// there is no need to put page and limit parameters in store load configuration.
							pageParam: false, //to remove param "page"
							startParam: false, //to remove param "start"
							limitParam: false, //to remove param "limit"
							extraParams: {
								action: 'StatementBasicItem.get',
								professionType: me.professionType.get('value')
							}
						}
					});
					var win = Ext.create('Ext.window.Window', {
						title: '项目',
						modal: true,
						width: 500,
						height: 400,
						layout: 'fit',
						maximizable: true,

						items: [
							{
								xtype: 'gridpanel',
								columns: {
									defaults: {
										align: 'center'
									},
									items: [
										{
											text: '名称',
											dataIndex: 'billItemName',
											flex: 1
										}
									]
								},
								dockedItems: [
									{
										dock: 'top',
										xtype: 'toolbar',
										items: [
											{
												xtype: 'searchfield',
												flex: 1,
												store: statementBasicSt,
												paramName: 'billItemName'
											}
										]
									}
								],
								store: statementBasicSt,
								selModel: {
									mode: 'SIMPLE'
								},
								selType: 'checkboxmodel',
								// hideHeaders: true,
								autoScroll: true
							}
						],
						buttons: [
							{
								text: '确定',
								handler: function () {
									var basicBillItemGrid = win.down('gridpanel'),
										billTable = me.down('manuallycheckbill-billtable'),
										selBasicItems = basicBillItemGrid.getSelectionModel().getSelection(),
										failedMembers = [];
									Ext.each(selBasicItems, function (item, index, arr) {
										var obj = item.data;
										delete obj.id;
										obj.createTime = '';
										obj.updateTime = '';
										obj.billId = me.bill.getId();
										arr[index] = obj;
									});
									function addItems(arr) {
										var func = arguments.callee;
										if (arr.length > 0) {
											var item = arr[0];
											ajaxAdd('StatementBillItem', item, function (obj) {
												arr.splice(0, 1);
												func(arr);
											}, function (obj) {
												failedMembers.push(obj.data[0].billItemName);
												arr.splice(0, 1);
												func(arr);
											});
										}
										else {
											if (failedMembers.length <= 0) {
												showMsg('添加成功！');
											}
											else {
												Ext.Msg.error('以下几项添加失败：<br />' + failedMembers.join('<br />'));
											}
											win.close();
											billTable.refreshGrid(me.bill, function (recs, ope, success) {
												if (success) {
													billTable.focusOnLastRow();
												}
											});
										}
									}
									addItems(selBasicItems);
								}
							},
							{
								text: '取消',
								handler: function () {
									win.close();
								}
							}
						]
					});

					win.show();
				}
			},
			{
				text: '添加空白项',
				name: 'addBlankItemBtn',
				icon: 'resources/img/addblankitem.png',
				handler: function () {
					var billTable = me.down('manuallycheckbill-billtable');
					var win = Ext.create('FamilyDecoration.view.manuallycheckbill.CustomizedBillItem', {
						title: '添加空白项',
						bill: me.bill,
						callbackAfterClose: function () {
							billTable.refreshGrid(me.bill, function () {
								billTable.focusOnLastRow();
							});
							billTable.setTotalFee();
						}
					});
					win.show();
				}
			},
			{
				text: '添加预付',
				name: 'addPrePaidItemBtn',
				icon: 'resources/img/addprepay.png',
				handler: function () {
					var billTable = me.down('manuallycheckbill-billtable');
					var win = Ext.create('FamilyDecoration.view.manuallycheckbill.CustomizedBillItem', {
						title: '添加预付项',
						bill: me.bill,
						isForPrePaidItem: true,
						callbackAfterClose: function () {
							billTable.refreshGrid(me.bill);
							billTable.setTotalFee();
						}
					});
					win.show();
				}
			}
		];
		me.buttons = [
			{
				text: '确定',
				handler: function () {
					var billTable = me.down('manuallycheckbill-billtable'),
						result = billTable.getValues();
					if (result.payee == '') {
						Ext.Msg.error('领款人不能为空！');
						return;
					}
					Ext.apply(result, {
						id: me.bill.getId()
					});
					ajaxUpdate('StatementBill', result, 'id', function (obj) {
						showMsg('单据已保存！');
						me.close();
						me.callbackAfterClose();
					});
				}
			},
			{
				text: '取消',
				hidden: me.isEdit,
				handler: function () {
					operationBeforeClose();
				}
			}
		];

		me.listeners = {
			beforeclose: function (win, opts) {
				// operationBeforeClose();
			},
			show: function (win) {
				win.refreshBtn();
			}
		};

		this.callParent();
	}
});