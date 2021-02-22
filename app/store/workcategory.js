Ext.define('FamilyDecoration.store.WorkCategory', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.WorkCategory',

	data: [
		{
			name: '装饰泥工',
			value: '0001'
		},
		{
			name: '基础泥工',
			value: '0006'
		},
		{
			name: '装饰木工',
			value: '0002'
		},
		{
			name: '基础木工',
			value: '0010'
		},
		{
			name: '油漆工',
			value: '0003'
		},
		{
			name: '水电工',
			value: '0004'
		},
		{
			name: '钢筋电焊工',
			value: '0011'
		},
		{
			name: '力工',
			value: '0005'
		},
		{
			name: '其他',
			value: '0009'
		}
	],

	singleton: true,

	proxy: {
		type: 'memory',
        reader: {
            type: 'json'
        }
	},

	renderer: function (val){
		var arr = this.data.items,
			res = '';
		for (var i = 0; i < arr.length; i++) {
			if (val == '小计' || val == '总计') {
				res = val;
				break;
			}
			else if (arr[i].get('value') == val) {
				res = arr[i].get('name');
				break;
			}
		}
		return res;
	}
});