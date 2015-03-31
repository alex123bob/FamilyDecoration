Ext.define('FamilyDecoration.view.chart.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.chart-index',
	requires: ['FamilyDecoration.view.chart.AddCategory', 'FamilyDecoration.store.Chart', 'Ext.form.field.File',
			   'FamilyDecoration.view.progress.ProjectList', 'FamilyDecoration.view.chart.UploadForm',
			   'FamilyDecoration.view.chart.BatchRemove', 'FamilyDecoration.model.ChartDetail'],

	autoScroll: true,
	layout: 'border',

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'panel',
			region: 'west',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			margin: '0 1 0 0',
			width: 200,
			title: '图片分类',
			items: [{
				xtype: 'progress-projectlist',
				id: 'treepanel-chartCategory',
				name: 'treepanel-chartCategory',
				searchFilter: true,
				isForChart: true,
				autoScroll: true,
				flex: 4,
				width: '100%',
				selModel: {
					mode: 'SINGLE',
					allowDeselect: true
				},
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('projectName')) {
							var chartList = Ext.getCmp('gridpanel-chartList'),
								chartCategory = Ext.getCmp('gridpanel-chartCategory');
							chartList.refresh(rec);
							chartCategory.getSelectionModel().deselectAll();
						}
						else {
							return false;
						}
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							chartList = Ext.getCmp('gridpanel-chartList'),
							delCateBtn = Ext.getCmp('button-deleteCategory'),
							addChartBtn = Ext.getCmp('button-addProjectChart'),
							batchBtn = Ext.getCmp('button-batchremove');
						delCateBtn.setDisabled(!rec);
						addChartBtn.setDisabled(!rec);
						batchBtn.setDisabled(!rec);
						chartList.refresh(rec);
					}
				}
			} ,{
				hidden: User.isGeneral() ? true : false,
				xtype: 'gridpanel',
				name: 'gridpanel-chartCategory',
				id: 'gridpanel-chartCategory',
				selModel: {
					mode: 'SINGLE',
					allowDeselect: true
				},
				flex: 2,
				width: '100%',
				autoScroll: true,
				header: false,
				hideHeaders: true,
				store: Ext.create('FamilyDecoration.store.Chart', {
					autoLoad: true
				}),
				columns: [
					{
						text: '图片类别',
						dataIndex: 'chartCategory',
						flex: 1
					}
				],
				bbar: [{
					hidden: User.isGeneral() ? true : false,
					text: '添加',
					id: 'button-addCategory',
					name: 'button-addCategory',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.chart.AddCategory', {

						});
						win.show();
					}
				}, {
					hidden: User.isGeneral() ? true : false,
					text: '修改',
					id: 'button-editCategory',
					name: 'button-editCategory',
					disabled: true,
					handler: function (){
						var grid = Ext.getCmp('gridpanel-chartCategory'),
							rec = grid.getSelectionModel().getSelection()[0],
							selModel = grid.getSelectionModel(),
							st = grid.getStore(),
							params = {};
						Ext.Msg.prompt('修改类别名称', '请输入新类别名称', function (btnId, name){
							if (btnId == 'ok') {
								Ext.apply(params, {
									chartId: rec.getId(),
									chartCategory: name
								});
								Ext.Ajax.request({
									url: './libs/editcategory.php',
									method: 'POST',
									params: params,
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('修改成功！');
												st.reload({
													callback: function (){
														selModel.deselectAll();
														selModel.select(st.indexOf(rec));
													}
												});
											}
										}
									}
								})
							}
						}, window, false, rec.get('chartCategory'));
					}
				}, {
					hidden: User.isGeneral() ? true : false,
					text: '删除',
					id: 'button-deleteCategory',
					name: 'button-deleteCategory',
					disabled: true,
					handler: function (){
						Ext.Msg.warning('删除目录，会删除当前目录下的所有图片，确定删除吗？', function (btnId){
							if (btnId == 'yes') {
								var grid = Ext.getCmp('gridpanel-chartCategory'),
									rec = grid.getSelectionModel().getSelection()[0],
									tree = Ext.getCmp('treepanel-chartCategory'),
									treeRec = tree.getSelectionModel().getSelection()[0],
									p = rec ? {
										chartId: rec.getId()
									} : {
										projectId: treeRec.getId()
									};
								Ext.Ajax.request({
									url: rec ? './libs/chartdetail.php?action=delChartsByChartId' : './libs/chartdetail.php?action=delChartsByProjectId',
									method: 'POST',
									params: p,
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												if (rec) {
													Ext.apply(p, {
														isDeleted: true
													});
													Ext.Ajax.request({
														url: './libs/editCategory.php',
														method: 'POST',
														params: p,
														callback: function (opts, success, res){
															if (success) {
																var innerObj = Ext.decode(res.responseText);
																if (innerObj.status == 'successful') {
																	grid.getStore().reload({
																		callback: function (recs, ope, success){
																			if (success) {
																				showMsg('删除图库目录成功！');
																			}
																		}
																	});
																}
															}
														}
													});
												}
												else {
													Ext.apply(p, {
														hasChart: 0
													});
													Ext.Ajax.request({
														url: './libs/project.php?action=editProject',
														method: 'POST',
														params: p,
														callback: function (opts, success, res){
															if (success) {
																var innerObj = Ext.decode(res.responseText);
																if (innerObj.status == 'successful') {
																	tree.getStore().load({
																		node: treeRec.parentNode,
																		callback: function (recs, ope, success){
																			if (success) {
																				showMsg('删除图库目录成功！');
																			}
																		}
																	});
																}
															}
														}
													});
												}
											}
										}
									}
								})
							}
						})
					}
				}],
				listeners: {
					itemclick: function (view, rec){
						var treeCategory = Ext.getCmp('treepanel-chartCategory');
						treeCategory.getSelectionModel().deselectAll();
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							chartList = Ext.getCmp('gridpanel-chartList'),
							editCateBtn = Ext.getCmp('button-editCategory'),
							delCateBtn = Ext.getCmp('button-deleteCategory'),
							addChartBtn = Ext.getCmp('button-addCustomizedChart')
							batchBtn = Ext.getCmp('button-batchremove');
						editCateBtn.setDisabled(!rec);
						delCateBtn.setDisabled(!rec);
						addChartBtn.setDisabled(!rec);
						batchBtn.setDisabled(!rec);
						chartList.refresh(rec);
					}
				}
			}]
		}, {
			region: 'center',
			xtype: 'gridpanel',
			id: 'gridpanel-chartList',
			name: 'gridpanel-chartList',
			title: '图片显示',
			refresh: function (rec){
				if (rec) {
					if (rec.get('chartId')) {
						var chartList = this,
							st = chartList.getStore();
						st.load({
							params: {
								action: 'getChartsByChartId',
								chartId: rec.getId()
							}
						});
					}
					else if (rec.get('projectId')) {
						var chartList = this,
							st = chartList.getStore();
						st.load({
							params: {
								action: 'getChartsByProjectId',
								projectId: rec.getId()
							}
						});
					}
				}
				else {
					this.getStore().removeAll();
				}
			},
			tbar: [{
				hidden: User.isGeneral() ? true : false,
				text: '项目图库添加',
				id: 'button-addProjectChart',
				name: 'button-addProjectChart',
				disabled: true,
				handler: function (){
					var win = Ext.create('FamilyDecoration.view.chart.UploadForm', {
						url: './libs/upload.php',
						typeId: Ext.getCmp('treepanel-chartCategory').getSelectionModel().getSelection()[0].getId(),
						afterUpload: function(fp, o) {
							var tree = Ext.getCmp('treepanel-chartCategory'),
								chartList = Ext.getCmp('gridpanel-chartList'),
								rec = tree.getSelectionModel().getSelection()[0],
								p = {},
								flag = '>>><<<',
								content = '',
								originalName = '',
								projectId = '',
								details = o.result.details;

								Ext.each(details, function (val, i, arr){
									if (val['success']) {
										content += val['file'] + flag;
										originalName += val['original_file_name'] + flag;
										projectId += rec.getId() + flag;
									}
								});
								content = content.slice(0, parseInt('-' + flag.length, 10));
								originalName = originalName.slice(0, parseInt('-' + flag.length, 10));
								projectId = projectId.slice(0, parseInt('-' + flag.length, 10));
								Ext.apply(p, {
									content: content,
									originalName: originalName,
									projectId: projectId
								});
								Ext.Ajax.request({
									url: './libs/chartdetail.php?action=addCharts',
									method: 'POST',
									params: p,
									callback: function(opts, success, res) {
										if (success) {
											var obj = Ext.decode(res.responseText),
												index;
											if (obj.status == 'successful') {
												// Ext.Msg.info(o.result.msg);
												console.log(o.result);
												tree.getStore().load({
													node: rec.parentNode,
													callback: function(recs, ope, success) {
														if (success) {
															var node = ope.node.findChild('projectId', rec.getId());
															chartList.refresh();
															tree.getSelectionModel().select(node);
														}
													}
												});
											}
										}
									}
								});
						}
					});
					win.show();
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '自定义图库添加',
				id: 'button-addCustomizedChart',
				name: 'button-addCustomizedChart',
				disabled: true,
				handler: function (){
					var win = Ext.create('FamilyDecoration.view.chart.UploadForm', {
						url: './libs/upload.php',
						typeId: Ext.getCmp('gridpanel-chartCategory').getSelectionModel().getSelection()[0].getId(),
						afterUpload: function(fp, o) {
							var grid = Ext.getCmp('gridpanel-chartCategory'),
								chartList = Ext.getCmp('gridpanel-chartList'),
								rec = grid.getSelectionModel().getSelection()[0],
								p = {},
								flag = '>>><<<',
								content = '',
								originalName = '',
								chartId = '',
								details = o.result.details;

								Ext.each(details, function (val, i, arr){
									if (val['success']) {
										content += val['file'] + flag;
										originalName += val['original_file_name'] + flag;
										chartId += rec.getId() + flag;
									}
								});
								content = content.slice(0, parseInt('-' + flag.length, 10));
								originalName = originalName.slice(0, parseInt('-' + flag.length, 10));
								chartId = chartId.slice(0, parseInt('-' + flag.length, 10));

								Ext.apply(p, {
									content: content,
									originalName: originalName,
									chartId: chartId
								});
								Ext.Ajax.request({
									url: './libs/chartdetail.php?action=addCharts',
									method: 'POST',
									params: p,
									callback: function(opts, success, res) {
										if (success) {
											var obj = Ext.decode(res.responseText),
												index;
											if (obj.status == 'successful') {
												grid.getStore().reload({
													callback: function(recs, ope, success) {
														if (success) {
															index = grid.getSelectionModel().getSelection()[0].index;
															chartList.refresh(recs[index]);
														}
													}
												});
											}
										}
									}
								});

						}
					});
					win.show();
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '删除',
				id: 'button-deleteChart',
				name: 'button-deleteChart',
				disabled: true,
				handler: function (){
					var chartList = Ext.getCmp('gridpanel-chartList'),
						st = chartList.getStore(),
						rec = chartList.getSelectionModel().getSelection()[0];
					if (rec) {
						Ext.Msg.warning('是否删除当前图片吗？', function (btnId){
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: './libs/chartdetail.php?action=delChartsById',
									params: {
										ids: rec.getId()
									},
									method: 'POST',
									callback: function (opts, success, res) {
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('图片删除成功！');
												st.reload();
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
						showMsg('请选择要删除的图片！');
					}
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '批量删除',
				id: 'button-batchremove',
				name: 'button-batchremove',
				disabled: true,
				handler: function (){
					var categoryList = Ext.getCmp('gridpanel-chartCategory'),
						treeCategory = Ext.getCmp('treepanel-chartCategory'),
						chartList = Ext.getCmp('gridpanel-chartList'),
						rec;
					rec = categoryList.getSelectionModel().getSelection()[0] || treeCategory.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.chart.BatchRemove', {
						categoryId: rec.getId(),
						afterremoveFn: function (){
							chartList.getStore().reload();
						}
					});
					win.show();
				}
			}, {
				text: '返回工程',
				handler: function (){
					var sel = Ext.getCmp('treepanel-chartCategory').getSelectionModel().getSelection()[0];
					if (sel) {
						window.pro = {
							year: sel.get('projectYear'),
							month: sel.get('projectMonth'),
							pid: sel.getId()
						};

						changeMainCt('progress-index');
					}
					else {
						showMsg('请选择工程！');
					}
				}
			}],
			hideHeaders: true,
			columns: [{
				text: '图片列表',
				dataIndex: 'originalName',
				flex: 1
			}, {
				text: '图片内容',
				dataIndex: 'content',
				flex: 3,
				renderer: function (val){
					if (val) {
						if (/^http|https/.test(val)) {
							// todo
						}
						else {
							val = val.slice(1);
						}
					}				
					return '<img src="' + val + '" width="360" height="200" />';
				}
			}],
			store: Ext.create('FamilyDecoration.store.ChartDetail', {
				autoLoad: false
			}),
			listeners: {
				selectionchange: function (selModel, sels, opts){
					var rec = sels[0],
						delBtn = Ext.getCmp('button-deleteChart');
					if (rec) {
						delBtn.enable();
					}
					else {
						delBtn.disable();
					}
				},
				itemdblclick: function (view, rec, item, index, e, eOpts) {
					var url = rec.get('chartContent');
					if (url && !/^http|https/.test(url)) {
						url = url.slice(3, url.length);
					}
					else {
						// todo
					}

					var win = Ext.create('Ext.window.Window', {
						layout: 'fit',
						title: rec.get('chartDispValue'),
						width: 400,
						height: 400,
						modal: true,
						autoScroll: true,
						maximizable: true,
						items: [{
							xtype: 'image',
							src: url
						}]
					});
					win.show();
				}
			}
		}];

		this.callParent();
	}
});