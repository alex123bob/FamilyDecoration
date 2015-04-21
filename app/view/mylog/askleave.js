Ext.define('FamilyDecoration.view.mylog.AskLeave', {
	extend: 'Ext.window.Window',
	alias: 'widget.mylog-askleave',
	requires: ['Ext.grid.plugin.CellEditing'],

	resizable: false,
	modal: true,
	width: 550,
	height: 240,
	autoScroll: true,
	logListId: undefined,
	bodyPadding: 4,
	defaults: {
		width: 400
	},

	initComponent: function (){
		var me = this;

		me.title = '请假申请';

		me.items = [{
			allowBlank: false,
			editable: false,
			xtype: 'datefield',
			id: 'datefield-leaveDate',
			name: 'datefield-leaveDate',
			fieldLabel: '离开日期'
		}, {
			allowBlank: false,
			editable: false,
			xtype: 'datefield',
			id: 'datefield-backDate',
			name: 'datefield-backDate',
			fieldLabel: '返回日期'
		}, {
			allowBlank: false,
			id: 'textarea-leaveContent',
			name: 'textarea-leaveContent',
			xtype: 'textarea',
			fieldLabel: '请假原因',
			value: ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var area = Ext.getCmp('textarea-leaveContent'),
					fC = Ext.getCmp('datefield-leaveDate'),
					tC = Ext.getCmp('datefield-backDate'),
					from = Ext.Date.format(fC.getValue(), 'Y-m-d'),
					to = Ext.Date.format(tC.getValue(), 'Y-m-d');
				if (fC.getValue() - tC.getValue() > 0) {
					showMsg('开始日期必须小于等于结束日期！');
					return false;
				}
				else if (fC.isValid() && tC.isValid() && area.isValid()) {
					var context = User.getRealName() + '请假。 请假原因： ' + area.getValue() + ' 请假时间： 从' + from + ' 到 ' + to + '。';
					var p = {
						content: context,
						logListId: me.logListId
					};
					Ext.Ajax.request({
						method: 'POST',
						url: 'libs/loglist.php?action=addOrEditLogDetail',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									grid = Ext.getCmp('gridpanel-logDetail'),
									tree = Ext.getCmp('treepanel-logName'),
									rec = tree.getSelectionModel().getSelection()[0];
								if (obj.status == 'successful') {
									Ext.Ajax.request({
										method: 'POST',
										url: 'libs/message.php?action=askLeave',
										params: {
											
										}
									});
									showMsg('请假成功！');
									me.close();
									grid.refresh(rec);
								}
							}
						}
					});
				}
			}
		}, {
			text: '取消',
			handler: function () {
				me.close();
			}
		}]

		this.callParent();
	}
});