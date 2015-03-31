Ext.define('FamilyDecoration.view.chart.BatchRemove', {
	extend: 'Ext.window.Window',
	alias: 'widget.chart-batchremove',
	requires: ['FamilyDecoration.store.ChartDetail'],

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
			ctype = /chart/.test(cid) ? 'chart' : 'project',
			p = {};

		if (ctype == 'project') {
			Ext.apply(p, {
				action: 'getChartsByProjectId',
				projectId: cid
			});
		}
		else if (ctype == 'chart') {
			Ext.apply(p, {
				action: 'getChartsByChartId',
				chartId: cid
			});
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
					dataIndex: 'originalName'
				},
				{
					text: '图片内容',
					flex: 1,
					dataIndex: 'content',
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
			store: Ext.create('FamilyDecoration.store.ChartDetail', {
				autoLoad: true,
				proxy: {
					type: 'rest',
			    	url: './libs/chartdetail.php',
			        reader: {
			            type: 'json'
			        },
			        extraParams: p
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
							ids = [], p = {};

						if (recs.length > 0) {
							for (var i = 0; i < recs.length; i++) {
								ids.push(recs[i].getId());
							}
							p = {
								ids: ids.join('>>><<<')
							}
							Ext.Ajax.request({
								url: './libs/chartdetail.php?action=delChartsById',
								method: 'POST',
								params: {
									ids: p
								},
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText);
										if (obj.status == 'successful') {
											showMsg('批量删除成功！');
											st.reload();
											me.afterremoveFn();
										}
									}
								}
							});
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