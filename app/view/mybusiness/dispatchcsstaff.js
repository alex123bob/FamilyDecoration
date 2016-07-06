Ext.define('FamilyDecoration.view.mybusiness.DispatchCsStaff', {
	extend: 'Ext.window.Window',
	alias: 'widget.mybusiness-dispatchcsstaff',
    requires: ['FamilyDecoration.view.checklog.MemberList'],
	modal: true,
	width: 500,
	height: 300,
	layout: 'fit',
    title: '分配客服',

	client: undefined,

	initComponent: function (){
		var me = this;

		me.items = [
            {
                xtype: 'checklog-memberlist',
                fullList: true
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){

                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ];

		this.callParent();
	}
});