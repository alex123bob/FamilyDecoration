Ext.define('FamilyDecoration.view.chart.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.chart-index',
	requires: ['FamilyDecoration.view.chart.AddCategory', 'FamilyDecoration.store.Chart', 'Ext.form.field.File',
			   'FamilyDecoration.view.progress.ProjectList', 'FamilyDecoration.view.chart.UploadForm',
			   'FamilyDecoration.view.chart.BatchRemove'],

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
							rec.set('chartContent', (rec.get('projectChart') == 1 ? '' : rec.get('projectChart')));
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
					text: '添加',
					id: 'button-addCategory',
					name: 'button-addCategory',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.chart.AddCategory', {

						});
						win.show();
					}
				}, {
					text: '修改',
					id: 'button-editCategory',
					name: 'button-editCategory',
					disabled: true,
					handler: function (){
						var grid = Ext.getCmp('gridpanel-chartCategory'),
							rec = grid.getSelectionModel().getSelection()[0],
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
												grid.getStore().reload();
											}
										}
									}
								})
							}
						}, window, false, rec.get('chartCategory'));
					}
				}, {
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
									url: './libs/deletechart.php',
									method: 'POST',
									params: {
										filename: rec ? rec.get('chartContent') : (treeRec.get('projectChart') && treeRec.get('projectChart') != 1 ? treeRec.get('projectChart') : '')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												if (rec) {
													Ext.Ajax.request({
														url: './libs/deletecategory.php',
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
														projectChart: ''
													});
													Ext.Ajax.request({
														url: './libs/deletecategory.php',
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
			refresh: function (chart){
				if (chart) {
					if (chart.get('chartId')) {
						var cid = chart.getId(),
							content = chart.get('chartContent'),
							chartList = this;
							arr = [];
						if (content) {
							content = content.split('<>');
							Ext.each(content, function (val, i){
								arr.push({
									chartListId: cid + '-' + i,
									chartContent: val.split('||')[0],
									chartDispValue: val.split('||')[1]
								});
							});
							chartList.getStore().loadData(arr);
						}
						else {
							chartList.getStore().removeAll();
						}
					}
					else if (chart.get('projectId')) {
						var cid = chart.getId(),
							content = chart.get('projectChart'),
							chartList = this;
							arr = [];
						if (content && content != 1) {
							content = content.split('<>');
							Ext.each(content, function (val, i){
								arr.push({
									chartListId: cid + '-' + i,
									chartContent: val.split('||')[0],
									chartDispValue: val.split('||')[1]
								});
							});
							chartList.getStore().loadData(arr);
						}
						else {
							chartList.getStore().removeAll();
						}
					}
				}
				else {
					this.getStore().removeAll();
				}
			},
			tbar: [{
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
								p = {
									chartId: rec.getId()
								},
								content = '',
								details = o.result.details;

								Ext.each(details, function (val, i, arr){
									if (val['success']) {
										content += val['file'] + '||' + val['original_file_name'] + '<>';
									}
								});
								content = content.slice(0, -2);
								Ext.apply(p, {
									chartContent: content,
									chartType: 'project'
								});
								Ext.Ajax.request({
									url: './libs/addchart.php',
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
								p = {
									chartId: rec.getId()
								},
								content = '',
								details = o.result.details;

								Ext.each(details, function (val, i, arr){
									if (val['success']) {
										content += val['file'] + '||' + val['original_file_name'] + '<>';
									}
								});
								content = content.slice(0, -2);

								Ext.apply(p, {
									chartContent: content,
									chartType: 'customized'
								});
								Ext.Ajax.request({
									url: './libs/addchart.php',
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
				text: '删除',
				id: 'button-deleteChart',
				name: 'button-deleteChart',
				disabled: true,
				handler: function (){
					var chartList = Ext.getCmp('gridpanel-chartList'),
						categoryList = Ext.getCmp('gridpanel-chartCategory'),
						treeCategory = Ext.getCmp('treepanel-chartCategory'),
						cate = categoryList.getSelectionModel().getSelection()[0],
						treeCate = treeCategory.getSelectionModel().getSelection()[0],
						treeSt = treeCategory.getStore(),
						chart = chartList.getSelectionModel().getSelection()[0],
						arr = chartList.getStore().data.items,
						content = '',
						p = cate ? {
							chartId: cate.getId()
						} : {
							projectId: treeCate.getId()
						};
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].raw.chartListId == chart.raw.chartListId) {
							continue;
						}
						else {
							if (content) {
								content += '<>' + arr[i].get('chartContent') + '||' + arr[i].get('chartDispValue');
							}
							else {
								content = arr[i].get('chartContent') + '||' + arr[i].get('chartDispValue');
							}
						}
					}
					Ext.apply(p, cate ? {
						chartContent: content
					} : {
						projectChart: content ? content : 1
					});
					Ext.Msg.warning('是否删除当前图片吗？', function (btnId){
						if (btnId == 'yes') {
							Ext.Ajax.request({
								url: cate ? './libs/editcategory.php' : './libs/editproject.php',
								method: 'POST',
								params: p,
								callback: function (opts, success, res){
									var obj = Ext.decode(res.responseText);
									if (success && obj.status == 'successful') {
										Ext.Ajax.request({
											url: './libs/deletechart.php',
											method: 'POST',
											params: {
												filename: chart.get('chartContent')
											},
											callback: function (opts, success, res){
												if (success) {
													var innerObj = Ext.decode(res.responseText);
													if (innerObj.status == 'successful') {
														showMsg('图片删除成功！');
														if (cate) {
															categoryList.getStore().reload({
																callback: function (recs, ope, success){
																	chartList.refresh(recs[cate.index]);
																}
															});
														}
														else {
															treeSt.load({
																node: treeCate.parentNode,
																callback: function (recs, ope, success){
																	var node = ope.node.findChild('projectId', treeCate.getId());
																	chartList.refresh();
																	treeCategory.getSelectionModel().select(node);
																}
															});
														}
													}
												}
											}
										})
									}
								}
							});
						}
					})
				}
			}, {
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
							var type = /chart/.test(rec.getId()) ? 'chart' : 'project';
							if ('chart' == type) {
								categoryList.getStore().reload({
									callback: function(recs, ope, success) {
										if (success) {
											index = categoryList.getSelectionModel().getSelection()[0].index;
											chartList.refresh(recs[index]);
										}
									}
								});
							}
							else if ('project' == type) {
								treeCategory.getStore().load({
									node: rec.parentNode,
									callback: function (recs, ope, success){
										var node = ope.node.findChild('projectId', rec.getId());
										chartList.refresh();
										treeCategory.getSelectionModel().select(node);
									}
								})
							}
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
				dataIndex: 'chartDispValue',
				flex: 1
			}, {
				text: '图片内容',
				dataIndex: 'chartContent',
				flex: 3,
				renderer: function (val){
					val = val.slice(1);
					return '<img src="' + val + '" width="360" height="200" />';
				}
			}],
			store: Ext.create('Ext.data.Store', {
				model: 'FamilyDecoration.model.Chart',
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
					url = url.slice(3, url.length);

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