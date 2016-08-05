Ext.define('FamilyDecoration.view.chart.UploadForm', {
	alias: 'widget.chart-uploadform',
	extend: 'Ext.window.Window',
	title: '添加图片',
	width: 400,
	bodyPadding: 10,
	resizable: false,
	frame: true,
	modal: true,

	url: undefined,
	typeId: undefined,
	typeArray: undefined, 
	beforeUpload: Ext.emptyFn,
	afterUpload: Ext.emptyFn,
	supportMult: true, // whether this component supports multiple picture upload or not.

	initComponent: function (){
		var me = this;

		var uploadSt = Ext.create('Ext.data.Store', {
			fields: ['fileId', 'fileName', 'uploadStatus'],
			proxy: {
				type: 'memory',
				reader: 'json'
			}
		});

		Ext.apply(me, {
			items: [{
				xtype: 'form',
				header: false,
				border: false,
				items: [{
					xtype: 'filefield',
					name: 'photo[]',
					fieldLabel: '选择图片',
					labelWidth: 100,
					msgTarget: 'side',
					allowBlank: false,
					buttonText: '选择',
					anchor: '100%',
					onFileChange: function (button, e, value) {
				        this.duringFileSelect = true;

				        var me = this,
				            upload = me.fileInputEl.dom,
				            files = upload.files,
				            names = [];

				        if (files) {
				            for (var i = 0; i < files.length; i++)
				                names.push(files[i].name);
				            value = names.join(', ');
				        }

				        Ext.form.field.File.superclass.setValue.call(this, value);

				        delete this.duringFileSelect;
				    },
				    supportMultFn: function (){
				    	var typeArray = me.typeArray ? me.typeArray : ['image/*'];
						var fileDom = this.fileInputEl;
						if (fileDom) {
							fileDom.dom.setAttribute("multiple","multiple");
							fileDom.dom.setAttribute("accept",typeArray.join(","));
						}
				    },
				    _setValue: function (val) {
				    	Ext.form.field.File.superclass.setValue.call(this, val);
				    },
					listeners: {
						afterrender: function(cmp) {
							me.supportMult && cmp.supportMultFn();
						},
						change: function (field, val, opts){
							var files = val.split(', '),
								frm = Ext.getCmp('gridpanel-uploadForm'),
								st = frm.getStore(),
								id = st.getCount(),
								data = [];
							for (var i = 0; i < files.length; i++) {
								data.push({
									fileId: id++,
									fileName: files[i],
									uploadStatus: '<font color="gray">准备上传</font>'
								});
							}
							st.loadData(data);
							me.supportMult && field.supportMultFn();
						}
					}
				}, {
					xtype: 'grid',
					header: false,
					store: uploadSt,
					maxHeight: 250,
					autoScroll: true,
					id: 'gridpanel-uploadForm',
					name: 'gridpanel-uploadForm',
					columns: [{
						text: '名称',
						dataIndex: 'fileName',
						flex: 1,
						draggable: false,
						sortable: false,
						menuDisabled: true
					}, {
						text: '状态',
						dataIndex: 'uploadStatus',
						flex: 1,
						draggable: false,
						sortable: false,
						menuDisabled: true
					}]
				}],

				buttons: [{
					text: '上传',
					handler: function (){
						var frm = this.up('form'),
							files = frm.down('filefield'),
							grid = Ext.getCmp('gridpanel-uploadForm'),
							st = grid.getStore(),
							arr = st.data.items,
							p = {};

						me.typeId && Ext.apply(p, {
							typeId: me.typeId
						});

						if (frm.isValid()) {
							me.beforeUpload();
							frm.submit({
								clientValidation: true,
								url: me.url,
								params: p,
								waitMsg: '正在上传图片...',
								success: function (fp, o){
									var data = o.result.details,
										frm = Ext.getCmp('gridpanel-uploadForm'),
										st = frm.getStore(),
										res = [];
									for (var i = 0; i < data.length; i++) {
										res.push({
											fileId: i,
											fileName: data[i]['original_file_name'],
											uploadStatus: data[i]['success'] ? '<font color="green">上传成功！</font>' : '<font color="red">上传失败！</font>'
										})
									}
									st.loadData(res);
									me.afterUpload(fp, o);
									me.supportMult && files.supportMultFn();
								},
								failure: function(form, action) {
									switch (action.failureType) {
										case Ext.form.action.Action.CLIENT_INVALID:
											Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
											break;
										case Ext.form.action.Action.CONNECT_FAILURE:
											Ext.Msg.alert('Failure', 'Ajax communication failed');
											break;
										case Ext.form.action.Action.SERVER_INVALID:
											Ext.Msg.alert('Failure', action.result.msg);
											break;
									}
								}
							});
						}
					}
				}]
			}]
		});

		me.callParent();
	}
});