Ext.define('FamilyDecoration.view.checksignbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checksignbusiness-index',
	requires: ['FamilyDecoration.view.signbusiness.Index', 'FamilyDecoration.view.checksignbusiness.TransferToProject'],

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	designer: undefined,
	businessId: undefined,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			title: '设计师',
			height: '100%',
			id: 'gridpanel-designStaff',
			name: 'gridpanel-designStaff',
			flex: 1,
			hidden: me.designer ? true : false,
			columns: [{
				text: '姓名',
				dataIndex: 'designer',
				flex: 1,
				renderer: function (val, meta, rec){
					var numALevel = rec.get('signedBusinesALevelCount'),
						num = rec.get('signedBusinesAllCount'),
						numStr = '';

						numStr = '<font style="color: ' + (numALevel > 0 ? 'blue; text-shadow: #8F7 ' : 'white; text-shadow: black ') 
								+ '0.1em 0.1em 0.2em;"><strong>[' + numALevel +'/'+num + ']</strong></font>',

						resultStr = '';

					if (parseInt(rec.get('applyBudgetCount'), 10) > 0) {
						resultStr += '<img src="./resources/img/scroll1.png" data-qtip="申请预算" />'
					}

					if (parseInt(rec.get('applyTransferCount'), 10) > 0) {
						resultStr += '<img src="./resources/img/switch.png" data-qtip="申请转为工程" />';
					}

					resultStr += val + numStr;

					return resultStr;
				}
			}],
			hideHeaders: true,
			style: {
				borderRightStyle: 'solid',
				borderRightWidth: '1px'
			},
			store: Ext.create('Ext.data.Store', {
				fields: ['designer', 'designerName', 'signedBusinesALevelCount', 'signedBusinesAllCount','applyBudgetCount', 'applyTransferCount'],
				autoLoad: true,
				proxy: {
					type: 'rest',
					url: './libs/business.php',
					reader: {
						type: 'json'
					},
					extraParams: {
						action: 'getDesignerlist'
					}
				},
				filters: [
					function (item){
						if (me.businessId || me.designer) {
							return me.designer == item.get('designerName');
						}
						else {
							return true;
						}
					}
				],
				listeners: {
					load: function (){
						var grid = Ext.getCmp('gridpanel-designStaff');
						if (me.designer) {
							var st = grid.getStore(),
								rec = st.findRecord('designerName', me.designer);
							rec && grid.getSelectionModel().select(rec);
						}
					}
				}
			}),
			tools: [{
				type:'refresh',
			    tooltip: '刷新人员列表',
			    handler: function(event, toolEl, panelHeader) {
			        var staffList = Ext.getCmp('gridpanel-designStaff'),
						st = staffList.getStore();
					st.reload();
			    }
			}],
			listeners: {
				selectionchange: function (selModel, sels, opts){
					var rec = sels[0],
						signbusinessCt = Ext.getCmp('gridpanel-signbusinessCt');
					if (rec) {
						signbusinessCt.designStaff = rec;
					}
					else {
						signbusinessCt.designStaff = null;
					}
					signbusinessCt.refreshDetailedAddress();
					signbusinessCt.refreshWaitingList();
				}
			}
		}, {
			xtype: 'signbusiness-index',
			flex: 9,
			height: '100%',
			checkSignBusiness: true,
			designStaff: null,
			id: 'gridpanel-signbusinessCt',
			name: 'gridpanel-signbusinessCt',
			designer: me.designer,
			businessId: me.businessId
		}];

		this.callParent();
	}
});