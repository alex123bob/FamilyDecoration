Ext.define('FamilyDecoration.view.mybusiness.RegionList', {
	extend: 'Ext.tree.Panel',
	requires: [
		'FamilyDecoration.store.RegionList'
	],
	alias: 'widget.mybusiness-regionlist',
	modal: true,
	loadAll: true,
	onlyArea: false,

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: true
			},
			store: Ext.create('FamilyDecoration.store.RegionList', {
				autoLoad: false,
	            proxy: {
	                type: 'rest',
	                appendId: false,
	                url: './libs/business.php',
	                extraParams: {
	                	action: 'getRegionList',
	                	parentID: -1
	                },
	                reader: {
	                    type: 'json'
	                }
	            },
	            listeners: {
	            	beforeload: function (st, ope){
	            		var node = ope.node;
	            		if (node.get('parentID') == -1) {
	            			st.proxy.extraParams = {
	            				parentID: node.getId(),
	            				action: 'getRegionList'
	            			};
	            		}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (!pNode) {
	            		}
	            		else {
	            			node.set({
	            				text: node.get('name'),
	            				leaf: me.onlyArea ? true : node.get('parentID') != -1,
	            				icon: node.get('parentID') == -1 ? './resources/img/map.png' : './resources/img/region.png'
	            			});
	            		}
	            	},
	            	load: function (st, node, recs){
	            		if (me.loadAll) {
	            			me.expandAll();
	            		}
	            	}
	            }
			})
		});

		me.on({
        	selectionchange: function (selModel, sels, opts){
        	}
		})

		this.callParent();
	}
})