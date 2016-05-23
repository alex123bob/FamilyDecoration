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
                icon: 'resources/img/bulletin.png'
            },
            {
                name: "业务列表",
                expanded: true,
                cmp: 'business-parent',
                leaf: false,
                icon: 'resources/img/business.png',
                children: [
                    {
                        name: '我的业务',
                        cmp: 'mybusiness-index',
                        leaf: true,
                        icon: 'resources/img/mybusiness.png'
                    },
                    {
                        name: '查看业务',
                        cmp: 'checkbusiness-index',
                        leaf: true,
                        icon: 'resources/img/checkbusiness.png'
                    },
                    {
                        name: '签单业务',
                        cmp: 'signbusiness-index',
                        leaf: true,
                        icon: 'resources/img/sign-business.png'
                    },
                    {
                        name: '查看签单业务',
                        cmp: 'checksignbusiness-index',
                        leaf: true,
                        icon: 'resources/img/check-sign-business.png'
                    },
                    {
                        name: '小区内容',
                        cmp: 'regionmgm-index',
                        leaf: true,
                        icon: 'resources/img/leave.png'
                    },
                    {
                        name: '废单业务',
                        cmp: 'deadbusiness-index',
                        leaf: true,
                        icon: 'resources/img/trashbin1.png'
                    }
                ]
            },
            {
                name: "工作日志", 
                expanded: true, 
                icon: 'resources/img/blog-parent.png',
                cmp: 'logbook-parent',
                children: [
                    {
                        name: "我的工作日志",
                        cmp: 'mylog-index',
                        leaf: true,
                        icon: 'resources/img/mylog.png'
                    },
                    {
                        name: "工作日志查看",
                        cmp: 'checklog-index',
                        leaf: true,
                        icon: 'resources/img/checklog.png'
                    },
                    {
                        name: '我的任务',
                        cmp: 'mytask-index',
                        leaf: true,
                        icon: 'resources/img/mytask.png'
                    },
                    {
                        name: '任务分配',
                        cmp: 'taskassign-index',
                        leaf: true,
                        icon: 'resources/img/checktask.png'
                    },
                    {
                        name: '请假',
                        cmp: 'leave-index',
                        leaf: true,
                        icon: 'resources/img/leave.png'
                    },
                    {
                        name: '请假批示',
                        cmp: 'leaveapproval-index',
                        leaf: true,
                        icon: 'resources/img/approve.png'
                    }
                ] 
            },
            {
                name: "预算", 
                expanded: true, 
                icon: 'resources/img/budget-parent.png',
                cmp: 'budget-parent',
                children: [
                    {
                        name: "添加预算",
                        cmp: 'budget-index',
                        leaf: true,
                        icon: 'resources/img/addbudget.png'
                    },
                    {
                        name: "基础项目添加",
                        cmp: 'basicitem-index',
                        leaf: true,
                        icon: 'resources/img/basicitem.png'
                    },
                    {
                        name: "成本分析",
                        cmp: 'costanalysis-index',
                        leaf: true,
                        icon: 'resources/img/cost.png'
                    }
                ] 
            },
            { 
                name: "查看图库",
                cmp: 'chart-index',
                leaf: true,
                icon: 'resources/img/chart.png'
            },
            {
                name: "工程情况", 
                expanded: true, 
                cmp: 'project-parent',
                icon: 'resources/img/project-parent.png',
                children: [
                    {
                        name: "工程进度",
                        cmp: 'progress-index',
                        leaf: true,
                        icon: 'resources/img/progress.png'
                    },
                    {
                        name: "计划生成",
                        cmp: 'plan-index',
                        leaf: true,
                        icon: 'resources/img/plan.png'
                    },
                    {
                        name: '主材订购单',
                        cmp: 'mainmaterial-index',
                        leaf: true,
                        icon: 'resources/img/order.png'
                    },
                    {
                        name: '工程目录',
                        cmp: isDebug() ? 'projectcategory-index' : '',
                        leaf: true,
                        icon: 'resources/img/projectcategory.png'
                    }
                ] 
            },
            {
                name: "应用设置", 
                expanded: true,
                cmp: 'setting-parent', 
                icon: 'resources/img/setting-parent.png',
                children: [
                    {
                        name: "短信报表",
                        cmp: 'msg-index',
                        leaf: true,
                        icon: 'resources/img/message.png'
                    }
                ] 
            },
            {
                name: '人事管理',
                expanded: true,
                cmp: 'personnel-parent',
                icon: 'resources/img/personnel.png',
                children: [
                    {
                        name: "账户管理",
                        cmp: 'setting-index',
                        leaf: true,
                        icon: 'resources/img/account.png'
                    },
                    {
                        name: '人事统计',
                        cmp: 'personnel-index',
                        leaf: true,
                        icon: 'resources/img/statistics.png'
                    }
                ]
            },
            {
                name: '邮箱平台',
                cmp: 'mail-index',
                leaf: true,
                icon: 'resources/img/email.png'
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
                flag = User.isAdmin() || User.isManager() || User.isDesignStaff() || User.isProjectStaff() || User.isSupervisor() || User.isBusinessStaff() || User.isAdministrationStaff() || User.isPropagandaStaff() || User.isFinanceStaff() || User.isBudgetManager() || User.isBudgetStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'mylog-index') {
                flag = User.isAdmin() || User.isManager() || User.isDesignStaff() || User.isProjectStaff() || User.isSupervisor() || User.isBusinessStaff() || User.isAdministrationStaff() || User.isPropagandaStaff() || User.isFinanceStaff() || User.isBudgetManager() || User.isBudgetStaff() ? true : false;
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
                    flag = User.isAdmin() || User.isManager() || User.isDesignStaff() || User.isProjectStaff() || User.isSupervisor() || User.isBusinessStaff() || User.isAdministrationStaff() || User.isPropagandaStaff() || User.isFinanceStaff() ? true : false;
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
                flag = User.isAdmin() || User.isDesignManager() || User.isDesignStaff() || User.isBudgetManager() || User.isBudgetStaff() || User.isFinanceManager() ? true : false;
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
                flag = true;
            }
            else if (rec.get('cmp') == 'mainmaterial-index') {
                flag = User.isAdmin() || User.isProjectManager() || User.isProjectStaff() || User.isDesignManager() || User.isDesignStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'setting-parent') {
                flag = User.isAdmin() || User.isBusinessStaff() || User.isAdministrationManager() ? true : false;
            }
            else if (rec.get('cmp') == 'basicitem-index') {
                flag =  User.isAdmin() || User.isBudgetManager() || User.isBudgetStaff() || User.isFinanceManager() ? true : false;
            }
            else if (rec.get('cmp') == 'personnel-parent') {
                flag = User.isAdmin() || User.isBusinessStaff() || User.isAdministrationManager() ? true : false;
            }
            else if (rec.get('cmp') == 'personnel-index') {
                flag = User.isAdmin() || User.isAdministrationManager() || User.isAdministrationStaff() ? true : false;
            }
            else if (rec.get('cmp') == 'setting-index') {
                flag = User.isAdmin() || User.isBusinessStaff() || User.isAdministrationManager() ? true : false;
            }
            else if (rec.get('cmp') == 'msg-index') {
                flag = User.isAdmin() ? true : false;
            }
            else if (rec.get('cmp') == 'mail-index') {
                flag = User.isGeneral() ? false : true;
            }
            else if (rec.get('cmp') == 'budget-index') {
                flag = User.isAdmin() || User.isDesignManager() || User.isDesignStaff() || User.isBudgetManager() || User.isBudgetStaff() || User.isFinanceManager() ? true : false;
            }
            else if (rec.get('cmp') == 'costanalysis-index') {
                flag = User.isAdmin() || User.isBudgetManager() || User.isFinanceManager() ? true : false;
            }
            else if (rec.get('cmp') == 'business-parent') {
                flag = User.isGeneral() ? false : true;
            }
            else if (rec.get('cmp') == 'mybusiness-index') {
                flag = User.isGeneral() ? false : true;
            }
            else if (rec.get('cmp') == 'checkbusiness-index') {
                flag = User.isAdmin() || User.isBusinessManager() || User.isAdministrationManager() || User.isDesignManager() || User.isFinanceManager() ? true : false;
            }
            else if (rec.get('cmp') == 'signbusiness-index') {
                flag = User.isDesignStaff() || User.isDesignManager() ? true : false;
            }
            else if (rec.get('cmp') == 'checksignbusiness-index') {
                flag = User.isAdmin() || User.isDesignManager() || User.isProjectManager() || User.isBudgetManager() || User.isBudgetStaff() || User.isFinanceManager() ? true : false;
            }
            else if (rec.get('cmp') == 'regionmgm-index') {
                flag = User.isGeneral() ? false : true;
            }
            else {
                flag = true;
            }
            return flag;
        }
    }
});