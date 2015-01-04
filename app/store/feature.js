Ext.define('FamilyDecoration.store.Feature', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.Feature',
	data: [{
        name: '公告栏信息',
        cmp: 'bulletin-index'
    }, {
        name: '添加预算',
        cmp: 'budget-index'
    }, {
        name: '查看图库',
        cmp: 'chart-index'
    }, {
        name: '各工程进度情况',
        cmp: 'progress-index'
    }, {
        name: '基础项目添加',
        cmp: 'basicitem-index'
    }, {
        name: '应用设置',
        cmp: 'setting-index'
    }],

    autoLoad: true,

    // 载入之前进行过滤，通过获取用户身份，过滤掉对应功能
    filterFeature: function (user){
    	var store = this,
            flag;

    	store.filterBy(function (rec){
            if (rec.get('cmp') == '') {
                flag = false;
            }
            else if (rec.get('cmp') == 'basicitem-index') {
                flag =  user.isAdmin() ? true : false;
            }
            else if (rec.get('cmp') == 'setting-index') {
                flag = user.isAdmin() || user.isManager() ? true : false;
            }
            else if (rec.get('cmp') == 'budget-index') {
                flag = user.isAdmin() || user.isManager() ? true : false;
            }
            else {
                flag = true;
            }
    		return flag;
    	});
    }
});