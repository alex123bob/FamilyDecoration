Ext.define('FamilyDecoration.view.projectprogress.ProgressTable', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.projectprogress-progresstable',
	requires: [
        'FamilyDecoration.store.ProjectProgress'
	],
	autoScroll: true,
	refresh: Ext.emptyFn,

	initComponent: function () {
		var me = this;

		me.columns = {
			defaults: {
				align: 'left',
				sortable: false,
				menuDisabled: true
			},
			items: [
				{
					flex: 0.7,
					text: '项目',
					dataIndex: 'parentItemName'
				},
                {
					flex: 1,
					text: '子项目',
					dataIndex: 'itemName'
				},
                {
                    flex: 1,
                    text: '计划进度',
                    dataIndex: 'planStartTime',
					renderer: function (val, meta, rec) {
						if (val) {
							return val + ' ~ ' + rec.get('planEndTime');
						}
						else {
							return '';
						}
					}
                },
                {
                    flex: 2,
                    text: '实际进度',
                    dataIndex: 'practicalProgress',
					renderer: function (val, meta, rec){
						var result = '';
						if (val.length > 0) {
							Ext.each(val, function (obj, index){
								result += '<strong>' + (index + 1) + '.</strong>' 
									   + ' ' + obj['content'].replace(/\n/gi, '<br />') + '<br />' 
									   + '<span class="footnote">(' + obj['createTime'] + ') ' 
									   + obj['committerRealName'] + '</span>'
									   + '<br />';
							});
							return result;
						}
						else {
							return '';
						}
					}
                },
                {
                    flex: 2,
                    text: '监理意见',
                    dataIndex: 'supervisorComment',
					renderer: function (val, meta, rec){
						var result = '',
							pics;
						if (val.length > 0) {
							Ext.each(val, function (obj, index){
								result += '<strong>' + (index + 1) + '.</strong>' 
									   + ' ' + obj['content'].replace(/\n/gi, '<br />');
								if (obj['pass'] == '1') {
									result += '&nbsp;<font color="green">[验收通过]</font>';
								}
								else if (obj['pass'] == '-1') {
									result += '&nbsp;<font color="red">[验收不通过]</font>';
								}
								result += '<br />'
									   + '<span class="footnote">(' + obj['createTime'] + ') ' 
									   + obj['auditorRealName'] + '</span>'
									   + '<br />';
								if (obj.pics) {
									pics = obj.pics.split('>>><<<');
									Ext.each(pics, function(pic){
										result += '<img src="' + pic + '" width="100" height="50" />' + '<br />';
									});
								}
							});
						}
						return result;
					}
                }
			]
		};

		me.store = Ext.create('FamilyDecoration.store.ProjectProgress', {
			autoLoad: false
		});

		me.callParent();
	}
});