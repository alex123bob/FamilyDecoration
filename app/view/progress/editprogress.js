Ext.define('FamilyDecoration.view.progress.EditProgress', {
	extend: 'Ext.window.Window',
	alias: 'widget.progress-editprogress',
	requires: ['Ext.grid.plugin.CellEditing', 'FamilyDecoration.model.Progress', 'FamilyDecoration.view.chart.UploadForm'],

	// resizable: false,
	modal: true,

	title: '添加工程进度',
	width: 400,
	height: 240,
	project: null,
	progress: null,
	layout: 'vbox',

	initComponent: function (){
		var me = this;

		me.title = me.progress ? '编辑工程进度' : '添加工程进度';

		me.items = [{
			name: 'textarea-progress',
			id: 'textarea-progress',
			xtype: 'textarea',
			width: '100%',
			flex: 4,
			autoScroll: true,
			allowBlank: false,
			fieldLabel: '工程进度',
			value: me.progress ? me.progress.get('progress') : ''
		}, {
			xtype: 'panel',
			width: '100%',
			flex: 1,
			hidden: true
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var progress = Ext.getCmp('textarea-progress').getValue(),
					p = {};
				if (me.progress) {
					Ext.apply(p, {
						progress: progress,
						id: me.progress.getId()
					});
				}
				else {
					Ext.apply(p, {
						progress: progress,
						projectId: me.project.getId()
					})
				}
				Ext.Ajax.request({
					url: me.progress ? './libs/progress.php?action=editProgress' : './libs/progress.php?action=addProgress',
					method: 'POST',
					params: p,
					callback: function (opts, success, res){
						if (success) {
							var obj = Ext.decode(res.responseText),
								str = '进度成功！';
							if (obj.status == 'successful') {
								str = (me.progress ? '编辑' : '添加') + str;
								showMsg(str);
								me.close();
								Ext.getCmp('gridpanel-projectProgress').getStore().reload();
							}
							else {
								Ext.Msg.error(obj.errMsg);
							}
						}
					}
				})
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}, {
			text: '添加图片',
			hidden: true,
			handler: function (){
				var win = Ext.create('FamilyDecoration.view.chart.UploadForm', {
					url: './libs/upload_progress_pic.php',
					afterUpload: function(fp, o) {

					},
					beforeUpload: function (){
						// from an input element
						var input = $(':file').get(0);
						var filesToUpload = input.files;
						var file = filesToUpload[0];
					}
				});

				win.show();
			}
		}]

		this.callParent();
	}
});