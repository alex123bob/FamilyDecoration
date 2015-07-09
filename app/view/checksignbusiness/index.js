Ext.define('FamilyDecoration.view.checksignbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checksignbusiness-index',
	requires: ['FamilyDecoration.view.signbusiness.Index', 'FamilyDecoration.view.checksignbusiness.TransferToProject'],

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			title: '设计师',
			height: '100%',
			id: 'gridpanel-designStaff',
			name: 'gridpanel-designStaff',
			flex: 2,
			columns: [{
				text: '姓名',
				dataIndex: 'designer',
				flex: 1,
				renderer: function (val, meta, rec){
					var num = rec.get('signedBusinesCount'),
						numStr = '';

						numStr = '<font style="color: ' + (num > 0 ? 'blue; text-shadow: #8F7 ' : 'white; text-shadow: black ') 
								+ '0.1em 0.1em 0.2em;"><strong>[' + num + ']</strong></font>',

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
				fields: ['designer', 'designerName', 'signedBusinesCount', 'applyBudgetCount', 'applyTransferCount'],
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
				}
			}
		}, {
			xtype: 'signbusiness-index',
			flex: 9,
			height: '100%',
			checkSignBusiness: true,
			designStaff: null,
			id: 'gridpanel-signbusinessCt',
			name: 'gridpanel-signbusinessCt'
		}];

		this.callParent();
	}
});