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
    afterCloseFn: Ext.emptyFn,

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
                    var tree = me.down('treepanel'),
                        node = tree.getSelectionModel().getSelection()[0];
                    if (node.get('name')) {
                        Ext.Ajax.request({
                            url: './libs/business.php?action=editBusiness',
                            method: 'POST',
                            params: {
                                id: me.client.getId(),
                                csStaffName: node.get('name'),
                                csStaff: node.get('realname')
                            },
                            callback: function (opts, success, res){
                                if (success) {
                                    var obj = Ext.decode(res.responseText);
                                    if ('successful' == obj.status) {
                                        showMsg('分配成功！');
                                        me.close();
                                        me.afterCloseFn();
                                    }
                                    else {
                                        showMsg(obj.errMsg);
                                    }
                                }
                            }
                        })
                    }
                    else {
                        showMsg('请选择要分配的客服人员！');
                    }
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