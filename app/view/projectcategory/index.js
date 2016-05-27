Ext.define('FamilyDecoration.view.projectcategory.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.projectcategory-index',
	requires: [
		'FamilyDecoration.store.ProjectCategory'
	],
	// autoScroll: true,
	layout: 'fit',

	initComponent: function (){
		var me = this,
			itemsPerPage = 30,
			st = Ext.create('FamilyDecoration.store.ProjectCategory', {
				autoLoad: false,
				pageSize: itemsPerPage,
				proxy: {
			        type: 'rest',
			        url: './libs/projectcategory.php?action=get',
			        reader: {
			            type: 'json',
			            root: 'items',
			            totalProperty: 'total'
			        }
			    }
			});
		if (User.isAdmin() || User.isProjectManager() || User.isFinanceManager()) {
			st.load({
				params: {
					start: 0,
					limit: itemsPerPage
				}
			});
		}
		else {
			st.load({
				params: {
					start: 0,
					limit: itemsPerPage,
					userName: User.getName()
				}
			});
		}
		me.items = [{
			id: 'gridpanel-projectcategory',
			name: 'gridpanel-projectcategory',
			title: '工程目录',
			xtype: 'gridpanel',
			autoScroll: true,
			columns: {
				items: [
					{
						text: '序号',
						dataIndex: 'serialNumber',
						flex: 0.7
					},
					{
						text: '项目经理',
						dataIndex: 'captain'
					},
					{
						text: '工程地址',
						dataIndex: 'projectName',
						flex: 1.5
					},
					{
						text: '开工时间',
						dataIndex: 'period',
						renderer: function (val, meta, rec){
							return val.split(':')[0];
						},
						flex: 1.2
					},
					{
						text: '竣工时间',
						dataIndex: 'period',
						renderer: function (val, meta, rec){
							return val.split(':')[1];
						},
						flex: 1.2
					},
					{
						text: '所剩工时',
						dataIndex: 'period',
						renderer: function (val, meta, rec){
							var finishTime = val.split(':')[1],
								timeLeft = '';
							if (finishTime) {
								finishTime = new Date(finishTime.replace(/-/ig, '/'));
								if (!isNaN(finishTime.getTime())) {
									timeLeft = Math.round((finishTime.getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24);
									if (timeLeft == 0) {
										timeLeft = Math.abs(timeLeft);
									}
									timeLeft += '天';
								}
							}
							return timeLeft;
						},
						flex: 1.2
					},
					{
						text: '设计师',
						dataIndex: 'designer',
						flex: 0.9
					},
					{
						text: '业务员',
						dataIndex: 'salesman',
						flex: 0.9
					},
					{
						text: '客户',
						dataIndex: 'customer',
						flex: 0.9
					},
					{
						text: '目前状态',
						dataIndex: 'projectProgress',
						flex: 2.4
					},
					{
						text: '二期工程款',
						dataIndex: 'tilerProCheck',
						flex: 1.2
					},
					{
						text: '三期工程款',
						dataIndex: 'woodProCheck',
						flex: 1.2
					}
				],
				defaults: {
					flex: 1,
					align: 'center'
				}
			},
			store: st,
			dockedItems: [
				{
					xtype: 'pagingtoolbar',
					store: st,
					dock: 'bottom',
					displayInfo: true
				}
			]
		}];

		this.callParent();
	}
});