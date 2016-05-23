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
			itemsPerPage = 10,
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
		st.load({
			params: {
				start: 0,
				limit: itemsPerPage
			}
		});
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
						flex: 0.5
					},
					{
						text: '项目经理',
						dataIndex: 'captain'
					},
					{
						text: '工程地址',
						dataIndex: 'projectName'
					},
					{
						text: '开工时间',
						dataIndex: 'period',
						renderer: function (val, meta, rec){
							return val.split(':')[0];
						}
					},
					{
						text: '竣工时间',
						dataIndex: 'period',
						renderer: function (val, meta, rec){
							return val.split(':')[1];
						}
					},
					{
						text: '设计师',
						dataIndex: 'designer'
					},
					{
						text: '业务员',
						dataIndex: 'salesman'
					},
					{
						text: '客户姓名',
						dataIndex: 'customer'
					},
					{
						text: '二期工程款',
						dataIndex: 'tilerProCheck'
					},
					{
						text: '三期工程款',
						dataIndex: 'woodProCheck'
					},
					{
						text: '目前状态',
						dataIndex: 'projectProgress'
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