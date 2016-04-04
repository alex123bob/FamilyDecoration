Ext.define('FamilyDecoration.view.bulletin.BulletinInspection', {
	extend: 'Ext.window.Window',
    width: 600,
    height: 500,
    modal: true,
    title: '查看公告',
    layout: 'vbox',

    requires: [
    	'FamilyDecoration.store.AnnouncementComment'
    ],

    bulletin: null,

    refresh: function (id){
    	var grid = this.down('gridpanel'),
    		st = grid.getStore();
    	st.reload({
    		callback: function(recs, ope, success){
    			if (success && id) {
    				var rec;
    				for (var i = recs.length - 1; i >= 0; i--) {
    					if (recs[i].getId() == id) {
    						rec = recs[i];
    						break;
    					}
    				}
    				if (rec) {
    					grid.getSelectionModel().select(rec);
    					grid.getView().focusRow(rec, 500);
    				}
    			}
    		}
    	});
    },
    
    initComponent: function (){
    	var me = this;

    	me.items = [{
    		xtype: 'textfield',
    		readOnly: true,
    		hideLabel: true,
    		width: '100%',
    		flex: 0.5,
    		value: me.bulletin ? unescape(me.bulletin.get('title')) : ''
    	}, {
    		xtype: 'textareafield',
            readOnly: true,
            hideLabel: true,
            width: '100%',
            flex: 2,
            autoScroll: true,
            value: me.bulletin ? unescape(me.bulletin.get('content')) : ''
    	}, {
    		xtype: 'gridpanel',
    		cls: 'gridpanel-announcementComment',
    		columns: [
	    		{
	    			text: '评论内容',
	    			dataIndex: 'content',
	    			renderer: function (val, meta, rec){
	    				var str = '';
	    				if (!rec.get('parentId')) {
	    					str = '<strong>' + rec.get('commenter') + ':</strong> ' + val.replace(/\n/ig, '<br />');
	    				}
	    				else {
	    					str = '—— <strong>' + rec.get('commenter') + '</strong> '
	    						  +	'回复 <font color="grey">' + rec.get('previousCommenter') + '</font>: '
	    						  + val.replace(/\n/ig, '<br />');
	    				}
	    				return str;
	    			},
	    			flex: 4
	    		},
	    		{
	    			text: '评论时间',
	    			dataIndex: 'createTime',
	    			flex: 2
	    		},
	    		{
	    			xtype:'actioncolumn',
		            width:50,
		            items: [{
		                icon: 'resources/img/response.png',  // Use a URL in the icon config
		                tooltip: '回复',
		                handler: function(grid, rowIndex, colIndex) {
		                    var rec = grid.getStore().getAt(rowIndex),
		                    	parentId = rec.get('parentId') ? rec.get('parentId') : rec.getId(), // which comment the coming comment belongs to
		                    	previousCommenterName = rec.get('commenterName'),
		                    	previousCommenter = rec.get('commenter'),
		                    	win;
		                    win = Ext.create('Ext.window.Window', {
		                    	title: '回复 "' + previousCommenter + '" 的评论',
		                    	width: 300,
		                    	height: 200,
		                    	modal: true,
		                    	layout: 'fit',
		                    	items: [{
		                    		xtype: 'textarea',
		                    		emptyText: '回复 ' + previousCommenter + ' :',
		                    		allowBlank: false
		                    	}],
		                    	buttons: [{
		                    		text: '回复',
		                    		handler: function (){
		                    			var txtArea = win.down('textarea'),
		                    				content = txtArea.getValue();
		                    			if (txtArea.isValid()) {
		                    				Ext.Ajax.request({
		                    					url: './libs/announcementcomment.php?action=add',
		                    					method: 'POST',
		                    					params: {
		                    						bulletinId: me.bulletin.getId(),
		                    						bulletinId: me.bulletin.getId(),
				    								content: content,
				    								commenterName: User.getName(),
				    								parentId: parentId,
				    								previousCommenterName: previousCommenterName
		                    					},
		                    					callback: function (opts, success, res){
		                    						if (success) {
		                    							var obj = Ext.decode(res.responseText);
		                    							if ('successful' == obj.status) {
		                    								var commentId = obj['id'];
		                    								me.refresh(commentId);
		                    								showMsg('回复成功！');
		                    								// @todo if there is further message notification,
		                    								// @todo writes it down here
		                    								win.close();
		                    							}
		                    							else {
		                    								showMsg(obj.errMsg);
		                    							}
		                    						}
		                    					}
		                    				});
		                    			}
		                    		}
		                    	}, {
		                    		text: '取消',
		                    		handler: function (){
		                    			win.close();
		                    		}
		                    	}]
		                    });
							win.show();
		                }
		            }]
	    		}
    		],
    		hideHeaders: true,
    		store: Ext.create('FamilyDecoration.store.AnnouncementComment', {
    			autoLoad: true,
    			proxy: {
	                type: 'rest',
	                url: './libs/announcementcomment.php?action=view',
	                extraParams: {
	                    bulletinId: me.bulletin.getId()
	                },
	                reader: {
	                    type: 'json'
	                }
	            }
    		}),
    		width: '100%',
    		flex: 2,
    		autoScroll: true
    	}];

    	me.buttons = [{
    		text: '评论',
    		handler: function (){
    			var win = Ext.create('Ext.window.Window', {
    				width: 500,
    				height: 300,
    				title: '发表评论',
    				modal: true,
    				layout: 'fit',
    				items: [{
    					xtype: 'textarea',
    					emptyText: '评论内容',
    					allowBlank: false
    				}],
    				buttons: [{
    					text: '确定',
    					handler: function(){
    						var txtArea = win.down('textarea'),
    							content = txtArea.getValue();
    						if (txtArea.isValid()) {
    							Ext.Ajax.request({
	    							url: './libs/announcementcomment.php?action=add',
	    							params: {
	    								bulletinId: me.bulletin.getId(),
	    								content: content,
	    								commenterName: User.getName()
	    							},
	    							method: 'POST',
	    							callback: function (opts, success, res){
	    								if (success) {
	    									var obj = Ext.decode(res.responseText);
	    									if ('successful' == obj.status) {
	    										var commentId = obj['id'];
	    										me.refresh(commentId);
	    										showMsg('添加成功！');
	    										win.close();
	    									}
	    									else {
	    										showMsg(obj.errMsg);
	    									}
	    								}
	    							}
	    						});
    						}
    					}
    				}, {
    					text: '取消',
    					handler: function (){
    						win.close();
    					}
    				}]
    			});
    			win.show();
    		}
    	}, {
	        text: '关闭',
	        handler: function (){
	            me.close();
	        }
	    }];

    	me.callParent();
    }
});