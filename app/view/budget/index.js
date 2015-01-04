Ext.define('FamilyDecoration.view.budget.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-index',
	requires: ['FamilyDecoration.model.Budget', 'FamilyDecoration.view.budget.BudgetHeader', 'FamilyDecoration.view.budget.BudgetContent',
			   'FamilyDecoration.view.budget.AddBasicItem', 'FamilyDecoration.view.budget.Preview', 'FamilyDecoration.view.budget.History'],
	autoScroll: true,
	layout: 'border',	

	initComponent: function () {
		var me = this;

		me.items = [
			{
				xtype: 'budget-budgetheader',
				id: 'gridpanel-budgetheader',
				name: 'gridpanel-budgetheader',
				region: 'west',
				header: false,
				hideHeaders: true,
				width: 200,
				margin: '0 1 0 0'
			}, 
			{
				xtype: 'budget-budgetcontent',
				name: 'panel-budgetContent',
				id: 'panel-budgetContent',
				html: '<iframe id="exportFrame"  src="javascript:void(0);" style="display:none"></iframe>',
				tbar: [{
					text: '添加项目',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.budget.AddBasicItem', {
							grid: Ext.getCmp('panel-budgetContent').down('gridpanel')
						});

						win.show();
					}
				}, {
					text: '保存预算',
					handler: function (){
						var header = Ext.getCmp('gridpanel-budgetheader'),
							budgetContent = Ext.getCmp('panel-budgetContent'),
							body = budgetContent.down('gridpanel'),
							headerSt = header.getStore(),
							bodySt = body.getStore(),
							projectName = '',
							p = {}, flag = true;

						Ext.each(headerSt.data.items, function (rec){
							if (rec.get('name') == 'comments') {
								p[rec.get('name')] = rec.get('content').replace(/\n/g, '>>><<<');
							}
							else {
								p[rec.get('name')] = rec.get('content');
							}
							
							if (rec.get('content') == "") {
								flag = false;
							}
							if (rec.get('name') == 'projectName') {
								projectName = rec.get('content');
							}
						});

						if (!flag) {
							Ext.Msg.info('预算头部信息有空白项！');
						}
						else if (bodySt.getCount() <= 0) {
							Ext.Msg.info('预算实体部分为空！');
						}
						else {
							Ext.Ajax.request({
								url: './libs/budget.php?action=list',
								method: 'GET',
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText),
											flag = false;
										Ext.each(obj, function (rec){
											if (rec.projectName == p.projectName) {
												flag = true;
											}
										});
										if (flag) {
											Ext.Msg.info('预算已存在，不要重复保存！');
										}
										else {
											Ext.Ajax.request({
												url: './libs/getprojectnames.php',
												method: 'GET',
												callback: function (opts, success, res){
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj) {
															flag = false;
															for (var i = 0; i < obj.length; i++) {
																if (obj[i].projectName == projectName) {
																	flag = true;
																	break;
																}
															}
															if (!flag) {
																Ext.Msg.info('不存在对应的项目，请更改预算项目地址。');
															}
															else {
																Ext.Ajax.request({
																	url: './libs/budget.php?action=add',
																	method: 'POST',
																	params: p,
																	callback: function (opts, success, res) {
																		var obj;
																		if (success) {
																			obj = Ext.decode(res.responseText);
																			if (obj.status == 'successful') {
																				Ext.Ajax.request({
																					url: './libs/budget.php?action=getBudgetsByProjectName',
																					method: 'GET',
																					params: {
																						projectName: projectName
																					},
																					callback: function (opts, success, res){
																						if (success) {
																							var data = Ext.decode(res.responseText);
																							data = data[0];
																							var budgetId = data['budgetId'],
																								p;
																							p = {
																								itemName: [],
																								budgetId: [],
																								itemCode: [],
																								itemUnit: [],
																								itemAmount: [],
																								mainMaterialPrice: [],
																								auxiliaryMaterialPrice: [],
																								manpowerPrice: [],
																								machineryPrice: [],
																								lossPercent: [],
																								remark: [],
																								basicItemId: [],
																								basicSubItemId: []
																							};
																							bodySt.each(function (rec){
																								if (rec.get('itemName') != '' && '小计' != rec.get('itemName')) {
																									// itemCode
																									if (rec.get('itemCode') == "") {
																										p.itemCode.push('NULL');
																									}
																									else {
																										p.itemCode.push(rec.get('itemCode'));
																									}

																									// itemName
																									p.itemName.push(rec.get('itemName'));

																									// itemUnit
																									if (rec.get('itemUnit') == "") {
																										p.itemUnit.push('NULL');
																									}
																									else {
																										p.itemUnit.push(rec.get('itemUnit'));
																									}

																									// remark
																									if (rec.get('remark') == "") {
																										p.remark.push('NULL');
																									}
																									else {
																										p.remark.push(rec.get('remark'));
																									}

																									// basicItemId
																									if (rec.get('basicItemId') == '') {
																										p.basicItemId.push('NULL');
																									}
																									else {
																										p.basicItemId.push(rec.get('basicItemId'));
																									}

																									// basicSubItemId
																									if (rec.get('basicSubItemId') == '') {
																										p.basicSubItemId.push('NULL');
																									}
																									else {
																										p.basicSubItemId.push(rec.get('basicSubItemId'));
																									}

																									p.budgetId.push(budgetId);
																									p.itemAmount.push(rec.get('itemAmount'));
																									p.mainMaterialPrice.push(rec.get('mainMaterialPrice'));
																									p.auxiliaryMaterialPrice.push(rec.get('auxiliaryMaterialPrice'));
																									p.manpowerPrice.push(rec.get('manpowerPrice'));
																									p.machineryPrice.push(rec.get('machineryPrice'));
																									p.lossPercent.push(rec.get('lossPercent'));
																								}
																							});

																							for (var pro in p) {
																								p[pro] = p[pro].join('>>><<<');
																							}

																							Ext.Ajax.request({
																								url: './libs/budget.php?action=addItem',
																								method: 'POST',
																								params: p,
																								callback: function (opts, success, res){
																									if (success) {
																										var status = Ext.decode(res.responseText);
																										if (status.status == 'successful') {
																											Ext.Ajax.request({
																												url: './libs/editprojectbyprojectname.php',
																												method: 'POST',
																												params: {
																													budgetId: data['budgetId'],
																													projectName: projectName
																												},
																												callback: function (opts, success, res){
																													if (success) {
																														var obj = Ext.decode(res.responseText);
																														if (obj.status == 'successful') {
																															showMsg('预算保存成功！');
																														}
																													}
																												}
																											})
																										}
																									}
																								}
																							})
																						}
																					}
																				})
																			}
																			else {
																				showMsg(obj.errMsg);
																			}
																		}
																	}
																});
															}
														}
													}
												}
											});
										}
									}
								}
							});
						}
					}
				}, {
					text: '导出预算',
					handler: function (){
						var header = Ext.getCmp('gridpanel-budgetheader'),
							headerSt = header.getStore(),
							projectName;

						projectName = headerSt.getAt(1).get('content');

						if (projectName) {
							Ext.Ajax.request({
								url: './libs/budget.php?action=list',
								method: 'GET',
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText),
											flag = false,
											budgetId;
										Ext.each(obj, function (rec){
											if (rec.projectName == projectName) {
												flag = true;
												budgetId = rec.budgetId;
											}
										});
										if (!flag) {
											Ext.Msg.info('请先保存预算！');
										}
										else {
											var exportFrame = document.getElementById('exportFrame');
											exportFrame.src = './fpdf/index2.php?budgetId=' + budgetId;
										}
									}
								}
							})
						}
						else {
							Ext.Msg.info('工程地址为空！');
						}
					}
				}, {
					text: '打印预算',
					handler: function (){
						var header = Ext.getCmp('gridpanel-budgetheader'),
							headerSt = header.getStore(),
							projectName;

						projectName = headerSt.getAt(1).get('content');

						if (projectName) {
							Ext.Ajax.request({
								url: './libs/budget.php?action=list',
								method: 'GET',
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText),
											flag = false,
											budgetId;
										Ext.each(obj, function (rec){
											if (rec.projectName == projectName) {
												flag = true;
												budgetId = rec.budgetId;
											}
										});
										if (!flag) {
											Ext.Msg.info('请先保存预算！');
										}
										else {
											var win = window.open('./fpdf/index2.php?action=view&budgetId=' + budgetId,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
											win.print();
										}
									}
								}
							})
						}
						else {
							Ext.Msg.info('工程地址为空！');
						}
					}
				}, {
					text: '预览预算',
					handler: function (){
						var panel = Ext.getCmp('panel-budgetContent'),
							header = Ext.getCmp('gridpanel-budgetheader'),
							grid = panel.down('gridpanel'),
							headerSt = header.getStore(),
							st = grid.getStore();
						var win = Ext.create('FamilyDecoration.view.budget.Preview', {
							datas: st.data.items,
							headerInfo: {
								custName: headerSt.getAt(0).get('content'),
								projectName: headerSt.getAt(1).get('content')
							}
						});
						win.show();
					}
				}, {
					text: '历史预算',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.budget.History', {

						});
						win.show();
					}
				}, {
					text: '放弃预算',
					handler: function (){
						var header = Ext.getCmp('gridpanel-budgetheader'),
							budgetContent = Ext.getCmp('panel-budgetContent');
						header.clean();
						budgetContent.clean();
					}
				}],
				region: 'center'
			}
		]

		this.callParent();
	}
})