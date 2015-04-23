Ext.define('FamilyDecoration.store.Feature', {
	extend: 'Ext.data.TreeStore',
	model: 'FamilyDecoration.model.Feature',

    autoLoad: true,
    root: {
        expanded: true,
        children: [
            { 
                name: "公告栏信息",
                cmp: 'bulletin-index',
                leaf: true,
                icon: 'resources/img/menu_item.ico'
            },
            {
                name: "业务列表",
                cmp: 'business-index',
                leaf: true,
                icon: 'resources/img/menu_item.ico'
            },
            {
                name: "工作日志", 
                expanded: true, 
                icon: 'resources/img/menu.ico',
                cmp: 'logbook-parent',
                children: [
                    {
                        name: "我的工作日志",
                        cmp: 'mylog-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: "工作日志查看",
                        cmp: 'checklog-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: '我的任务',
                        cmp: 'mytask-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: '任务分配',
                        cmp: 'taskassign-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: '请假',
                        cmp: 'leave-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: '请假批示',
                        cmp: 'leaveapproval-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    }
                ] 
            },
            {
                name: "预算", 
                expanded: true, 
                icon: 'resources/img/menu.ico',
                cmp: 'budget-parent',
                children: [
                    {
                        name: "添加预算",
                        cmp: 'budget-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: "基础项目添加",
                        cmp: 'basicitem-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: "成本分析",
                        cmp: 'costanalysis-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    }
                ] 
            },
            { 
                name: "查看图库",
                cmp: 'chart-index',
                leaf: true,
                icon: 'resources/img/menu_item.ico'
            },
            {
                name: "工程情况", 
                expanded: true, 
                cmp: 'project-parent',
                icon: 'resources/img/menu.ico',
                children: [
                    {
                        name: "各工程进度情况",
                        cmp: 'progress-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: "计划生成",
                        cmp: 'plan-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    },
                    {
                        name: '主材订购单',
                        cmp: 'mainmaterial-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    }
                ] 
            },
            {
                name: "应用设置", 
                expanded: true,
                cmp: 'setting-parent', 
                icon: 'resources/img/menu.ico',
                children: [
                    {
                        name: "账户设置",
                        cmp: 'setting-index',
                        leaf: true,
                        icon: 'resources/img/menu_item.ico'
                    }
                ] 
            }
        ]
    },

    statics: {
        // 载入之前进行过滤，通过获取用户身份，过滤掉对应功能
        filterFeature: function (rec){
            var flag;

            if (rec.get('cmp') == '') {
                flag = false;
            }
            else if (rec.get('cmp') == 'bulletin-index') {
                flag = User.isGeneral() ? false : true;
            }
            else if (rec.get('cmp') == 'logbook-parent') {
                flag = User.isAdmin() || User.isManager() || User.isDesignStaff() || User.isProjectStaff() || User.isSupervisor() || User.isBusinessStaff() || User.isAdministrationStaff() || User.isPropagandaManager() || User.isPropagandaStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'mylog-index') {
                flag = User.isAdmin() || User.isManager() || User.isDesignStaff() || User.isProjectStaff() || User.isSupervisor() || User.isBusinessStaff() || User.isAdministrationStaff() || User.isPropagandaManager() || User.isPropagandaStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'checklog-index') {
                flag = User.isAdmin() || User.isManager() ? true : false;
            }
            else if (rec.get('cmp') == 'mytask-index') {
                flag = true;
            }
            else if (rec.get('cmp') == 'taskassign-index') {
                flag = User.isAdmin() || User.isManager() ? true : false;
            }
            else if (rec.get('cmp') == 'leave-index') {
                if (DEBUG) {
                    flag = User.isAdmin() || User.isManager() || User.isDesignStaff() || User.isProjectStaff() || User.isSupervisor() || User.isBusinessStaff() || User.isAdministrationStaff() || User.isPropagandaManager() || User.isPropagandaStaff() ? true : false;
                }
                else {
                    flag = false;
                }
            }
            else if (rec.get('cmp') == 'leaveapproval-index') {
                if (DEBUG) {
                    flag = User.isAdmin() || User.isManager() ? true : false;
                }
                else {
                    flag = false;
                }
            }
            else if (rec.get('cmp') == 'budget-parent') {
                flag = User.isAdmin() || User.isDesignManager() || User.isDesignStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'chart-index') {
                flag = true;
            }
            else if (rec.get('cmp') == 'project-parent') {
                flag = true;
            }
            else if (rec.get('cmp') == 'progress-index') {
                flag = true;
            }
            else if (rec.get('cmp') == 'plan-index') {
                flag = User.isGeneral() ? false : true;
            }
            else if (rec.get('cmp') == 'mainmaterial-index') {
                flag = User.isAdmin() || User.isProjectManager() || User.isProjectStaff() || User.isDesignManager() || User.isDesignStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'setting-parent') {
                flag = User.isAdmin() || User.isBusinessStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'basicitem-index') {
                flag =  User.isAdmin() ? true : false;
            }
            else if (rec.get('cmp') == 'setting-index') {
                flag = User.isAdmin() || User.isBusinessStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'budget-index') {
                flag = User.isAdmin() || User.isDesignManager() || User.isDesignStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'costanalysis-index') {
                flag = User.isAdmin() ? true : false;
            }
            else if (rec.get('cmp') == 'business-index') {
                flag = User.isGeneral() ? false : true;
            }
            else {
                flag = true;
            }
            return flag;
        }
    }
});