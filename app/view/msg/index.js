Ext.define('FamilyDecoration.view.msg.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.msg-index',
	requires: [
		'FamilyDecoration.store.Msg'
	],
	layout: 'vbox',

	initComponent: function (){
		var me = this;

		me.items = [{
			autoScroll: true,
			flex: 20,
			width: '100%',
			xtype: 'gridpanel',
			id: 'gridpanel-msgreport',
			name: 'gridpanel-msgreport',
			columns: [{
				text: '发送人',
				flex: 0.5,
				dataIndex: 'sender'
			}, {
				text: '接受人',
				flex: 0.5,
				dataIndex: 'reciever'
			}, {
				text: '手机',
				flex: 1,
				dataIndex: 'recieverPhone'
			}, {
				text: '状态',
				flex: 0.5,
				dataIndex: 'status',
				renderer: function (val, meta, rec){
					if (val == 100)
						return '<font color="green">成功</font>';
					if (val == 0)
						return '<font color="blue">未发送</font>';
					return '<font color="red">失败' + val + '次</font>';
				}
			},{
				text: '发送结果',
				flex: 1.5,
				dataIndex: 'result'
			}, {
				text: '发送内容',
				flex: 3,
				dataIndex: 'content',
				renderer: function (val){
					return val.replace(/\n/ig, '<br />');
				}
			}, {
				text: '发送时间',
				flex: 1,
				dataIndex: 'createTime'
			}],
			store: Ext.create('FamilyDecoration.store.Msg', {
				autoLoad: true
			}),
			listeners: {
				selectionchange: function (selModel, sels, opts){

				}
			}
		}, {
			xtype: 'fieldcontainer',
			flex: 1,
			width: '100%',
			layout: 'hbox',
			items: [{
				flex: 1,
				xtype: 'displayfield',
				id: 'displayfield-msgbalance',
				name: 'displayfield-msgbalance',
				fieldLabel: '短信余额'
			}]
		}];

		this.on('afterrender', function (){
			var balance = Ext.getCmp('displayfield-msgbalance');
			Ext.Ajax.request({
				url: 'libs/msg.php?action=getbalance',
				method: 'GET',
				callback: function (opts, success, res){
					if (success) {
						var obj = Ext.decode(res.responseText);
						if (obj.status == 'successful') {
							balance.setValue(obj['balance']*10);
						}
					}
				}
			})
		});

		this.callParent();
	}
});