Ext.define('FamilyDecoration.view.checkbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.checkbusiness-index',
	requires: ['FamilyDecoration.view.mybusiness.Index'],

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			title: '业务员',
			height: '100%',
			id: 'gridpanel-businessStaff',
			name: 'gridpanel-businessStaff',
			flex: 1,
			columns: [{
				text: '姓名',
				dataIndex: 'realname',
				flex: 1
			}],
			hideHeaders: true,
			style: {
				borderRightStyle: 'solid',
				borderRightWidth: '1px'
			}
		}, {
			xtype: 'mybusiness-index',
			flex: 9,
			height: '100%',
			checkBusiness: true,
			renderCommunity: function (val, meta, rec){
				var arr = rec.get('business'),
					num = 0,
					numStr = '',
					applyChk = [],
					businessStaffGrid = Ext.getCmp('gridpanel-businessStaff'),
					businessStaff = businessStaffGrid.getSelectionModel().getSelection()[0];
				if (businessStaff) {
					for (var i = 0; i < arr.length; i++) {
						if (arr[i]['salesmanName'] == businessStaff.getName()) {
							num++;
						}
						if (arr[i]['applyDesigner'] == 1) {
							applyChk.push(arr[i]);
						}
					}
					numStr = '<font style="color: ' + (num > 0 ? 'blue; text-shadow: #8F7 ' : 'white; text-shadow: black ') 
							+ '0.1em 0.1em 0.2em;"><strong>[' + num + ']</strong></font>';
					if (applyChk.length > 0) {
						meta.style = 'background: #ffff00;';
					}
				}
				else {

				}
				return val + numStr;
			}
		}];

		this.callParent();
	}
});