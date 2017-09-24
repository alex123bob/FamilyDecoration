Ext.define('FamilyDecoration.view.budget.BudgetPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-budgetpanel',
	width: '100%',
	height: '100%',
	layout: 'vbox',
	requires: ['Ext.form.FieldContainer', 'FamilyDecoration.store.BudgetItem', 'FamilyDecoration.view.budget.EditHeader',
			   'FamilyDecoration.view.budget.AddBasicItem', 'FamilyDecoration.view.budget.AddExistedItem',
			   'FamilyDecoration.view.budget.HistoryBudget', 'Ext.slider.Single', 'FamilyDecoration.view.budget.AddBlankItem',
			   'FamilyDecoration.view.budget.BulkDeleteSmallItem'],

	title: '预算面板',
	header: false,
	html: '<iframe id="exportFrame"  src="javascript:void(0);" style="display:none"></iframe>',

	// indicator: tells us if this is for preview or not
	isForPreview: false,

	// indicator: tells us if there is an budget existed in current panel
	budgetId: undefined,

	isSynchronousCalculation: true, // calculate simultaneously or not when editting each line of budget.

	// obj: budgetId, custName, projectOrBusinessName
	loadBudget: function (obj){
		var cmp = this,
			custNameField = cmp.down('[name="displayfield-custName"]'),
			projectOrBusinessNameField = cmp.down('[name="displayfield-projectOrBusinessName"]'),
			budgetNameField = cmp.down('[name="displayfield-budgetName"]');
		obj.custName && custNameField.setValue(obj.custName);
		obj.projectOrBusinessName && projectOrBusinessNameField.setValue(obj.projectOrBusinessName);
		obj.budgetName && budgetNameField.setValue(obj.budgetName);
		cmp.initBtn();
		if (obj.budgetId) {
			cmp.budgetId = obj.budgetId;
			cmp.refresh();
		}
	},

	initBtn: function (rec){
		var panel = this,
			addNewBtn = panel.down('[name="button-addNewItem"]'),
			insertNewBtn = panel.down('[name="button-insertNewItem"]'),
			addSmallBtnCombo = panel.down('[name="button-addSmallItemCombo"]'),
			addSmallBtn = panel.down('[name="button-addSmallItemToBigItem"]'),
			addBlankBtn = panel.down('[name="button-addBlankItemToBigItem"]'),
			delItemBtn = panel.down('[name="button-deleteItem"]'),
			discountBtn = panel.down('[name="button-priceAdjust"]'),
			bulkdeleteBtn = panel.down('[name="button-bulkDeleteSmallItem"]'),
			editBlankItemBtn = panel.down('[name="button-editBlankItem"]'),
			calculateBtn = panel.down('[name="button-calculate"]'),
			editSmallItemNameBtn = panel.down('[name="button-editSmallItemName"]');
		addNewBtn.isHidden() && addNewBtn.show();
		insertNewBtn.isHidden() && insertNewBtn.show();
		addSmallBtnCombo.isHidden() && addSmallBtnCombo.show();
		addSmallBtn.isHidden() && addSmallBtn.show();
		addBlankBtn.isHidden() && addBlankBtn.show();
		delItemBtn.isHidden() && delItemBtn.show();
		discountBtn.isHidden() && discountBtn.show();
		bulkdeleteBtn.isHidden() && bulkdeleteBtn.show();
		editSmallItemNameBtn.isHidden() && editSmallItemNameBtn.show();
		editBlankItemBtn.isHidden() && editBlankItemBtn.show();
		!panel.isSynchronousCalculation && calculateBtn.isHidden() && calculateBtn.show();
		if (rec) {
			if (rec.get('basicItemId') && !rec.get('basicSubItemId')) {
    			addSmallBtn.enable();
    			addBlankBtn.enable();
    			editSmallItemNameBtn.disable();
				insertNewBtn.enable();
    		}
    		else {
    			if (rec.get('basicSubItemId')) {
					addBlankBtn.enable();
					addSmallBtn.enable();
    				editSmallItemNameBtn.enable();
    			}
    			else {
    				editSmallItemNameBtn.disable();
					addSmallBtn.disable();
    				addBlankBtn.disable();
    			}
    			if (rec.get('isCustomized') == 'true') {
					addBlankBtn.enable();
					addSmallBtn.enable();
    				editBlankItemBtn.enable();
    			}
    			else {
    				editBlankItemBtn.disable();
    			}
				insertNewBtn.disable();
    		}
    		delItemBtn.setDisabled(!rec.get('isEditable'));
		}
		else {
			addSmallBtn.disable();
			addBlankBtn.disable();
			delItemBtn.disable();
			editSmallItemNameBtn.disable();
		}
	},

	initialize: function (){
		var cmp = this,
			grid = cmp.getComponent('gridpanel-budgetContent'),
			st = grid.getStore(),
			custNameField = cmp.down('[name="displayfield-custName"]'),
			projectOrBusinessNameField = cmp.down('[name="displayfield-projectOrBusinessName"]'),
			budgetNameField = cmp.down('[name="displayfield-budgetName"]'),
			addNewBtn = cmp.down('[name="button-addNewItem"]'),
			insertNewBtn = cmp.down('[name="button-insertNewItem"]'),
			addSmallBtnCombo = cmp.down('[name="button-addSmallItemCombo"]'),
			addSmallBtn = cmp.down('[name="button-addSmallItemToBigItem"]'),
			addBlankBtn = cmp.down('[name="button-addBlankItemToBigItem"]'),
			delItemBtn = cmp.down('[name="button-deleteItem"]'),
			discountBtn = cmp.down('[name="button-priceAdjust"]'),
			bulkdeleteBtn = cmp.down('[name="button-bulkDeleteSmallItem"]'),
			editBlankItemBtn = cmp.down('[name="button-editBlankItem"]'),
			calculateBtn = cmp.down('[name="button-calculate"]'),
			editSmallItemNameBtn = cmp.down('[name="button-editSmallItemName"]');
		st.removeAll();
		cmp.budgetId = undefined;
		custNameField.setValue('');
		projectOrBusinessNameField.setValue('');
		budgetNameField.setValue('');
		addNewBtn.hide();
		insertNewBtn.hide();
		addSmallBtn.hide();
		addBlankBtn.hide();
		addSmallBtnCombo.hide();
		delItemBtn.hide();
		discountBtn.hide();
		bulkdeleteBtn.hide();
		editBlankItemBtn.hide();
		editSmallItemNameBtn.hide();
		!cmp.isSynchronousCalculation && calculateBtn.hide();
	},

	refresh: function (func){
		var panel = this,
			grid = panel.getComponent('gridpanel-budgetContent'),
			st = grid.getStore();
		st.load({
			params: {
				budgetId: panel.budgetId
			},
			callback: function (recs, ope, success){
				if (success) {
					func && func();
				}
			}
		});
	},

	initComponent: function (){
		var me = this,
			viewMode = 'classic';

		me.tbar = [
			{
				text: '计算器',
				handler: function (){
					var win = Ext.create('Ext.window.Window', {
						width: 200,
						height: 280,
						layout: 'fit',
						modal: true,
						html: '<center><table style="border-width: thin thin thin thin; border-style: solid solid solid solid; border-color: black black black black; background-color: white;"><tbody><thead><tr><th><center><font face="arial" size="+1"><b>Calculator</b></center></font></th></tr></thead><tr><td><form name="calculator_jCzpHZ" action=""><input type="hidden" name="memory" /><input type="hidden" name="accumulator" /><input type="hidden" name="reset" value="0" /><table><tr><td align="center" colspan="4"><input type="text" name="display" readonly="readonly" size="20" /></td></tr><tr><td align="center"><input type="button" style="width:32px" value="m+" onclick="calculator_jCzpHZ.memory.value = eval(calculator_jCzpHZ.memory.value + \' + \' + calculator_jCzpHZ.display.value);" /></td><td align="center"><input type="button" style="width:32px" value="m-" onclick="calculator_jCzpHZ.memory.value = eval(calculator_jCzpHZ.memory.value + \' - \' + calculator_jCzpHZ.display.value);" /></td><td align="center"><input type="button" style="width:32px" value="mc" onclick="calculator_jCzpHZ.memory.value = \'\';" /></td><td align="center"><input type="button" style="width:32px" value="mr" onclick="calculator_jCzpHZ.display.value = calculator_jCzpHZ.memory.value;" /></td></tr><tr><td align="center"><input type="button" style="width:32px" value="1" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'1\';" /></td><td align="center"><input type="button" style="width:32px" value="2" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'2\';" /></td><td align="center"><input type="button" style="width:32px" value="3" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'3\';" /></td><td align="center"><input type="button" style="width:32px" value="+" onclick="calculator_jCzpHZ.display.value = calculator_jCzpHZ.accumulator.value = eval(calculator_jCzpHZ.accumulator.value + calculator_jCzpHZ.display.value); calculator_jCzpHZ.accumulator.value += \' + \'; calculator_jCzpHZ.reset.value = \'1\';" /></td></tr><tr><td align="center"><input type="button" style="width:32px" value="4" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'4\';" /></td><td align="center"><input type="button" style="width:32px" value="5" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'5\';" /></td><td align="center"><input type="button" style="width:32px" value="6" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'6\';" /></td><td align="center"><input type="button" style="width:32px" value="-" onclick="calculator_jCzpHZ.display.value = calculator_jCzpHZ.accumulator.value = eval(calculator_jCzpHZ.accumulator.value + calculator_jCzpHZ.display.value); calculator_jCzpHZ.accumulator.value += \' - \'; calculator_jCzpHZ.reset.value = \'1\';" /></td></tr><tr><td align="center"><input type="button" style="width:32px" value="7" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'7\';" /></td><td align="center"><input type="button" style="width:32px" value="8" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'8\';" /></td><td align="center"><input type="button" style="width:32px" value="9" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'9\';" /></td><td align="center"><input type="button" style="width:32px" value="x" onclick="calculator_jCzpHZ.display.value = calculator_jCzpHZ.accumulator.value = eval(calculator_jCzpHZ.accumulator.value + calculator_jCzpHZ.display.value); calculator_jCzpHZ.accumulator.value += \' * \'; calculator_jCzpHZ.reset.value = \'1\';" /></td></tr><tr><td align="center"><input type="button" style="width:32px" value="c" onclick="calculator_jCzpHZ.accumulator.value = \'\'; calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\';" /></td><td align="center"><input type="button" style="width:32px" value="0" onclick="if(calculator_jCzpHZ.reset.value == \'1\') { calculator_jCzpHZ.display.value = \'\'; calculator_jCzpHZ.reset.value = \'0\'; } calculator_jCzpHZ.display.value += \'0\';" /></td><td align="center"><input type="button" style="width:32px" value="=" onclick="calculator_jCzpHZ.display.value = eval(calculator_jCzpHZ.accumulator.value + calculator_jCzpHZ.display.value); calculator_jCzpHZ.accumulator.value = \'\'; calculator_jCzpHZ.reset.value = \'1\';" /></td><td align="center"><input type="button" style="width:32px" value="/" onclick="calculator_jCzpHZ.display.value = calculator_jCzpHZ.accumulator.value = eval(calculator_jCzpHZ.accumulator.value + calculator_jCzpHZ.display.value); calculator_jCzpHZ.accumulator.value += \' / \'; calculator_jCzpHZ.reset.value = \'1\';" /></td></tr></table></form></td></tr><tfoot><tr><td><div style="text-align: right;"><font face="arial" size="-3"><a href="http://www.joeswebtools.com/widgets/calculator/" title="Get a calculator widget for your website">Joe\'s</a></font></div></td></tr></tfoot></tbody></table></center>',
						buttons: [
							{
								text: '输入',
								handler: function (){
									win.close();
								}
							}
						]
					});
					win.show();
				}
			},
			{
				text: '切换模式',
				tooltip: '精简与原始预算界面切换',
				icon: './resources/img/switch_convolution.png',
				name: 'button-switchMode',
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						colMgm = grid.getColumnManager(),
						columns = colMgm.getColumns(),
						visibleColIndex = [1,2,3,4];
					Ext.each(columns, function (col, index, self){
						if (viewMode === 'classic') {
							col.setVisible(visibleColIndex.indexOf(index) !== -1);
						}
						else if (viewMode === 'simplified') {
							col.setVisible(true);
						}
					});
					if (viewMode === 'classic') {
						viewMode = 'simplified';
					}
					else if (viewMode === 'simplified') {
						viewMode = 'classic';
					}
				}
			},
			{
				text: '预算细则',
				icon: './resources/img/detail.png',
				tooltip: '新建或编辑预算头部信息',
				name: 'button-addBudget',
				handler: function (){
					if (me.budgetId) {
						Ext.Ajax.request({
							url: './libs/budget.php?action=view',
							method: 'GET',
							params: {
								budgetId: me.budgetId
							},
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									var win = Ext.create('FamilyDecoration.view.budget.EditHeader', {
										budgetPanel: me,
										budget: obj[0],
										addressType: obj[0]['businessId'] ? 'business' : (obj[0]['projectId'] ? 'project' : '')
									});
									win.show();
								}
							}
						})
					}
					else {
						var win = Ext.create('FamilyDecoration.view.budget.EditHeader', {
							budgetPanel: me
						});
						win.show();
					}
				}
			},
			{
				text: '追加大项',
				icon: './resources/img/add2.png',
				tooltip: '在预算末尾追加新的基础大项',
				name: 'button-addNewItem',
				hidden: true,
				handler: function (){
					var win = Ext.create('FamilyDecoration.view.budget.AddBasicItem', {
						grid: me.getComponent('gridpanel-budgetContent'),
						budgetId: me.budgetId
					});

					win.show();
				}
			},
			{
				text: '插入大项',
				tooltip: '在当前选择的大项或者小项所属的大项前面插入大项',
				name: 'button-insertNewItem',
				icon: './resources/img/insert.png',
				hidden: true,
				disabled: true,
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						rec = grid.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.budget.AddBasicItem', {
						grid: me.getComponent('gridpanel-budgetContent'),
						budgetId: me.budgetId,
						insertBeforeItemCode: rec.get('itemCode')
					});

					win.show();
				}
			},
			{
				xtype: 'splitbutton',
				text: '添加小项',
				tooltip: '为已有大项添加小项',
				icon: './resources/img/combo.png',
				hidden: true,
				name: 'button-addSmallItemCombo',
				menu: new Ext.menu.Menu({
					items: [
						{
							text: '基础项',
							tooltip: '从基础项中选择小项',
							icon: './resources/img/add3.png',
							name: 'button-addSmallItemToBigItem',
							disabled: true,
							hidden: true,
							handler: function (){
								var grid = me.getComponent('gridpanel-budgetContent'),
									rec = grid.getSelectionModel().getSelection()[0];
								if (rec) {
									// 大项
									if (rec.get('basicItemId') && !rec.get('basicSubItemId')) {
										var win = Ext.create('FamilyDecoration.view.budget.AddExistedItem', {
											grid: me.getComponent('gridpanel-budgetContent'),
											budgetId: me.budgetId,
											bigItem: rec
										});

										win.show();
									}
									// 小项
									else if (!rec.get('basicItemId') && rec.get('basicSubItemId')) {
										var win = Ext.create('FamilyDecoration.view.budget.AddExistedItem', {
											grid: me.getComponent('gridpanel-budgetContent'),
											budgetId: me.budgetId,
											smallItem: rec
										});

										win.show();
									}
									// 空白项
									else if (rec.get('isCustomized')) {
										var win = Ext.create('FamilyDecoration.view.budget.AddExistedItem', {
											grid: me.getComponent('gridpanel-budgetContent'),
											budgetId: me.budgetId,
											smallItem: rec
										});

										win.show();
									}
								}
								else {
									showMsg('请选择大项！');
								}
							}
						},
						{
							text: '空白项',
							tooltip: '添加空白项到所选大项中',
							icon: './resources/img/blank.png',
							name: 'button-addBlankItemToBigItem',
							disabled: true,
							hidden: true,
							handler: function (){
								var grid = me.getComponent('gridpanel-budgetContent'),
									rec = grid.getSelectionModel().getSelection()[0];
								if (rec) {
									if (rec.get('basicItemId') && !rec.get('basicSubItemId')) {
										var win = Ext.create('FamilyDecoration.view.budget.AddBlankItem', {
											grid: grid,
											budgetId: me.budgetId,
											bigItem: rec
										});

										win.show();
									}
									// 小项
									else if (!rec.get('basicItemId') && rec.get('basicSubItemId')) {
										var win = Ext.create('FamilyDecoration.view.budget.AddBlankItem', {
											grid: grid,
											budgetId: me.budgetId,
											smallItem: rec
										});

										win.show();
									}
									// 空白项
									else if (rec.get('isCustomized')) {
										var win = Ext.create('FamilyDecoration.view.budget.AddBlankItem', {
											grid: grid,
											budgetId: me.budgetId,
											smallItem: rec
										});

										win.show();
									}
								}
								else {
									showMsg('请选择大项！');
								}
							}
						}
					]
				})
			},
			{
				text: '修改名称',
				tooltip: '修改小项名称',
				icon: './resources/img/edit.png',
				name: 'button-editSmallItemName',
				disabled: true,
				hidden: true,
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						view = grid.getView(),
						rec = grid.getSelectionModel().getSelection()[0];
					if (rec) {
						if (rec.get('basicSubItemId')) {
							Ext.Msg.prompt('修改名称', '请输入小项名称:', function (btnId, txt){
								if (btnId == 'ok') {
									if (txt != '') {
										Ext.Ajax.request({
											url: './libs/budget.php?action=editItem',
											method: 'POST',
											params: {
												budgetItemId: rec.getId(),
												itemName: txt
											},
											callback: function (opts, success, res){
												if (success){
													var obj = Ext.decode(res.responseText);
													if ('successful' == obj.status) {
														showMsg('修改成功！');
														me.refresh();
														grid.getSelectionModel().select(rec);
				            							view.focusRow(rec, 200);
													}
													else {
														showMsg(obj.errMsg);
													}
												}
											}
										});
									}
									else {
										Ext.Msg.error('名称不能为空！');
										grid.getSelectionModel().select(rec);
				            			view.focusRow(rec, 200);
									}
								}
							}, window, false, rec.get('itemName'));
						}
						else {
							showMsg('选择项不是小项！');
						}
					}
					else {
						showMsg('请选择需要更改名称的小项！');
					}
				}
			},
			{
				text: '删除',
				tooltip: '删除预算项目',
				icon: './resources/img/delete3.png',
				name: 'button-deleteItem',
				disabled: true,
				hidden: true,
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						view = grid.getView(),
						st = grid.getStore(),
						rec = grid.getSelectionModel().getSelection()[0],
						index = st.indexOf(rec);
					if (rec && rec.get('isEditable')) {
						Ext.Msg.warning('确定要删除选中项目吗？', function (btnId){
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: 'libs/budget.php?action=delItem',
									method: 'POST',
									params: {
										budgetItemId: rec.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												me.refresh(function (){
													var newRec = st.getAt(index);
													grid.getSelectionModel().select(newRec);
				            						view.focusRow(newRec, 200);
												});
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						})
					}
					else {
						showMsg('未选择项目或者项目不可编辑！');
					}
				}
			},
			{
				text: '调价',
				icon: './resources/img/price.png',
				name: 'button-priceAdjust',
				hidden: true,
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						rec = grid.getSelectionModel().getSelection()[0];
					if (me.budgetId) {
						if (rec) {
							var win = Ext.create('Ext.window.Window', {
								title: '调整价格',
								width: 300,
								height: 140,
								bodyPadding: 10,
								modal: true,
								items: [{
									xtype: 'slider',
									autoScroll: true,
									increment: 1,
									minValue: 85,
									maxValue: 130,
									width: '100%',
									height: 20,
									value: 100,
									listeners: {
										change: function (slider, newVal, thumb, opts){
											var textField = win.down('textfield');
											textField.setValue(newVal);
										}
									}
								}, {
									xtype: 'textfield',
									fieldLabel: '折扣(%)',
									readOnly: true,
									width: '100%',
									value: 100
								}],
								buttons: [{
									text: '确定',
									handler: function (){
										var textField = win.down('textfield'),
											discount = parseInt(textField.getValue(), 10);
										Ext.Ajax.request({
											url: './libs/budget.php?action=discount',
											method: 'POST',
											params: {
												budgetId: me.budgetId,
												discount: discount,
												budgetItemId: rec.getId()
											},
											callback: function (opts, success, res){
												if (success) {
													var obj = Ext.decode(res.responseText);
													if (obj.status == 'successful') {
														showMsg('调价成功！');
														me.refresh();
														win.close();
													}
													else {
														showMsg(obj.errMsg);
													}
												}
											}
										});
									}
								}, {
									text: '取消',
									handler: function (){
										win.close();
									}
								}]
							});

							win.show();
						}
						else {
							showMsg('请选择预算条目！');
						}
					}
					else {
						showMsg('当前没有预算！');
					}
				}
			},
			{
				text: '计算并保存',
				icon: './resources/img/button-background.png',
				hidden: true,
				name: 'button-calculate',
				handler: function (){
					me.refresh(function (){
						showMsg('计算完毕!');
					});
				}
			},
			{
				text: '修改空白项',
				icon: './resources/img/edit1.png',
				hidden: true,
				disabled: true,
				name: 'button-editBlankItem',
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						rec = grid.getSelectionModel().getSelection()[0];
					if (rec && rec.get('isCustomized') == 'true') {
						var win = Ext.create('FamilyDecoration.view.budget.AddBlankItem', {
							grid: grid,
							budgetId: me.budgetId,
							rec: rec
						});

						win.show();
					}
					else {
						showMsg('请选择要编辑的空白项！');
					}
				}
			},
			{
				text: '批量删除',
				tooltip: '自定义删除预算条目，只删除对应大项下面的小项，不删除大项。如要删除大项，请选择删除按钮。',
				icon: './resources/img/delete1.png',
				hidden: true,
				name: 'button-bulkDeleteSmallItem',
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent');
					var win = Ext.create('FamilyDecoration.view.budget.BulkDeleteSmallItem', {
						grid: grid,
						budgetId: me.budgetId
					});
					win.show();
				}
			}
		];

		me.bbar = [
			{
				text: '初始化',
				icon: './resources/img/initialize.png',
				tooltip: '清空当前预算信息，用于已经加载了预算情况后进行新建预算',
				name: 'button-initialize',
				handler: function (){
					me.initialize();
				}
			},
			{
				text: '打印预算',
				icon: './resources/img/print.png',
				handler: function (){
					if (me.budgetId) {
						Ext.Msg.confirm('打印确认', '打印简版请点击是<br />打印完整版请点击否', function (btnId) {
							if(btnId == 'cancel')
								return ;
							var url = './fpdf/'+(btnId == 'yes' ? 'index2' : 'index3')+'.php?action=view&budgetId=' + me.budgetId;
							var win = window.open(url,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
							win.print();
						});
					}
					else {
						showMsg('没有预算！');
					}
				}
			},
			{
				text: '导出预算',
				icon: './resources/img/pdf.png',
				handler: function (){
					if (me.budgetId) {
						Ext.Msg.confirm('导出预算', '导出简版请点击是<br />导出完整版请点击否', function (btnId) {
							if(btnId == 'cancel')
								return ;
							var exportFrame = document.getElementById('exportFrame');
							exportFrame.src = './fpdf/'+(btnId == 'yes' ? 'index2' : 'index3')+'.php?budgetId=' + me.budgetId;
						});
					}
					else {
						showMsg('没有预算！');
					}
				}
			},
			{
				text: '预览预算',
				icon: './resources/img/preview.png',
				handler: function (){
					if (me.budgetId) {
						Ext.Msg.confirm('预览预算', '预览简版请点击是<br />预览完整版请点击否', function (btnId) {
							if(btnId == 'cancel')
								return ;
							var url = './fpdf/'+(btnId == 'yes' ? 'index2' : 'index3')+'.php?action=view&budgetId=' + me.budgetId
							var win = window.open(url,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
						});
					}
					else {
						showMsg('没有预算！');
					}
				}
			},
			{
				text: '历史预算',
				icon: './resources/img/history.png',
				tooltip: '查看、加载历史预算',
				name: 'button-historyBudget',
				handler: function (){
					var win = Ext.create('FamilyDecoration.view.budget.HistoryBudget', {
						budgetPanel: me
					});
					win.show();
				}
			},
			// {
			// 	text: '导出预算',
			// 	icon: './resources/img/excel.png',
			// 	tooltip: '导出excel版本的预算，用于需要调整打印格式的预算',
			// 	handler: function (){
			// 		if (me.budgetId) {
			// 			var exportFrame = document.getElementById('exportFrame');
			// 			exportFrame.src = './phpexcel/index.php?budgetId=' + me.budgetId;
			// 		}
			// 		else {
			// 			showMsg('没有预算！');
			// 		}
			// 	}
			// },
			{
				text: '置为模板',
				icon: './resources/img/convert.png',
				tooltip: '将当前预算置为模板',
				handler: function (){
					if (me.budgetId) {
						Ext.Msg.prompt('设置模板名称', '请输入模板名称', function (btnId, text){
							if (btnId == 'ok') {
								Ext.Ajax.request({
									url: './libs/budget.php?action=createBudgetTemplateFromBudget',
									params: {
										budgetId: me.budgetId,
										budgetTemplateName: text
									},
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('置为模板成功！');
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								});
							}
						});
					}
					else {
						showMsg('没有预算！');
					}
				}
			},
			{
				text: '预算完成',
				icon: './resources/img/complete.png',
				tooltip: '将当前预算置为完成，此后对应项目无需出现在待做预算的列表中',
				name: 'button-completeBudget',
				handler: function (){
					if (me.budgetId) {
						Ext.Msg.warning('确认将当前预算置为完成吗？', function (btnId){
							if ('yes' == btnId) {
								Ext.Ajax.request({
									url: './libs/budget.php?action=finishBudget',
									method: 'POST',
									params: {
										budgetId: me.budgetId
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('预算完成！');
												if (obj.projectId) {
													Ext.Ajax.request({
														url: './libs/project.php?action=getProjectsByProjectId',
														method: 'GET',
														params: {
															projectId: obj.projectId
														},
														callback: function (opts, success, res){
															if (success) {
																var arr = Ext.decode(res.responseText),
																	salesmanName = arr[0]['salesmanName'],
																	designerName = arr[0]['designerName'],
																	budgetName = me.down('[name="displayfield-budgetName"]').getValue(),
																	address = me.down('[name="displayfield-projectOrBusinessName"]').getValue(),
																	custName = me.down('[name="displayfield-custName"]').getValue();
																var content = User.getRealName() + '将预算"' + budgetName + '"置为完成！对应工程地址为"' + address + '", 客户名称为"' + custName + '"';
																Ext.Ajax.request({
																	url: './libs/user.php?action=getUserByName',
																	method: 'GET',
																	params: {
																		name: salesmanName
																	},
																	callback: function (opts, success, res){
																		if (success) {
																			var user = Ext.decode(res.responseText);
																			user = user[0];
																			sendMsg(User.getName(), salesmanName, content);
																			sendMail(User.getName(), user['mail'], '预算完成！', content);
																		}
																	}
																});
																Ext.Ajax.request({
																	url: './libs/user.php?action=getUserByName',
																	method: 'GET',
																	params: {
																		name: designerName
																	},
																	callback: function (opts, success, res){
																		if (success) {
																			var user = Ext.decode(res.responseText);
																			user = user[0];
																			sendMsg(User.getName(), designerName, content);
																			sendMail(User.getName(), user['mail'], '预算完成！', content);
																		}
																	}
																});
															}
														}
													})
												}
												else if (obj.businessId) {
													Ext.Ajax.request({
														url: './libs/business.php?action=getBusinessById',
														method: 'GET',
														params: {
															businessId: obj.businessId
														},
														callback: function (opts, success, res){
															if (success) {
																var arr = Ext.decode(res.responseText),
																	salesmanName = arr[0]['salesmanName'],
																	designerName = arr[0]['designerName'],
																	budgetName = me.down('[name="displayfield-budgetName"]').getValue(),
																	address = me.down('[name="displayfield-projectOrBusinessName"]').getValue(),
																	custName = me.down('[name="displayfield-custName"]').getValue();
																var content = User.getRealName() + '将预算"' + budgetName + '"置为完成！对应工程地址为"' + address + '", 客户名称为"' + custName + '"';
																var content = User.getRealName() + '将预算' + budgetName + '置为完成！';
																Ext.Ajax.request({
																	url: './libs/user.php?action=getUserByName',
																	method: 'GET',
																	params: {
																		name: salesmanName
																	},
																	callback: function (opts, success, res){
																		if (success) {
																			var user = Ext.decode(res.responseText);
																			user = user[0];
																			sendMsg(User.getName(), salesmanName, content);
																			sendMail(User.getName(), user['mail'], '预算完成！', content);
																		}
																	}
																});
																Ext.Ajax.request({
																	url: './libs/user.php?action=getUserByName',
																	method: 'GET',
																	params: {
																		name: designerName
																	},
																	callback: function (opts, success, res){
																		if (success) {
																			var user = Ext.decode(res.responseText);
																			user = user[0];
																			sendMsg(User.getName(), designerName, content);
																			sendMail(User.getName(), user['mail'], '预算完成！', content);
																		}
																	}
																});
															}
														}
													});
												}
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						});
					}
					else {
						showMsg('没有预算！');
					}
				}
			}
		];

		me.columnRenderer = function (val, meta, rec, rowIndex, colIndex, st, view){
			// 小项
			if ((rec.get('basicSubItemId') && !rec.get('basicItemId')) || rec.get('isCustomized') == 'true' ) {
				return val;
			}
			// 大项
			else if (!rec.get('basicSubItemId') && rec.get('basicItemId')) {
				return '';
			}
			// 空项
			else if (rec.get('itemName') == '') {
				return '';
			}
			// 特殊项
			else if ('NOPQRS'.indexOf(rec.get('itemCode')) != -1 && rec.get('itemCode') != '') {
				switch (colIndex) {
					case 4:
					if ('NS'.indexOf(rec.get('itemCode')) != -1) {
						val = '';
					}
					break;
					// 主单
					case 5:
					// 辅单
					case 7:
					// 辅总
					case 8:
					// 人单
					case 9:
					// 人总
					case 10:
					// 机单
					case 11:
					// 机总
					case 12:
					// 损耗
					case 13:
					// 人成本
					case 15:
					// 主成本
					case 16:
					val = '';
					break;
				}
				return val;
			}
			// 小计
			else if (!rec.get('basicItemId') && !rec.get('basicSubItemId') && rec.get('itemCode') == '') {
				switch (colIndex) {
					// 数量
					case 4:
					// 主单
					case 5:
					// 辅单
					case 7:
					// 人单
					case 9:
					// 机单
					case 11:
					// 损耗
					case 13:
					val = '';
					break;
					// 人成本
					case 15:
					val = rec.get('manpowerTotalCost');
					break;
					// 主成本
					case 16:
					val = rec.get('mainMaterialTotalCost');
					break;
				}
				return val;
			}
			else {
				return '';
			}
		}

		me.items = [
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				height: 60,
				items: [
					{
						width: 80,
						height: 60,
						xtype: 'image',
						margin: '0 0 0 250',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-budgetName',
						value: '',
						hideLabel: true,
						fieldStyle: {
							fontSize: '24px',
							lineHeight: '60px'
						},
						style: {
							fontFamily: '黑体'
						},
						width: 700
					}
				]
			},
			{
				xtype: 'fieldcontainer',
				layout: {
					type: 'hbox'
				},
				items: [{
					xtype: 'displayfield',
					fieldLabel: '客户名称',
					name: 'displayfield-custName',
					flex: 1
				}, {
					xtype: 'displayfield',
					fieldLabel: '工程地址',
					name: 'displayfield-projectOrBusinessName',
					flex: 1
				}],
				width: '100%',
				flex: 1
			},
			{
				xtype: 'gridpanel',
				header: false,
				autoScroll: true,
				itemId: 'gridpanel-budgetContent',
				cls: 'gridpanel-budgetContent',
				width: '100%',
				flex: 15,
				columnLines: true, // config vertical line of cell
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						pluginId: 'cellEditor',
			            clicksToEdit: 1,
			            listeners: {
			            	beforeedit: function (editor, e) {
			            		var rec = e.record;
			            		if (e.field == 'itemAmount') {
									if (rec.get('basicSubItemId') || 'true' == rec.get('isCustomized')) {
										return true;
									}
									// 效果图编辑数量
									else if (rec.get('itemCode') == 'P') {
										return true;
									}
									// 设计费百分比
									else if (rec.get('itemCode') == 'O') {
										return true;
									}
									// 税金百分比
									else if (rec.get('itemCode') == 'R') {
										return true;
									} 
									else {
										return false;
									}
			            		}
			            		else if (e.field == 'itemName') {
			            			if (rec.get('basicSubItemId')) {
			            				return true;
			            			}
			            			else {
			            				return false;
			            			}
			            		}
			            		else if (e.field == 'remark') {
			            			return false;
			            		}
			            	},
			            	edit: function (editor, e){
			            		Ext.suspendLayouts();

			            		var rec = e.record,
			            			field = e.field;

			            		if (field == 'itemAmount') {
			            			Ext.Ajax.request({
				            			url: './libs/budget.php?action=editItem',
				            			method: 'POST',
				            			params: {
				            				budgetItemId: rec.getId(),
				            				itemAmount: rec.get('itemAmount')
				            			},
				            			callback: function (opts, success, res){
				            				if (success) {
				            					var obj = Ext.decode(res.responseText);
				            					if (obj.status == 'successful') {
				            						showMsg('编辑成功！');
				            					}
				            					else {
				            						showMsg(obj.errMsg);
				            					}
				            				}
				            			}
				            		});
			            		}
			            		else if (field == 'itemName') {
			            			Ext.Ajax.request({
										url: './libs/budget.php?action=editItem',
										method: 'POST',
										params: {
											budgetItemId: rec.getId(),
											itemName: rec.get('itemName')
										},
										callback: function (opts, success, res){
											if (success){
												var obj = Ext.decode(res.responseText);
												if ('successful' == obj.status) {
													showMsg('修改成功！');
												}
												else {
													showMsg(obj.errMsg);
												}
											}
										}
									});
			            		}
			            		else if (field == 'remark') {
			            			// todo
			            		}

			            		rec.commit();

			            		// synchronize immediately after editting
			            		if (me.isSynchronousCalculation) {
			            			me.refresh(function (){
				            			var grid = me.getComponent('gridpanel-budgetContent'),
				            				view = grid.getView(),
				            				st = grid.getStore(),
				            				itemCount = st.getCount();
				            			grid.getSelectionModel().select(rec);
				            			view.focusRow(rec, 200);
				            			if (field == 'itemAmount') {
			            					var rowIndex = st.indexOf(rec);
				            				editor.startEditByPosition({row: rowIndex + 1, column: 4});	
			            				}
				            		});
			            		}
			            		else {
			            			// do nothing. wait for multiple updating
			            		}

			            		Ext.resumeLayouts();
			            	},
			            	validateedit: function (editor, e, opts){
			            		var rec = e.record;
			            		if (e.field == 'itemAmount') {
			            			if (isNaN(e.value) || !/^-?\d+(\.\d+)?$/.test(e.value) ){
				            			return false;
				            		}
				            		else if (e.value == e.originalValue) {
				            			return false;
				            		}
			            		}
			            		else if (e.field == 'itemName') {
			            			if (e.value == e.originalValue) {
			            				return false;
			            			}
			            		}
			            	}
			            }
			        })
					// 用于scrollTo
					// {
					// 	ptype: 'bufferedrenderer'
					// }
				],
				store: Ext.create('FamilyDecoration.store.BudgetItem'),
				columns: [
					{
						xtype: 'actioncolumn',
						width: 20,
						align: 'center',
						items: [
							{
								icon: './resources/img/upward-arrow.png',
								tooltip: '向上调整',
								getClass: function (val, meta, rec){
									if (rec.get('basicSubItemId') || 'true' == rec.get('isCustomized')) {
										return '';
									}
									else {
										return 'visibilityHidden';
									}
								},
								isDisabled: function (view, rowIndex, colIndex, item, rec){
									if (rec.get('basicSubItemId') || 'true' == rec.get('isCustomized')) {
										return false;
									}
									else {
										return true;
									}
								},
								handler: function (view, rowIndex, colIndex){
									var rec = view.getStore().getAt(rowIndex);
									Ext.Ajax.request({
										url: './libs/budget.php?action=moveItemUpward',
										method: 'POST',
										params: {
											itemCode: rec.get('itemCode'),
											budgetItemId: rec.getId(),
											budgetId: rec.get('budgetId')
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if ('successful' == obj.status) {
													showMsg('调整成功！');
													me.refresh(function (){
														view.getSelectionModel().select(rec);
				            							view.focusRow(rec, 200);
													});
												}
												else {
													showMsg(obj.errMsg);
												}
											}
										}
									});
								}
							},
							{
								icon: './resources/img/downward-arrow.png',
								tooltip: '向下调整',
								getClass: function (val, meta, rec){
									if (rec.get('basicSubItemId') || 'true' == rec.get('isCustomized')) {
										return '';
									}
									else {
										return 'visibilityHidden';
									}
								},
								isDisabled: function (view, rowIndex, colIndex, item, rec){
									if (rec.get('basicSubItemId') || 'true' == rec.get('isCustomized')) {
										return false;
									}
									else {
										return true;
									}
								},
								handler: function (view, rowIndex, colIndex){
									var rec = view.getStore().getAt(rowIndex);
									Ext.Ajax.request({
										url: './libs/budget.php?action=moveItemDownward',
										method: 'POST',
										params: {
											itemCode: rec.get('itemCode'),
											budgetItemId: rec.getId(),
											budgetId: rec.get('budgetId')
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if ('successful' == obj.status) {
													showMsg('调整成功！');
													me.refresh(function (){
														view.getSelectionModel().select(rec);
				            							view.focusRow(rec, 200);
													});
												}
												else {
													showMsg(obj.errMsg);
												}
											}
										}
									});
								}
							}
						]
					},
			        {
			        	text: '编号',
			        	dataIndex: 'itemCode',
			        	flex: 0.5,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true,
	                	renderer: function (val, meta, rec){
	                		if (rec.get('isCustomized') == 'true') {
	                			meta.tdAttr = 'style="background: #EBF49D;"';
	                		}
	                		return val;
	                	}
			        },
			        {
			        	text: '名称',
			        	dataIndex: 'itemName',
			        	flex: 0.8,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true,
	                	editor: me.isForPreview ? null : {
	                		xtype: 'textfield',
	                		allowBlank: false
	                	}
			        },
			        {
			        	text: '单位', 
			        	dataIndex: 'itemUnit',
			        	flex: 0.5,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true
			        },
			        {
			        	text: '数量',
			        	flex: 0.5, 
			        	dataIndex: 'itemAmount',
	                	draggable: false,
	                	align: 'center',
	                	editor: me.isForPreview ? null : {
	                		xtype: 'textfield',
	                		allowBlank: false,
	                		maskRe: /[\d\.\-]/
	                	},
	                	sortable: false,
	                	menuDisabled: true,
	                	renderer: me.columnRenderer
			        },
			        {
			        	text: '主材',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'mainMaterialPrice',
			        			// flex: 0.5,
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			renderer: me.columnRenderer
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 59,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'mainMaterialTotalPrice',
	                			renderer: me.columnRenderer
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '辅材',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'auxiliaryMaterialPrice',
			        			// flex: 0.5,
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			renderer: me.columnRenderer
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 59,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'auxiliaryMaterialTotalPrice',
	                			renderer: me.columnRenderer
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '人工',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'manpowerPrice',
			        			// flex: 0.5,
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			renderer: me.columnRenderer
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 59,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'manpowerTotalPrice',
	                			renderer: me.columnRenderer
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '机械',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'machineryPrice',
			        			// flex: 0.5,
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			renderer: me.columnRenderer
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 59,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'machineryTotalPrice',
	                			renderer: me.columnRenderer
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '损耗',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'lossComputed',
			        			// flex: 0.5,
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			renderer: me.columnRenderer
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '备注',
			        	flex: 1.7,
			        	draggable: false,
			        	align: 'center',
			        	dataIndex: 'remark',
			        	sortable: false,
			        	editor: me.isForPreview ? null : {
	                		xtype: 'textarea'
	                	},
	                	menuDisabled: true
			        },
			        {
			        	text: '成本',
			        	hidden: User.isAdmin() || User.isBudgetManager() ? false : true,
			        	draggable: false,
			        	align: 'center',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '人工',
			        			dataIndex: 'manpowerCost',
			        			width: 60,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true,
			        			renderer: me.columnRenderer
			        		},
			        		{
			        			text: '主材',
			        			dataIndex: 'mainMaterialCost',
			        			width: 59,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true,
			        			renderer: me.columnRenderer
			        		}
			        	]
			        }
			    ],
			    listeners: {
			    	selectionchange: function (cmp, sels, opts){
			    		var rec = sels[0];
			    		me.initBtn(rec);
			    	},
			    	afterrender: function(grid, opts) {
						var view = grid.getView();
						var tip = Ext.create('Ext.tip.ToolTip', {
							target: view.el,
							delegate: view.cellSelector,
							trackMouse: true,
							renderTo: Ext.getBody(),
							listeners: {
								beforeshow: function(tip) {
									var gridColumns = view.getGridColumns();
									var cellIndex = tip.triggerElement.cellIndex;
									var column = gridColumns[cellIndex];
									var rec = view.getRecord(tip.triggerElement.parentNode);
									var val = rec.get(column.dataIndex);
									if (val) {
										switch (cellIndex) {
											// 主单
											case 5:
											val = val + '<br />' + rec.get('orgMainMaterialPrice');
											break;
											// 辅单
											case 7:
											val = val + '<br />' + rec.get('orgAuxiliaryMaterialPrice');
											break;
											// 人单
											case 9:
											val = val + '<br />' + rec.get('orgManpowerPrice');
											break;
											// 机单
											case 11:
											val = val + '<br />' + rec.get('orgMachineryPrice');
											break;
											default:
											val.replace && (val = val.replace(/\n/g, '<br />'));
											break;
										}
										tip.update(val);
									} 
									else {
										return false;
									}
								}
							}
						});
                    }
			    }
			}
		];

		me.callParent();
	}
});