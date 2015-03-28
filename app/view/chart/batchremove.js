Ext.define('FamilyDecoration.view.chart.BatchRemove', {
	extend: 'Ext.window.Window',
	alias: 'widget.chart-batchremove',
	requires: [],

	autoScroll: true,
	width: 500,
	height: 400,
	resizable: false,
	modal: true,
	maximizable: true,
	layout: 'fit',

	categoryId: undefined,
	afterremoveFn: Ext.emptyFn,

	title: '批量删除图片',

	initComponent: function (){
		var me = this;

		var cid = me.categoryId,
			ctype = /chart/.test(cid) ? 'chart' : 'project';

		if (ctype == 'project') {
			Ext.Ajax.request({
				url: './libs/project.php?action=getprojectbyid',
				method: 'GET',
				params: {
					projectId: cid
				},
				callback: function (opts, success, res){
					if (success) {
						var obj = Ext.decode(res.responseText);
						var charts = obj[0]['projectChart'];
						var grid = Ext.getCmp('gridpanel-picturelist'),
							st = grid.getStore(),
							data = [], tmp;
						charts = charts.split('<>');
						charts = (charts == '1') ? [] : charts;
						for (var i = 0; i < charts.length; i++) {
							tmp = charts[i].split('||');
							data.push({
								picId: i,
								picName: tmp[1],
								picContent: tmp[0]
							});
						}
						st.loadData(data);
					}
				}
			});
		}
		else if (ctype == 'chart') {
			Ext.Ajax.request({
				url: './libs/getcategorybyid.php',
				method: 'GET',
				params: {
					chartId: cid
				},
				callback: function (opts, success, res){
					if (success) {
						var obj = Ext.decode(res.responseText);
						var charts = obj[0]['chartContent'];
						var grid = Ext.getCmp('gridpanel-picturelist'),
							st = grid.getStore(),
							data = [], tmp;
						charts = (charts != '') ? charts.split('<>') : [];
						for (var i = 0; i < charts.length; i++) {
							tmp = charts[i].split('||');
							data.push({
								picId: i,
								picName: tmp[1],
								picContent: tmp[0]
							});
						}
						st.loadData(data);
					}
				}
			})
		}

		me.items = [{
			xtype: 'gridpanel',
			id: 'gridpanel-picturelist',
			name: 'gridpanel-picturelist',
			selType: 'checkboxmodel',
			columns: [
				{
					text: '图片名称',
					flex: 3,
					dataIndex: 'picName'
				},
				{
					text: '图片内容',
					flex: 1,
					dataIndex: 'picContent',
					renderer: function (val){
						if (val) {
							if (/^http|https/.test(val)) {
								// todo
							}
							else {
								val = val.slice(1);
							}
							return '<img src="' + val + '" alt="pic" width="50" height="50" />';
						}
						else {
							return '对应路径未找到图片';
						}
					}
				}
			],
			store: Ext.create('Ext.data.Store', {
				fields: ['picId', 'picName', 'picContent'],
				autoLoad: false,
				proxy: {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			}),
			listeners: {
				selectionchange: function (selModel, sels, opts) {
					var btn = Ext.getCmp('button-deletePics');
					btn.setDisabled(sels.length <= 0);
				}
			}
		}];

		me.buttons = [{
			text: '删除',
			id: 'button-deletePics',
			name: 'button-deletePics',
			disabled: true,
			handler: function (){
				Ext.Msg.warning('确定要删除这些图片吗？', function (btnId){
					if (btnId == 'yes') {
						var grid = Ext.getCmp('gridpanel-picturelist'),
							st = grid.getStore(),
							recs = grid.getSelectionModel().getSelection(),
							filename = [];

						if (recs.length > 0) {
							if (ctype == 'project') {
								// delete files
								for (var i = 0; i < recs.length; i++) {
									filename.push(recs[i].get('picContent'));
								}
								filename = filename.join('<>');
								Ext.Ajax.request({
									url: './libs/deletechart.php',
									method: 'POST',
									params: {
										filename: filename
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText),
												p = {
													projectId: cid,
													projectChart: ''
												},
												arr = [];
											if (obj.status == 'successful') {
												// edit database
												st.remove(recs);
												recs = st.data.items;
												for (i = 0; i < recs.length; i++) {
													arr.push(recs[i].get('picContent') + '||' + recs[i].get('picName'));
												}
												p.projectChart = (arr.length > 0) ? arr.join('<>') : '1';
												Ext.Ajax.request({
													url: './libs/project.php?action=editproject',
													method: 'POST',
													params: p,
													callback: function (opts, success, res){
														if (success) {
															var innerObj = Ext.decode(res.responseText);
															if (innerObj.status == 'successful') {
																showMsg('删除成功！');
																me.afterremoveFn();
															}
														}
													}
												})
											}
										}
									}
								});
							}
							else if (ctype == 'chart') {
								// delete files
								for (var i = 0; i < recs.length; i++) {
									filename.push(recs[i].get('picContent'));
								}
								filename = filename.join('<>');
								Ext.Ajax.request({
									url: './libs/deletechart.php',
									method: 'POST',
									params: {
										filename: filename
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText),
												p = {
													chartId: cid,
													chartContent: ''
												},
												arr = [];
											if (obj.status == 'successful') {
												// edit database
												st.remove(recs);
												recs = st.data.items;
												for (i = 0; i < recs.length; i++) {
													arr.push(recs[i].get('picContent') + '||' + recs[i].get('picName'));
												}
												p.chartContent = arr.join('<>');
												Ext.Ajax.request({
													url: './libs/editcategory.php',
													method: 'POST',
													params: p,
													callback: function (opts, success, res){
														if (success) {
															var innerObj = Ext.decode(res.responseText);
															if (innerObj.status == 'successful') {
																showMsg('删除成功！');
																me.afterremoveFn();
															}
														}
													}
												})
											}
										}
									}
								});
							}
						}
					}
				});
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		this.callParent();
	}
})