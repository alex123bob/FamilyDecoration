Ext.define('FamilyDecoration.store.WorkCategory', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.WorkCategory',

	data: [
		{
			name: '泥工',
			value: '0001'
		},
		{
			name: '木工',
			value: '0002'
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
			name: '杂工',
			value: '0005'
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
			if (arr[i].get('value') == val) {
				res = arr[i].get('name');
				break;
			}
		}
		return res;
	}
});