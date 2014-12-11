Ext.define('FamilyDecoration.view.budget.BudgetContent', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-budgetcontent',
	requires: ['Ext.form.FieldContainer', 'FamilyDecoration.model.BudgetItem', 'FamilyDecoration.store.BudgetItem'],

	title: '预算实体',
	header: false,
	autoScroll: true,
	isForPreview: false,

	initComponent: function (){
		var me = this;

		// clean all data in this budget table
		me.clean = function (){
			var panel = this,
				custName = panel.down('[name="displayfield-custName"]'),
				projectName = panel.down('[name="displayfield-projectName"]'),
				grid = panel.down('gridpanel'),
				st = grid.getStore();
			custName.setValue('');
			projectName.setValue('');
			st.removeAll();
		}

		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			items: [
				{
					width: 80,
					height: 60,
					xtype: 'image',
					src: './resources/img/logo.jpg'
				},
				{
					xtype: 'displayfield',
					margin: '0 0 0 20',
					value: '<center>佳诚装饰室内装修装饰工程&nbsp;预算单</center>',
					hideLabel: true,
					fieldStyle: {
						fontFamily: '黑体',
						fontSize: '24px',
						lineHeight: '60px'
					},
					width: '100%',
					height: '100%'
				}
			],
			width: '100%',
			height: 60
		}, {
			xtype: 'fieldcontainer',
			layout: {
				type: 'hbox',
				pack: 'end'
			},
			items: [{
				xtype: 'displayfield',
				fieldLabel: '客户名称',
				name: 'displayfield-custName',
				flex: 1
			}, {
				xtype: 'displayfield',
				fieldLabel: '工程地址',
				name: 'displayfield-projectName',
				flex: 1
			}],
			width: '100%'
		}, {
			autoScroll: true,
			header: false,
			xtype: 'gridpanel',
			width: '100%',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1,
		            listeners: {
		            	beforeedit: function (editor, e) {
		            		var rec = e.record;
		            		if (rec.get('parentId') && rec.get('itemUnit')) {
		            			return true;
		            		}
		            		// 效果图编辑数量
		            		else if (rec.get('itemCode') == 'P') {
		            			return true;
		            		}
		            		// 设计费百分比
		            		else if (rec.get('itemCode') == 'O') {
		            			return true;
		            		}
		            		// 税金百分比
		            		else if (rec.get('itemCode') == 'R') {
		            			return true;
		            		}
		            		else {
		            			return false;
		            		}
		            	},
		            	edit: function (editor, e){
		            		Ext.suspendLayouts();
		            		if (e.field != 'remark') {
		            			var mainT, auxiliaryT, manT, machineryT, costT,
			            			rec = e.record,
			            			grid = e.grid,
			            			st = grid.getStore(),
			            			number = parseFloat(e.value);
			            		if (!Ext.isNumber(number)) {
			            			number = 0;
			            		}
			            		mainT = rec.get('mainMaterialPrice').add(rec.get('lossPercent')).mul(number);
			            		auxiliaryT = rec.get('auxiliaryMaterialPrice').mul(number);
			            		manT = rec.get('manpowerPrice').mul(number);
			            		machineryT = rec.get('machineryPrice').mul(number);
			            		User.isAdmin() && rec.raw.originalCost && (costT = rec.raw.originalCost.mul(number)); // Should operates acting as the admin
			            		rec.set({
			            			mainMaterialTotalPrice: mainT,
			            			auxiliaryMaterialTotalPrice: auxiliaryT,
			            			manpowerTotalPrice: manT,
			            			machineryTotalPrice: machineryT
			            		});
			            		if (User.isAdmin()) {
			            			if (costT == 0) {
			            				rec.set('cost', rec.raw.originalCost);
			            			}
			            			else {
			            				rec.set('cost', costT);
			            			}
			            		}
			            		rec.commit();

			            		// work out the subtotal
			            		var arr = [], subtotal,
			            			subMain = 0, 
			            			subAuxiliary = 0,
			            			subMan = 0, 
			            			subMachinery = 0;
			            		arr = st.queryBy(function (r, id) {
			            			if (r.get('parentId') == rec.get('parentId')) {
			            				return true;
			            			}
			            			else {
			            				return false;
			            			}
			            		}, st);
			            		subtotal = arr.last();
			            		arr.remove(subtotal);

			            		Ext.each(arr.items, function (innerRec){
			            			subMain = subMain.add(innerRec.get('mainMaterialTotalPrice'));
			            			subAuxiliary = subAuxiliary.add(innerRec.get('auxiliaryMaterialTotalPrice'));
			            			subMan = subMan.add(innerRec.get('manpowerTotalPrice'));
			            			subMachinery = subMachinery.add(innerRec.get('machineryTotalPrice'));
			            		});

			            		subtotal.set({
			            			mainMaterialTotalPrice: subMain,
			            			auxiliaryMaterialTotalPrice: subAuxiliary,
			            			manpowerTotalPrice: subMan,
			            			machineryTotalPrice: subMachinery
			            		});
			            		subtotal.commit();


			            		// work out the total
			            		var total = 0,
			            			headerGrid = Ext.getCmp('gridpanel-budgetheader'),
			            			headerSt = headerGrid.getStore(),
			            			totalItem;
			            		arr = st.queryBy(function (r, id){
			            			// subtotal record containing parentId, without itemUnit
			            			if (r.get('parentId') && !r.get('itemUnit')) {
			            				total = total.add(r.get('mainMaterialTotalPrice')).add(r.get('auxiliaryMaterialTotalPrice')).add(r.get('manpowerTotalPrice')).add(r.get('machineryTotalPrice'));
			            				return true;
			            			}
			            			else {
			            				return false;
			            			}
			            		}, st);

			            		totalItem = headerSt.getAt(3);
			            		totalItem.set('content', total);
			            		totalItem.commit();

			            		// the last six items
			            		arr = st.queryBy(function (r, id) {
			            			if (r.get('itemCode') != '' && 'NOPQRS'.indexOf(r.get('itemCode')) != -1) {
			            				return true;
			            			}
			            			else {
			            				return false;
			            			}
			            		}, st);

			            		Ext.each(arr.items, function (rec, index){
			            			var price = 0;
			            			if (rec.get('itemCode') == 'N') {
			            				rec.set({
			            					itemAmount: 1,
			            					mainMaterialTotalPrice: total,
			            					mainMaterialPrice: total
			            				});
			            			}
			            			else if (rec.get('itemCode') == 'O') {
			            				price = total.mul(rec.get('itemAmount'));
			            				rec.set({
			            					mainMaterialPrice: total,
			            					mainMaterialTotalPrice: price
			            				});
			            			}
			            			else if (rec.get('itemCode') == 'P') {
			            				price = rec.get('itemAmount').mul(500);
			            				rec.set({
			            					mainMaterialPrice: 500,
			            					mainMaterialTotalPrice: price
			            				});
			            			}
			            			else if (rec.get('itemCode') == 'Q') {
			            				price = total.mul(0.05);
			            				rec.set({
			            					itemAmount: 0.05,
			            					mainMaterialPrice: total,
			            					mainMaterialTotalPrice: price
			            				});
			            			}
			            			else if (rec.get('itemCode') == 'R') {
			            				price = total.mul(rec.get('itemAmount'));
			            				rec.set({
			            					mainMaterialPrice: total,
			            					mainMaterialTotalPrice: price
			            				});
			            			}
			            			else if (rec.get('itemCode') == 'S') {
			            				var count = 0;
			            				for (var i = 0; i < arr.items.length; i++) {
			            					if (arr.items[i] != rec) {
			            						count = count.add(arr.items[i].get('mainMaterialTotalPrice'));
			            					}
			            				}
			            				rec.set({
			            					itemAmount: 1,
			            					mainMaterialPrice: count,
			            					mainMaterialTotalPrice: count
			            				});
			            			}

			            			rec.commit();
			            		});

			            		editor.completeEdit();
		            		}
		            		else {
		            			e.record.commit();
		            		}
		            		Ext.resumeLayouts();
		            	}
		            }
		        })
			],
			store: Ext.create('FamilyDecoration.store.BudgetItem', {

			}),
			columns: [
		        {
		        	text: '编号',
		        	dataIndex: 'itemCode',
		        	flex: 0.5,
                	draggable: false,
                	align: 'center',
                	sortable: false
		        },
		        {
		        	text: '项目名称',
		        	dataIndex: 'itemName',
		        	flex: 0.8,
                	draggable: false,
                	align: 'center',
                	sortable: false
		        },
		        {
		        	text: '单位', 
		        	dataIndex: 'itemUnit',
		        	flex: 0.5,
                	draggable: false,
                	align: 'center',
                	sortable: false
		        },
		        {
		        	text: '数量',
		        	flex: 0.5, 
		        	dataIndex: 'itemAmount',
                	draggable: false,
                	align: 'center',
                	editor: me.isForPreview ? null : {
                		xtype: 'textfield',
                		allowBlank: false
                	},
                	sortable: false,
                	renderer: function (val, meta, rec){
                		if (rec.get('itemCode') != '' && 'POR'.indexOf(rec.get('itemCode')) != -1) {
        					return val;
        				}
                		else if (!rec.get('parentId') || !rec.get('itemUnit')) {
        					return '';
        				}
        				else {
        					return val;
        				}
                	}
		        },
		        {
		        	text: '主材',
		        	columns: [
		        		{
		        			text: '单价',
		        			dataIndex: 'mainMaterialPrice',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			dataIndex: 'mainMaterialTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
                					return val;
                				}
                				else if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		}
		        	],
                	draggable: false,
                	align: 'center'
		        },
		        {
		        	text: '辅材',
		        	columns: [
		        		{
		        			text: '单价',
		        			dataIndex: 'auxiliaryMaterialPrice',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			dataIndex: 'auxiliaryMaterialTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		}
		        	],
                	draggable: false,
                	align: 'center'
		        },
		        {
		        	text: '人工',
		        	columns: [
		        		{
		        			text: '单价',
		        			dataIndex: 'manpowerPrice',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			dataIndex: 'manpowerTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		}
		        	],
                	draggable: false,
                	align: 'center'
		        },
		        {
		        	text: '机械', 
		        	columns: [
		        		{
		        			text: '单价',
		        			dataIndex: 'machineryPrice',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			dataIndex: 'machineryTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		}
		        	],
                	draggable: false,
                	align: 'center'
		        },
		        {
		        	text: '损耗',
		        	columns: [
		        		{
		        			text: '单价',
		        			dataIndex: 'lossPercent',
		        			flex: 1,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		}
		        	],
                	draggable: false,
                	align: 'center'
		        },
		        {
		        	text: '备注',
		        	flex: 1.7,
		        	draggable: false,
		        	align: 'center',
		        	dataIndex: 'remark',
		        	sortable: false,
		        	editor: me.isForPreview ? null : {
                		xtype: 'textarea'
                	},
		        	renderer: function (val, meta, rec){
		        		if (!rec.get('parentId') || !rec.get('itemUnit')) {
        					return '';
        				}
        				else {
        					return val.replace(/\n/g, '<br />');
        				}
		        	}
		        },
		        {
		        	text: '成本',
		        	hidden: User.isAdmin() ? false : true,
		        	flex: 0.5,
		        	draggable: false,
		        	align: 'center',
		        	dataIndex: 'cost',
		        	sortable: false,
		        	renderer: function (val, meta, rec) {
		        		if (!rec.get('parentId') || !rec.get('itemUnit') || 'NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
        					return '';
        				}
        				else {
        					return val;
        				}
		        	}
		        }
		    ],
		    listeners: {
		    	beforeitemcontextmenu: function (view, rec, item, index, e) {
		    		e.preventDefault();
		    		if (rec.get('itemCode') != '' && rec.get('itemUnit') != '') {
		    			if ('NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
		    				return false;
		    			}
		    			else {
		    				var menu = Ext.create('Ext.menu.Menu', {
							    width: 100,
							    floating: true,
							    items: [{
							    	text: '删除',
							    	handler: function (){
							    		var grid = me.down('gridpanel'),
							    			editing = grid.getPlugin(),
							    			st = rec.store,
							    			pre = st.getAt(index - 1),
							    			next = st.getAt(index + 1),
							    			code, i, editIndex = -1;
							    		Ext.suspendLayouts();

							    		// pre 大项
							    		if (pre.get('itemCode') != '' && pre.get('itemUnit') == '') {
							    			// next 小计
							    			if (next.get('itemCode') == '' && next.get('itemUnit') == '') {
							    				code = pre.get('itemCode');
							    				st.removeAt(index - 1, 3);
							    				index = index - 1;
							    				if (st.getAt(index).get('itemName') == '' && index == 0) {
							    					st.removeAll();
							    					Ext.getCmp('gridpanel-budgetheader').clean();
							    					Ext.getCmp('panel-budgetContent').clean();
							    				}
							    				else if (st.getAt(index).get('itemName') == '' && index != 0) {
							    					editIndex = index - 2;
							    				}
							    				else {
							    					editIndex = index + 1;
							    					i = getIndex(code);
							    					next = st.getAt(index);
							    					while (next.get('itemName') != '') {
							    						if (next.get('itemCode') != '') {
							    							if (next.get('itemCode').indexOf('-') != -1) {
							    								next.set('itemCode', getId(i) + '-' + next.get('itemCode').split('-')[1]);
							    							}
							    							else {
							    								next.set('itemCode', getId(i));
							    							}
							    							next.commit();
							    						}
							    						else {
							    							i++;
							    						}
							    						next = st.getAt(st.indexOf(next) + 1);
							    					}
							    				}
							    			}
							    			// next !小计
							    			else if (next.get('itemCode') != '' && next.get('itemUnit') != '') {
							    				st.removeAt(index);
							    				editIndex = index;
							    				code = pre.get('itemCode');
							    				i = 0;
							    				pre = st.getAt(index);
							    				while (pre.get('itemCode') != '') {
							    					pre.set('itemCode', code + '-' + (i+1));
							    					pre.commit();
							    					i++;
							    					pre = st.getAt(st.indexOf(pre) + 1);
							    				}
							    			}
							    		}
							    		// pre !大项
							    		else if (pre.get('itemCode') != '' && pre.get('itemUnit') != '') {
							    			// next 小计
							    			if (next.get('itemCode') == '' && next.get('itemUnit') == '') {
							    				st.removeAt(index);
							    				editIndex = index - 1;
							    			}
							    			// next !小计
							    			else if (next.get('itemCode') != '' && next.get('itemUnit') != '') {
							    				st.removeAt(index);
							    				editIndex = index;
							    				code = next.get('itemCode').split('-');
							    				i = parseInt(code[1], 10);
							    				i--;
							    				code = code[0];
							    				while (next.get('itemCode') != '') {
							    					next.set('itemCode', code + '-' + i);
							    					next.commit();
							    					i++;
							    					next = st.getAt(st.indexOf(next) + 1);
							    				}
							    			}
							    		}

							    		Ext.resumeLayouts();

							    		editing.startEdit(editIndex, 3);
							    		editing.completeEdit();
							    	}
							    }]
							});
							menu.showAt(e.getPoint());
		    			}
		    		}
		    		else {
		    			return false;
		    		}
		    	},
		    	afterrender: function (grid, opts) {
					var view = grid.getView();
					var tip = Ext.create('Ext.tip.ToolTip', {
					    target: view.el,
					    delegate: view.cellSelector,
					    trackMouse: true,
					    renderTo: Ext.getBody(),
					    // tpl: new Ext.XTemplate(
					    // 	'<table class="pros">',
					    //     '<tr>',
					    //     '<td>编号:</td>',
					    //     '<td>{itemCode}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>项目名称:</td>',
					    //     '<td>{itemName}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>单位:</td>',
					    //     '<td>{itemUnit}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>数量:</td>',
					    //     '<td>{itemAmount}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>主材单价:</td>',
					    //     '<td>{mainMaterialPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>主材总价:</td>',
					    //     '<td>{mainMaterialTotalPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>辅材单价:</td>',
					    //     '<td>{auxiliaryMaterialPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>辅材总价:</td>',
					    //     '<td>{auxiliaryMaterialTotalPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>人工单价:</td>',
					    //     '<td>{manpowerPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>人工总价:</td>',
					    //     '<td>{manpowerTotalPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>机械单价:</td>',
					    //     '<td>{machineryPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>机械总价:</td>',
					    //     '<td>{machineryTotalPrice}</td>',
					    //     '</tr>',
					    //     '<tr>',
					    //     '<td>损耗单价:</td>',
					    //     '<td>{lossPercent}</td>',
					    //     '</tr>',
					    //     '</table>'
					    // ),
					    listeners: {
					        beforeshow: function (tip) {
					        	var gridColumns = view.getGridColumns();
					        	var column = gridColumns[tip.triggerElement.cellIndex];
				                var val=view.getRecord(tip.triggerElement.parentNode).get(column.dataIndex);
				                if (val.replace) {
				                	val = val.replace(/\n/g, '<br />');
				                }
				                tip.update(val);
					        }
					    }
					});
				}
		    }
		}];

		this.callParent();
	}
})