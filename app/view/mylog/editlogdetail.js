Ext.define('FamilyDecoration.view.mylog.EditLogDetail', {
	extend: 'Ext.window.Window',
	alias: 'widget.mylog-editlogdetail',
	requires: ['Ext.grid.plugin.CellEditing'],

	// resizable: false,
	modal: true,
	layout: 'fit',
	maximizable: true,
	width: 550,
	height: 240,
	autoScroll: true,
	logObj: null,
	logListId: undefined,

	initComponent: function (){
		var me = this;
		
		me.title = me.logObj ? '编辑日志' : '新建日志';

		me.items = [{
			id: 'textarea-logContent',
			name: 'textarea-logContent',
			xtype: 'textarea',
			value: me.logObj ? me.logObj.get('content') : ''
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var p = {
					content: Ext.getCmp('textarea-logContent').getValue(),
					logListId: me.logListId
				};
				me.logObj && Ext.apply(p, {
					id: me.logObj.getId()
				});
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
								me.logObj ? showMsg('修改成功！') : showMsg('增加成功！');
								me.close();
								grid.refresh(rec);
							}
						}
					}
				})
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