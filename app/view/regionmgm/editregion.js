Ext.define('FamilyDecoration.view.regionmgm.EditRegion', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-editregion',

	requires: [
		'FamilyDecoration.view.mybusiness.RegionList'
	],

	resizable: false,
	modal: true,
	width: 400,
	height: 240,
	autoScroll: true,
	community: null,
	area: null,
	bodyPadding: 10,
	defaults: {
		width: 340
	},
	grid: null,

	initComponent: function (){
		var me = this;
		
		me.title = me.community ? '修改小区' : '新建小区';

		me.items = [{
			id: 'textfield-communityName',
			name: 'textfield-communityName',
			allowBlank: false,
			xtype: 'textfield',
			fieldLabel: '小区名称',
			value: me.community ? me.community.get('name') : ''
		}, {
			id: 'textarea-communityNameRemark',
			name: 'textarea-communityNameRemark',
			allowBlank: true,
			xtype: 'textarea',
			fieldLabel: '小区简介',
			value: me.community ? me.community.get('nameRemark') : ''
		}, {
			xtype: 'fieldcontainer',
			hidden: me.community ? false : true,
			layout: 'hbox',
			hideLabel: true,
			width: '100%',
			items: [{
				xtype: 'textfield',
				fieldLabel: '所在区域',
				allowBlank: false,
				id: 'textfield-areaBelongto',
				readOnly: true,
				name: 'textfield-areaBelongto',
				value: me.community ? me.area.get('name') : ''
			}, {
				xtype: 'button',
				text: '选择',
				handler: function (){
					var win = Ext.create('Ext.window.Window', {
						width: 500,
						height: 300,
						layout: 'fit',
						modal: true,
						title: '选择区域',
						items: [{
							xtype: 'mybusiness-regionlist',
							onlyArea: true,
							listeners: {
								selectionchange: function (selModel, sels, opts){

								}
							}
						}],
						buttons: [{
							text: '确定',
							handler: function (){
								var tree = win.down('treepanel'),
									rec = tree.getSelectionModel().getSelection()[0],
									areaTxt = Ext.getCmp('textfield-areaBelongto'),
									areaHidden = Ext.getCmp('hidden-selectArea');
								if (rec) {
									areaTxt.setValue(rec.get('name'));
									areaHidden.setValue(rec.getId());
									win.close();
								}
								else {
									showMsg('请选择区域！');
								}
							}
						}, {
							text: '取消',
							handler: function (){

							}
						}]
					});
					win.show();
				}
			}, {
				xtype: 'hidden',
				id: 'hidden-selectArea',
				name: 'hidden-selectArea',
				value: me.community ? me.area.getId() : ''
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var txt = Ext.getCmp('textfield-communityName'),
					remark = Ext.getCmp('textarea-communityNameRemark'),
					hiddenArea = Ext.getCmp('hidden-selectArea');
				if (txt.isValid()) {
					var p = {
						name: txt.getValue(),
						nameRemark: remark.getValue(),
						parentID: me.community ? hiddenArea.getValue() : me.area.getId()
					};
					me.community && Ext.apply(p, {
						id: me.community.getId()
					})
					Ext.Ajax.request({
						method: 'POST',
						url: me.community ? 'libs/business.php?action=editRegion' : 'libs/business.php?action=addRegion',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									me.community ? showMsg('修改成功！') : showMsg('增加成功！');
									me.grid.refresh();
									me.close();
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