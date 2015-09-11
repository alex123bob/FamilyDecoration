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
			flex: 1
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

						var img = document.createElement("img");
						var reader = new FileReader();  
						reader.onload = function(e) {img.src = e.target.result}
						reader.readAsDataURL(file);

						var ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0);

						var MAX_WIDTH = 800;
						var MAX_HEIGHT = 600;
						var width = img.width;
						var height = img.height;

						if (width > height) {
						  if (width > MAX_WIDTH) {
						    height *= MAX_WIDTH / width;
						    width = MAX_WIDTH;
						  }
						} else {
						  if (height > MAX_HEIGHT) {
						    width *= MAX_HEIGHT / height;
						    height = MAX_HEIGHT;
						  }
						}
						canvas.width = width;
						canvas.height = height;
						var ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0, width, height);

						var dataurl = canvas.toDataURL("image/png");

						//Post dataurl to the server with AJAX
					}
				});

				win.show();
			}
		}]

		this.callParent();
	}
});