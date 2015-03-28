Ext.define('FamilyDecoration.view.budget.History', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-history',

	// resizable: false,
	modal: true,
	layout: 'border',
	maximizable: true,

	afterBudgetLoad: Ext.emptyFn,

	requires: ['FamilyDecoration.view.budget.BudgetTable',
			   'FamilyDecoration.store.Budget'],

	title: '历史预算',
	width: 600,
	height: 500,
	autoScroll: true,

	initComponent: function (){
		var me = this;

		me.items = [{
			header: false,
			xtype: 'gridpanel',
			name: 'gridpanel-budgetList',
			split: true,
            collapsible: true,
			columns: [{
				text: '工程地址',
				dataIndex: 'projectName',
				flex: 1
			}],
			region: 'west',
			minWidth: 150,
			maxWidth: 400,
			width: 150,
			margin: '0 2 0 0',
			store: Ext.create('FamilyDecoration.store.Budget', {
				autoLoad: true,
				listeners: {
					load: me.afterBudgetLoad
				}
			}),
			listeners: {
				selectionchange: function (selModel, recs, opts){
					var rec = recs[0];
						contentPanel = Ext.ComponentQuery.query('[name="panel-budgetItemList"]')[0],
						grid = contentPanel.down('gridpanel'),
						custName = contentPanel.down('[name="displayfield-custName"]'),
						projectName = contentPanel.down('[name="displayfield-projectName"]'),
						exportBtn = contentPanel.down('[name="button-exportBudget"]');
					
					exportBtn.setDisabled(!rec);
					
					if (rec) {
						custName.setValue(rec.get('custName'));
						projectName.setValue(rec.get('projectName'));
						Ext.Ajax.request({
							url: './libs/budget.php?action=itemlist',
							params: {
								budgetId: rec.getId()
							},
							method: 'GET',
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.length > 0) {
										grid.getStore().loadData(obj);
									}
								}
							}
						});
					}
				}
			}
		}, {
			xtype: 'panel',
			name: 'panel-budgetItemList',
			height: 500,
			autoScroll: true,
			items: [{
				xtype: 'budget-budgettable',
				html: '<iframe id="exportHistoryFrame"  src="javascript:void(0);" style="display:none"></iframe>'
			}],
			region: 'center',
			bbar: [{
				text: '导出预算',
				name: 'button-exportBudget',
				disabled: true,
				handler: function (){
					var budgetList = me.down('[name="gridpanel-budgetList"]'),
						budgetId = budgetList.getSelectionModel().getSelection()[0].getId();
					var exportFrame = document.getElementById('exportHistoryFrame');
					exportFrame.src = './fpdf/index2.php?budgetId=' + budgetId;
				}
			}]
		}];

		me.on('show', function (win){
			var grid = win.down('[name="gridpanel-budgetList"]'),
				view = grid.getView(),
				tip;
			tip = Ext.create('Ext.tip.ToolTip', {
				target: view.el,
				delegate: view.itemSelector,
				trackMouse: true,
			    renderTo: Ext.getBody(),
			    tpl: new Ext.XTemplate(
			    	'<table class="pros">',
			        '<tr>',
			        '<td>客户名称:</td>',
			        '<td>{custName}</td>',
			        '</tr>',
			        '<tr>',
			        '<td>工程地址:</td>',
			        '<td>{projectName}</td>',
			        '</tr>',
			        '<tr>',
			        '<td>户型大小:</td>',
			        '<td>{areaSize}</td>',
			        '</tr>',
			        '<tr>',
			        '<td>合计费用:</td>',
			        '<td>{totalFee}</td>',
			        '</tr>',
			        '<tr>',
			        '<td>预算说明:</td>',
			        '<td>{comments}</td>',
			        '</tr>',
			        '</table>'
			    ),
			    listeners: {
			        beforeshow: function updateTipBody(tip) {
			        	var rec = view.getRecord(tip.triggerElement);
			        	if (rec.get('comments')) {
			        		rec.set('comments', rec.data.comments.replace(/>>><<</g, '<br />'));
			        	}
			            tip.update(rec.data);
			        }
			    }
			});
		})

		this.callParent();
	}
});