Ext.define('FamilyDecoration.view.deadbusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.deadbusiness-index',
	requires: ['FamilyDecoration.store.Business'],

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	// this two segments are used to filter in prompt operation mode.
	businessId: null,
	businessStaff: null,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			hidden: me.businessStaff ? true : false,
			title: '业务员&nbsp;&nbsp;<font color="red">*</font>:废单&nbsp;<font color="blue">*</font>:申请废单',
			height: '100%',
			id: 'gridpanel-businessStaffForDeadBusiness',
			name: 'gridpanel-businessStaffForDeadBusiness',
			flex: 2,
			columns: [{
				text: '姓名',
				dataIndex: 'salesman',
				flex: 1,
				renderer: function (val, meta, rec){
					var alreadyDeadNumber = parseInt(rec.get('alreadyDeadNumber'), 10),
						requestDeadNumber = parseInt(rec.get('requestDeadNumber'), 10),
						numStr = '';

					if (isNaN(alreadyDeadNumber)) {
						alreadyDeadNumber = 0;
					}
					if (isNaN(requestDeadNumber)) {
						requestDeadNumber = 0;
					}

					numStr = '<font style="color: red;"><strong>['
							 + alreadyDeadNumber + ']</strong></font>'
							 + '<font style="color: blue;"><strong>['
							 + requestDeadNumber + ']</strong></font>';

					return val + numStr;
				}
			}],
			hideHeaders: true,
			style: {
				borderRightStyle: 'solid',
				borderRightWidth: '1px'
			},
			store: Ext.create('Ext.data.Store', {
				fields: [
					'alreadyDeadNumber', 'requestDeadNumber', 'salesman', 'salesmanName'
				],
				autoLoad: true,
				filters: [function (item){
					if (me.businessStaff) {
						return item.get('salesmanName') == me.businessStaff;
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
						action: 'getSalesmanlistWithDeadBusinessNumber'
					}
				},
				listeners: {
					load: function (st, recs, successful, opts){
						if (me.businessStaff) {
							for (var i = recs.length - 1; i >= 0; i--) {
								if (recs[i].get('salesmanName') == me.businessStaff) {
									var index = st.indexOf(recs[i]),
										grid = Ext.getCmp('gridpanel-businessStaffForDeadBusiness');
									grid.getSelectionModel().select(index);
									break;
								}
							};
						}
					}
				}
			}),
			tools: [{
				hidden: me.businessId || me.businessStaff ? true : false,
				type:'refresh',
			    tooltip: '刷新人员列表',
			    handler: function(event, toolEl, panelHeader) {
			        var staffList = Ext.getCmp('gridpanel-businessStaffForDeadBusiness'),
						st = staffList.getStore();
					st.reload();
			    }
			}],
			listeners: {
				selectionchange: function (selModel, sels, opts){
					var rec = sels[0],
						grid = Ext.getCmp('gridpanel-deadbusinessinfo');
					if (rec) {
						var businessStaffName = rec.get('salesmanName');
						grid.refresh(businessStaffName);
					}
					else {
						grid.refresh();
					}
				}
			}
		}, {
			xtype: 'gridpanel',
			flex: 5,
			height: '100%',
			id: 'gridpanel-deadbusinessinfo',
			name: 'gridpanel-deadbusinessinfo',
			title: '信息情况&nbsp;&nbsp;<font color="lightpink">*</font>:废单&nbsp;<font color="skyblue">*</font>:申请废单',
			businessStaff: null,
			columns: [
				{
					text: '工程地址',
					flex: 1,
					dataIndex: 'address',
					renderer: function (val, meta, rec){
						var color = '';
						if (rec.get('requestDead') == '1') {
							color = 'skyblue';
						}
						else if (rec.get('isDead') == 'true') {
							color = 'lightpink';
						}
						meta.style = 'background: ' + color + ';';
						return rec.get('regionName') + ' ' + val;
					}
				},
				{
					text: '客户姓名',
					flex: 1,
					dataIndex: 'customer'
				},
				{
					text: '设计师',
					flex: 1,
					dataIndex: 'designer'
				},
				{
					text: '废单原因',
					flex: 1,
					dataIndex: 'requestDeadBusinessReason'
				},
				{
					xtype:'actioncolumn',
					text: '跟踪日志',
					flex: 1,
					align: 'center',
					items: [{
						icon: './resources/img/pop.png',
						tooltip: '查看原业务纪录',
						handler: function (grid, rowIndex, colIndex){
							var rec = grid.getStore().getAt(rowIndex);
							var win = Ext.create('Ext.window.Window', {
			            		title: '原始业务数据',
			            		layout: 'fit',
			            		modal: true,
			            		width: 500,
			            		height: 400,
			            		items: [{
			            			xtype: 'gridpanel',
			            			id: 'gridpanel-historyBusinessDetail',
			            			name: 'gridpanel-historyBusinessDetail',
			            			autoScroll: true,
			            			columns: [{
			            				text: '信息情况',
			            				flex: 1,
			            				dataIndex: 'content',
			            				renderer: function (val, meta, rec){
											return val.replace(/\n/ig, '<br />');
										}
			            			}],
			            			store: Ext.create('FamilyDecoration.store.BusinessDetail', {
								    	autoLoad: true,
								    	proxy: {
											type: 'rest',
									    	url: './libs/business.php?action=getBusinessDetails',
									        reader: {
									            type: 'json'
									        },
									        extraParams: {
									        	businessId: rec.getId()
									        }
										}
								    })
			            		}]
			            	});

			            	win.show();
						}
					}]
				},
				{
					text: '业务来源',
					flex: 1,
					dataIndex: 'source'
				}
			],
			store: Ext.create('FamilyDecoration.store.Business', {
				autoLoad: false,
				filters: [
					function (item){
						if (me.businessId) {
							return me.businessId == item.getId();
						}
						else {
							return true;
						}
					}
				],
				proxy: {
					type: 'rest',
					url: './libs/business.php',
			        reader: {
			            type: 'json'
			        },
			        extraParams: {
			        	action: 'getDeadBusinessOrRequestDeadBusiness'
			        }
				}
			}),
			initBtn: function (){
				var grid = Ext.getCmp('gridpanel-deadbusinessinfo'),
					rec = grid.getSelectionModel().getSelection()[0],
					approveBtn = Ext.getCmp('button-approveDeadBusiness'),
					recoverBtn = Ext.getCmp('button-recoverDeadBusiness');
				if (rec) {
					if (rec.get('requestDead') == '1') {
						approveBtn.enable();
						recoverBtn.disable();
					}
					else if (rec.get('isDead') == 'true') {
						approveBtn.disable();
						recoverBtn.enable();
					}
				}
				else {
					approveBtn.disable();
					recoverBtn.disable();
				}
			},
			refresh: function (businessStaff){
				var grid = this,
					st = grid.getStore(),
					rec = grid.getSelectionModel().getSelection()[0];
				if (businessStaff) {
					st.reload({
						params: {
							action: 'getDeadBusinessOrRequestDeadBusiness',
				        	salesmanName: businessStaff
						},
						callback: function (recs, ope, success){
							if (success) {
								grid.getSelectionModel().deselectAll();
								if (rec) {
									var index = st.indexOf(rec);
									grid.getSelectionModel().select(index);
								}
							}
						}
					});
				}
				else {
					st.removeAll();
				}
			},
			bbar: [{
				text: '批准',
				name: 'button-approveDeadBusiness',
				id: 'button-approveDeadBusiness',
				icon: './resources/img/approve1.png',
				disabled: true,
				handler: function (){
					var grid = Ext.getCmp('gridpanel-deadbusinessinfo'),
						staffGrid = Ext.getCmp('gridpanel-businessStaffForDeadBusiness'),
						rec = grid.getSelectionModel().getSelection()[0],
						staff = staffGrid.getSelectionModel().getSelection()[0];
					Ext.Msg.warning('确定要批准当前废单申请吗？', function (btnId){
						if (btnId == 'yes') {
							if (rec && rec.get('requestDead') == '1') {
								Ext.Ajax.request({
									url: './libs/business.php?action=editBusiness',
									params: {
										id: rec.getId(),
										requestDead: 0,
										isDead: 'true'
									},
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('批准成功！');
												grid.refresh(staff.get('salesmanName'));
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						}
					});
				}
			}, {
				text: '恢复',
				name: 'button-recoverDeadBusiness',
				id: 'button-recoverDeadBusiness',
				icon: './resources/img/restore.png',
				disabled: true,
				handler: function (){
					var grid = Ext.getCmp('gridpanel-deadbusinessinfo'),
						staffGrid = Ext.getCmp('gridpanel-businessStaffForDeadBusiness'),
						rec = grid.getSelectionModel().getSelection()[0],
						staff = staffGrid.getSelectionModel().getSelection()[0];
					Ext.Msg.warning('确定要恢复废单吗？', function (btnId){
						if (btnId == 'yes') {
							if (rec && rec.get('isDead') == 'true') {
								Ext.Ajax.request({
									url: './libs/business.php?action=editBusiness',
									params: {
										id: rec.getId(),
										requestDead: 0,
										isDead: 'false',
										requestDeadBusinessReason: ''
									},
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('恢复成功！');
												grid.refresh(staff.get('salesmanName'));
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						}
					});
				}
			}],
			listeners: {
				selectionchange: function (selModel, sels, opts){
					var rec = sels[0],
						grid = Ext.getCmp('gridpanel-deadbusinessinfo');
					grid.initBtn();
				}
			}
		}];

		this.callParent();
	}
});