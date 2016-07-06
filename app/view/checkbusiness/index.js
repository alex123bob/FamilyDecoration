Ext.define('FamilyDecoration.view.checkbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checkbusiness-index',
	requires: ['FamilyDecoration.view.mybusiness.Index'],

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	// these two fields are used for prompt window message operation.
	salesmanName: undefined,
	businessId: undefined,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			title: '业务员',
			height: '100%',
			id: 'gridpanel-businessStaff',
			name: 'gridpanel-businessStaff',
			flex: 1,
			hidden: me.salesmanName ? true : false,
			columns: [{
				text: '姓名',
				dataIndex: 'salesman',
				flex: 1,
				renderer: function (val, meta, rec){
					var num = rec.get('number'),
					 	ALevelNumber = rec.get('ALevelNumber'),
						numStr = '';

						numStr = '<font style="color: ' + (ALevelNumber > 0 ? 'blue; text-shadow: #8F7 ' : 'white; text-shadow: black ') 
								+ '0.1em 0.1em 0.2em;"><strong>[' + ALevelNumber + '/'+num+']</strong></font>';

					if (parseInt(rec.get('apply'), 10) > 0) {
						meta.style = 'background: #ffff00;';
					}

					return val + numStr;
				}
			}],
			hideHeaders: true,
			style: {
				borderRightStyle: 'solid',
				borderRightWidth: '1px'
			},
			store: Ext.create('Ext.data.Store', {
				fields: ['salesman', 'salesmanName', 'number', 'apply','ALevelNumber'],
				autoLoad: true,
				filters: [function (item){
					if (me.businessId || me.salesmanName) {
						return item.get('salesmanName') == me.salesmanName;
					}
					else {
						return true;
					}
				}],
				proxy: {
					type: 'rest',
					url: './libs/business.php',
					reader: {
						type: 'json'
					},
					extraParams: {
						action: 'getSalesmanlist'
					}
				},
				listeners: {
					load: function (){
						var grid = Ext.getCmp('gridpanel-businessStaff');
						if (me.salesmanName) {
							var st = grid.getStore(),
								rec = st.findRecord('salesmanName', me.salesmanName);
							rec && grid.getSelectionModel().select(rec);
						}
					}
				}
			}),
			tools: [{
				hidden: me.businessId || me.salesmanName ? true : false,
				type:'refresh',
			    tooltip: '刷新人员列表',
			    handler: function(event, toolEl, panelHeader) {
			        var staffList = Ext.getCmp('gridpanel-businessStaff'),
						st = staffList.getStore();
					st.reload();
			    }
			}],
			listeners: {
				selectionchange: function (selModel, sels, opts){
					var rec = sels[0],
						mybusinessCt = Ext.getCmp('gridpanel-mybusinessModule');
					if (rec) {
						mybusinessCt.businessStaff = rec;
					}
					else {
						mybusinessCt.businessStaff = null;
					}
					mybusinessCt.refresh();
				}
			}
		}, {
			xtype: 'mybusiness-index',
			flex: 9,
			height: '100%',
			checkBusiness: true,
			businessStaff: null,
			id: 'gridpanel-mybusinessModule',
			name: 'gridpanel-mybusinessModule',
			salesmanName: me.salesmaneName,
			businessId: me.businessId
		}];

		this.callParent();
	}
});