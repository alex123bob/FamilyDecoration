<?php
    include_once "./libs/login.php";
    function curPageURL() {
            $pageURL = 'http';
            if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
            $pageURL .= "s";
            }
            $pageURL .= "://";
            if ($_SERVER["SERVER_PORT"] != "80") {
            $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
            } 
            else {
            $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
            }
            return $pageURL;
    }
    $pageurl = curPageURL();
    $isLocal = preg_match("/localhost/i", $pageurl, $arr);
    if ($isLocal) {
    }
?>

<!DOCTYPE HTML>
<html>
<head>
    <link href="./favicon.ico" type="image/x-icon" rel="shortcut icon" /> 
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <script type="text/javascript">
        var DEBUG = <?php echo $isLocal ?> ? true : false;
        if (<?php echo isset($_GET["force_debug"]) ? "true" : "false"; ?> == true) {
            DEBUG = true;
        }
        var _PWDPREFIX = 'familydecoration-';
    </script>
    <title>佳诚装饰</title>
    <!-- <x-compile> -->
        <!-- <x-bootstrap> -->
            <link rel="stylesheet" href="bootstrap.css">
            <script src="ext/ext-dev.js"></script>
            <script src="bootstrap.js"></script>
        <!-- </x-bootstrap> -->
        <script src="app.js"></script>
    <!-- </x-compile> -->
    <link href="resources/css/global.css" rel="stylesheet" />
    <link rel="stylesheet" href="tools/dhtmlx/codebase/themes/message_solid.css" />
    <link rel="stylesheet" href="tools/sweetalert/dist/sweetalert.css" />
    <script type="text/javascript" src="resources/locale/ext-lang-zh_CN.js"></script>
    <script src="http://channel.sinaapp.com/api.js" type="text/javascript"></script>
    <!-- for Christmas effect -->
    <script src="tools/snow.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="tools/jquery-1.11.1.min.js"></script>
</head>
<body>
    <div id="userInfo" class="x-hide-display">
        <span>用户信息:</span>
        <span name="realname"></span>
        <span name="account"></span>
        <span name="authority"></span>
        <a href="javascript:void(0);" id="logout">注销</a>
        <!-- <a href="javascript:void(0);" id="feedback">反馈</a> -->
        <?php
            if (preg_match('/001-\d{3}/', $_SESSION["level"])) {
                // echo '<a href="javascript:void(0);" id="analysisChart">图表</a>'.
                // echo '<a href="javascript:void(0);" id="checkFeedback">反馈建议</a>'.
                echo '<a href="javascript:void(0);" id="logAndException">错误日志</a>';
            }
        ?>
    </div>

    <div id="tipBox" style="position:absolute;height:0px;top:10px;width:100%;text-align: right;line-height: 24px;display: none;">
        <span class="text" style="position:absolute;right: 20px;display:inline-block;background-color:#cccccc;color:#000;border-radius:3px;padding:0 10px;margin-top: 4px;border: 1px solid #99bce8;z-index: 9999999;"></span>
    </div>

    <div id="topMask" style="display:none;position: absolute;width: 100%;height:100%;z-index: 999999999;cursor:wait;"></div>

    <div class="x-hide-display" id="chartContainer">

    </div>

    <div class="x-hide-display" id="homepageChartContainer">
        
    </div>

    <div class="x-hide-display" id="completeProcess">
        
    </div>

    <div id="mytaskCompleteProcess" class="x-hide-display">
        
    </div>

    <?php
        if (class_exists("SaeChannel")) {
            $channel = new SaeChannel();
            $privateChannel = $channel->createChannel("sae_channel_".$_SESSION["name"], 60*60*24);
        }
        else {
            $privateChannel = null;
        }
    ?>

    <script type="text/javascript">
        var privateChannel = '<?php echo $privateChannel; ?>';

        Ext.define('User', {
            singleton: true,

            name: '<?php echo $_SESSION["name"]; ?>',

            level: '<?php echo $_SESSION["level"]; ?>',

            realname: '<?php echo $_SESSION["realname"]; ?>',

            phone: '<?php echo $_SESSION["phone"]; ?>',

            mail: '<?php echo $_SESSION["mail"]; ?>',

            profileImage: '<?php echo $_SESSION["profileImage"]; ?>',

            isAdmin: function (){
                return this.level == '001-001' || this.level == '001-002';
            },

            isManager: function (){
                var level = this.level;
                var flag = false;
                if (/^001-\d{3}$/i.test(level)) {
                    // admin
                    flag = false;
                }
                else if (/^00[2345789]-001$/.test(level)) {
                    // manager
                    flag = true;
                }
                return flag;
            },

            isDesignManager: function (){
                return this.level == '002-001';
            },

            isProjectManager: function (){
                return this.level == '003-001';
            },

            isBusinessManager: function (){
                return this.level == '004-001';
            },

            isAdministrationManager: function (){
                return this.level == '005-001';
            },

            isSupervisor: function (){
                return this.level == '003-003';
            },

            isDesignStaff: function (){
                return this.level == '002-002';
            },

            isProjectStaff: function (){
                return this.level == '003-002';
            },

            isBusinessStaff: function (){
                return this.level == '004-002';
            },

            isAdministrationStaff: function (){
                return this.level == '005-002';
            },

            isGeneral: function (){
                return this.level == '006-001';
            },

            isPropagandaManager: function (){
                return this.level == '007-001';
            },

            isPropagandaStaff: function (){
                return this.level == '007-002';
            },

            isFinanceManager: function (){
                return this.level == '008-001';
            },

            isFinanceStaff: function (){
                return (this.level == '008-002' || this.level == '008-003' || this.level == '008-004' || this.level == '008-005');
            },

            isFinanceAccountant: function (){
                return this.level == '008-002';
            },

            isFinanceCashier: function (){
                return this.level == '008-003';
            },

            isBudgetManager: function (){
                return this.level == '009-001';
            },

            isBudgetStaff: function (){
                return this.level == '009-002';
            },

            isCurrent: function (name){
                if (name) {
                    return this.name == name;
                }
                else {
                    return undefined;
                }
            },

            role: [{
                name: '总经理',
                value: '001-001'
            }, {
                name: '副总经理',
                value: '001-002'
            }, {
                name: '设计部主管',
                value: '002-001'
            }, {
                name: '设计师',
                value: '002-002'
            }, {
                name: '工程部主管',
                value: '003-001'
            }, {
                name: '项目经理',
                value: '003-002'
            }, {
                name: '监理',
                value: '003-003'
            }, {
                name: '市场部主管',
                value: '004-001'
            }, {
                name: '业务员',
                value: '004-002'
            }, {
                name: '见习业务员',
                value: '004-003'
            }, {
                name: '人事行政部主管',
                value: '005-001'
            }, {
                name: '人事行政部员工',
                value: '005-002'
            }, {
                name: '游客',
                value: '006-001'
            }, {
                name: '宣传部主管',
                value: '007-001'
            }, {
                name: '宣传部员工',
                value: '007-002'
            }, {
                name: '财务部主管',
                value: '008-001'
            }, {
                name: '财务部会计',
                value: '008-002'
            }, {
                name: '财务部出纳',
                value: '008-003'
            }, {
                name: '财务部预算员',
                value: '008-004'
            }, {
                name: '财务部采购',
                value: '008-005'
            }, {
                name: '预决算主管',
                value: '009-001'
            }, {
                name: '预决算员工',
                value: '009-002'
            }],

            getStatus: function (){
                var level = this.level,
                    role = this.role,
                    status;
                Ext.each(role, function (rec, index){
                    if (level == rec.value) {
                        status = rec.name;
                    }
                });
                if (status) {
                    return status;
                }
                else {
                    return '未知';
                }
            },

            getPhoneNumber: function (){
                if (this.phone) {
                    return this.phone;
                }
                else {
                    return false;
                }
            },

            getEmail: function (){
                if (this.mail) {
                    return this.mail;
                }
                else {
                    return false;
                }
            },

            getProfileImage: function (){
                if (this.profileImage) {
                    return this.profileImage;
                }
                else {
                    return false;
                }
            },            

            // get department according to user level value
            renderDepartment: function (level){
                var department = '';
                if (/^001-\d{3}$/i.test(level)) {
                    department = '总经办';
                }
                else if (/^002-\d{3}$/i.test(level)) {
                    department = '设计部';
                }
                else if (/^003-\d{3}$/i.test(level)) {
                    department = '工程部';
                }
                else if (/^004-\d{3}$/i.test(level)) {
                    department = '市场部';
                }
                else if (/^005-\d{3}$/i.test(level)) {
                    department = '人事行政部';
                }
                else if (/^006-\d{3}$/i.test(level)) {
                    department = '游客';
                }
                else if (/^007-\d{3}$/i.test(level)) {
                    department = '宣传部';
                }
                else if (/^008-\d{3}$/i.test(level)) {
                    department = '财务部';
                }
                else if (/^009-\d{3}$/i.test(level)) {
                    department = '预决算部';
                }
                else {
                    department = '非部门';
                }
                return department;
            },

            // get user role according to user level value
            renderRole: function (level){
                var role = '',
                    roleStr = level.split('-')[1];
                if (/^001-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '总经理';
                    }
                    else if (roleStr == '002') {
                        role = '副总经理';
                    }
                }
                // design department
                else if (/^002-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    else if (roleStr == '002') {
                        role = '设计师';
                    }
                }
                // project department
                else if (/^003-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    else if (roleStr == '002') {
                        role = '项目经理';
                    }
                    else if (roleStr == '003') {
                        role = '监理';
                    }
                }
                // business department
                else if (/^004-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    // this role could hand over businesses coming from business manager.
                    else if (roleStr == '002') {
                        role = '业务员';
                    }
                    // this role can't not get any business from business manager'
                    else if (roleStr == '003') {
                        role = '见习业务员';
                    }
                }
                // administration department
                else if (/^005-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    else if (roleStr == '002') {
                        role = '员工';
                    }
                }
                // visitor
                else if (/^006-\d{3}$/i.test(level)) {
                    role = '游客';
                }
                // propaganda department
                else if (/^007-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    else if (roleStr == '002') {
                        role = '员工';
                    }
                }
                // the ministry of finance
                else if (/^008-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    else if (roleStr == '002') {
                        role = '会计';
                    }
                    else if (roleStr == '003') {
                        role = '出纳';
                    }
                    else if (roleStr == '004') {
                        role = '预算员';
                    }
                    else if (roleStr == '005') {
                        role = '采购';
                    }
                }
                // the ministry of budget
                else if (/^009-\d{3}$/i.test(level)) {
                    if (roleStr == '001') {
                        role = '主管';
                    }
                    else if (roleStr == '002') {
                        role = '员工';
                    }
                }
                else {
                    role = '未知角色';
                }
                return role;
            },

            render: function (level){
                var role = this.role,
                    status;
                Ext.each(role, function (rec, index){
                    if (level == rec.value) {
                        status = rec.name;
                    }
                });
                if (status) {
                    return status;
                }
                else {
                    return '未知';
                }
            },

            getName: function (){
                return this.name;
            },

            getRealName: function (){
                return this.realname;
            }
        });

        document.getElementById('logout').onclick = function (){
            logout();
        }

        /* temporarily close this function. mail service has been upgraded. we have to figure out a way to make this service better later.
        document.getElementById('feedback').onclick = function (){
            if (Ext) {
                var win = Ext.create('Ext.window.Window', {
                    title: '用户使用问题和意见反馈',
                    width: 500,
                    height: 300,
                    layout: 'fit',
                    modal: true,
                    items: [{
                        xtype: 'textarea',
                        autoScroll: true,
                        id: 'textarea-feedback',
                        name: 'textarea-feedback',
                        hideLabel: true
                    }],
                    buttons: [{
                        text: '确定',
                        handler: function (){
                            var area = Ext.getCmp('textarea-feedback');
                            if (!Ext.isEmpty(area.getValue())) {
                                Ext.Ajax.request({
                                    url: './libs/feedback.php?action=send',
                                    method: 'POST',
                                    params: {
                                        name: User.getName(),
                                        realname: User.getRealName(),
                                        level: User.level,
                                        content: area.getValue()
                                    },
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                sendExternalMail('547010762@qq.com', '用户反馈意见', User.getRealName() + ': ' + area.getValue());
                                                sendExternalMail('674417307@qq.com', '用户反馈意见', User.getRealName() + ': ' + area.getValue());
                                                sendExternalMail('uggi@foxmail.com', '用户反馈意见', User.getRealName() + ': ' + area.getValue());
                                                sendExternalMail('649841226@qq.com', '用户反馈意见', User.getRealName() + ': ' + area.getValue());
                                                showMsg('发送成功，谢谢您的反馈，我们会及时处理您的问题。');
                                                win.close();
                                            }
                                            else {
                                                showMsg(obj.errMsg);
                                            }
                                        }
                                    }
                                });
                            }
                            else {
                                showMsg('请输入内容！');
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
        }

        if (document.getElementById('checkFeedback')) {
            document.getElementById('checkFeedback').onclick = function (){
                if (Ext) {
                    var win = Ext.create('Ext.window.Window', {
                        title: '用户使用问题和意见反馈',
                        width: 700,
                        height: 500,
                        layout: 'fit',
                        modal: true,
                        items: [{
                            xtype: 'gridpanel',
                            autoScroll: true,
                            id: 'gridpanel-checkFeedback',
                            name: 'gridpanel-checkFeedback',
                            columns: [{
                                text: '姓名',
                                dataIndex: 'realname',
                                flex: 1
                            }, {
                                text: '内容',
                                dataIndex: 'content',
                                flex: 1,
                                renderer: function (val) {
                                    return val.replace(/\n/ig, '<br />');
                                }
                            }, {
                                text: '结果',
                                dataIndex: 'result',
                                flex: 1,
                                renderer: function (val, meta, rec) {
                                    meta.style = 'cursor: pointer;';
                                    if (val) {
                                        return val.replace(/\n/ig, '<br />');
                                    }
                                    else {
                                        return val;
                                    }
                                }
                            }],
                            store: Ext.create('Ext.data.Store', {
                                fields: ['id', 'name', 'realname', 'level', 'content', 'result'],
                                autoLoad: true,
                                proxy: {
                                    type: 'rest',
                                    url: './libs/feedback.php?action=fetchFeedbacks',
                                    reader: {
                                        type: 'json'
                                    }
                                }
                            }),
                            listeners: {
                                cellclick: function (table, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
                                    if (2 == cellIndex) {
                                        Ext.Msg.prompt('提示', '请输入开发人员口令进行编辑。', function (btn, txt){
                                            if (btn == 'ok') {
                                                if (txt == 'iloveyou') {
                                                    var win = Ext.create('Ext.window.Window', {
                                                        title: '编辑修复结果',
                                                        width: 500,
                                                        height: 300,
                                                        layout: 'fit',
                                                        items: [{
                                                            xtype: 'textarea',
                                                            autoScroll: true,
                                                            value: rec.get('result')
                                                        }],
                                                        buttons: [{
                                                            text: '确定',
                                                            handler: function (){
                                                                var resultContent = win.down('textarea').getValue();
                                                                Ext.Ajax.request({
                                                                    url: './libs/feedback.php?action=editFeedback',
                                                                    method: 'POST',
                                                                    params: {
                                                                        id: rec.getId(),
                                                                        result: resultContent
                                                                    },
                                                                    callback: function (opts, success, res){
                                                                        if (success) {
                                                                            var obj = Ext.decode(res.responseText);
                                                                            if (obj.status == 'successful') {
                                                                                var grid = Ext.getCmp('gridpanel-checkFeedback');
                                                                                showMsg('编辑成功！');
                                                                                grid.getStore().reload();
                                                                                sendMsg(User.getName(), rec.get('name'), '李嘉编辑了您提出的反馈意见"' 
                                                                                    + rec.get('content') + '"，编辑内容为：' 
                                                                                    + resultContent, 'respondToFeedback');
                                                                                win.close();
                                                                                if (User.getName() == rec.get('name') 
                                                                                    && Ext.util.Cookies.get('lastXtype') == 'bulletin-index') {
                                                                                    var msgGrid = Ext.getCmp('gridpanel-message');
                                                                                    msgGrid && msgGrid.getStore().reload();
                                                                                }
                                                                            }
                                                                            else {
                                                                                showMsg(obj.errMsg);
                                                                            }
                                                                        }
                                                                    }
                                                                })
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
                                                else {
                                                    Ext.Msg.error('口令错误！');
                                                }
                                            }
                                        });
                                    }
                                },
                                afterrender: function(grid, opts) {
                                    var view = grid.getView();
                                    var tip = Ext.create('Ext.tip.ToolTip', {
                                        target: view.el,
                                        delegate: view.cellSelector,
                                        trackMouse: true,
                                        renderTo: Ext.getBody(),
                                        listeners: {
                                            beforeshow: function(tip) {
                                                var gridColumns = view.getGridColumns();
                                                if (tip.triggerElement.cellIndex == 2) {
                                                    tip.update('单击栏目，编辑内容');
                                                }
                                                else {
                                                    return false;
                                                }
                                            }
                                        }
                                    })
                                    ;
                                }
                            }
                        }],
                        buttons: [{
                            text: '关闭',
                            handler: function (){
                                win.close();
                            }
                        }]
                    });

                    win.show();
                }
            }
        }
        */

        if (document.getElementById('logAndException')) {
            document.getElementById('logAndException').onclick = function (){
                if (Ext) {
                    var st = Ext.create('Ext.data.Store', {
                        fields: ['detail', 'user', 'file', 'line', 'ip','url', 'refer', 'params','useragent', 'createTime', 'updateTime'],
                        proxy: {
                            type: 'rest',
                            url: './libs/api.php',
                            reader: {
                                type: 'json',
                                root: 'data',
                                totalProperty: 'total'
                            },
                            extraParams: {
                                action: 'ErrorLog.get'
                            }
                        },
                        autoLoad: true
                    });
                    var win = Ext.create('Ext.window.Window', {
                        title: '系统异常和错误',
                        width: 700,
                        height: 500,
                        layout: 'fit',
                        modal: true,
                        maximizable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                cls: 'gridpanel-errorandexception',
                                plugins: [
                                    Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1
                                    })
                                ],
                                tbar: [
                                    {
                                        xtype: 'combobox',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['name', 'value'],
                                            proxy: {
                                                type: 'memory',
                                                reader: {
                                                    type: 'json'
                                                }
                                            },
                                            data: [
                                                {
                                                    name: '系统错误/异常',
                                                    value: 0
                                                },
                                                {
                                                    name: '业务异常',
                                                    value: 1
                                                }
                                            ]
                                        }),
                                        displayField: 'name',
                                        valueField: 'value',
                                        editable: false,
                                        listeners: {
                                            change: function (combo, newVal, oldVal, opts){
                                                var oldProxy = st.getProxy();
                                                Ext.apply(oldProxy.extraParams, {
                                                    type: newVal
                                                });
                                                st.setProxy(oldProxy);
                                                st.loadPage(1);
                                            }
                                        }
                                    }
                                ],
                                dockedItems: [
                                    {
                                        xtype: 'pagingtoolbar',
                                        store: st,   // same store GridPanel is using
                                        dock: 'bottom',
                                        displayInfo: true
                                    }
                                ],
                                selModel: {
                                    mode: 'SIMPLE'
                                },
                                selType: 'checkboxmodel',
                                store: st,
                                columns: [
                                    {
                                        text: 'url',
                                        dataIndex: 'url',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textarea'
                                        }
                                    },
                                    {
                                        text: '参数',
                                        dataIndex: 'params',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textarea'
                                        }
                                    },
                                    {
                                        text: '详细',
                                        dataIndex: 'detail',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textarea'
                                        }
                                    },
                                    {
                                        text: '用户',
                                        dataIndex: 'user',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textarea'
                                        }
                                    },
                                    {
                                        text: '文件',
                                        dataIndex: 'file',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textarea'
                                        }
                                    },
                                    {
                                        text: '行号',
                                        dataIndex: 'line',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textfield'
                                        }
                                    },
                                    {
                                        text: 'IP',
                                        dataIndex: 'ip',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textfield'
                                        }
                                    },
                                    {
                                        text: 'refer',
                                        dataIndex: 'refer',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textfield'
                                        }
                                    },
                                    {
                                        text: '设备',
                                        dataIndex: 'useragent',
                                        flex: 1,
                                        align: 'center',
                                        editor: {
                                            xtype: 'textarea'
                                        }
                                    },
                                    {
                                        text: '时间',
                                        dataIndex: 'createTime',
                                        flex: 1,
                                        align: 'center'
                                    }
                                ]
                            }
                        ],
                        buttons: [
                            {
                                text: '关闭',
                                handler: function (){
                                    win.close();
                                }
                            },
                            {
                                text: '删除',
                                handler: function (){
                                    var grid = win.down('gridpanel'),
                                        recs = grid.getSelectionModel().getSelection();
                                    if (recs.length > 0) {
                                        Ext.Msg.warning('确定要删除所选项吗？', function (btnId){
                                            if ('yes' == btnId) {
                                                function del(recs) {
                                                    var len = recs.length,
                                                        func = arguments.callee;
                                                    if (recs.length > 0) {
                                                        ajaxUpdate('ErrorLog.delete', {
                                                            createTime: recs[len - 1].get('createTime')
                                                        }, ['createTime'], function (obj){
                                                            recs.pop();
                                                            func(recs);
                                                        }, true);
                                                    }
                                                    else {
                                                        grid.getStore().loadPage(1);
                                                    }
                                                }
                                                del(recs);
                                            }
                                        });
                                    }
                                    else {
                                        showMsg('请选择要删除日志！');
                                    }
                                }
                            }
                        ]
                    });

                    win.show();
                }
            }
        }

        /**
         * for Christmas snow effect
         */
        // just close the snow coz now it's spring in China. -_-||
        // createSnow('resources/img/snow/', 100);

        // for firework effect.
        $(function (){
            var $fireworkCanvas = $('<div class="fireworkCanvas" style="z-index: 99999999; width: 100%; height: 100%; position: fixed;">');
            $('body').append($fireworkCanvas);
            $('.fireworkCanvas').fireworks({ 
                sound: false, // 声音效果
                opacity: 0.9, 
                width: '100%', 
                height: '100%'
            });
            setTimeout(function() {
                $('.fireworkCanvas').fadeOut(2000, function (){
                    $(this).remove();
                });
            }, 10000);
        });
        // end of firework effect.
        
    </script>
    <script type="text/javascript" src="highchart/js/highcharts.js"></script>
    <script type="text/javascript" src="highchart/js/highcharts-3d.js"></script>
    <script type="text/javascript" src="highchart/js/exporting.js"></script>
    <script type="text/javascript" src="highchart/index.js"></script>
    <script type="text/javascript" src="tools/title_notifier.js"></script>
    <script type="text/javascript" src="tools/dhtmlx/codebase/message.js"></script>
    <script type="text/javascript" src="tools/sweetalert/dist/sweetalert.min.js"></script>
    <script type="text/javascript" src="tools/md5.min.js"></script>
    <script type="text/javascript" src="tools/jquery.firework.js"></script>
</body>
</html>
