Ext.onReady(function () {
    swal.setDefaults({
        confirmButtonColor: '#317040'
    });
});
Ext.require('Ext.window.MessageBox', function () {
    Ext.override(Ext.window.MessageBox, {
        info: function (msg, fn, scope) {
            // var cfg = {
            //     title: '提示',
            //     msg: msg,
            //     buttons: this.OK,
            //     fn: fn,
            //     scope: scope,
            //     width: 450,
            //     icon: Ext.Msg.INFO
            // };
            // return this.show(cfg);
            return swal({
                title: '提示',
                text: msg.replace(/\n/gi, '<br />'),
                type: 'info',
                html: true,
                animation: 'slide-from-top',
                confirmButtonText: '确定',
                closeOnConfirm: true
            }, function () {
                if (typeof fn === 'function') {
                    fn();
                }
            });
        },
        warning: function (msg, fn, scope) {
            // var cfg = {
            //     title: '警告',
            //     msg: msg,
            //     buttons: this.YESNO,
            //     fn: fn,
            //     scope: scope,
            //     width: 450,
            //     icon: Ext.Msg.QUESTION
            // };
            // return this.show(cfg);
            return swal({
                title: '警告',
                text: msg.replace(/\n/gi, '<br />'),
                type: 'warning',
                html: true,
                showCancelButton: true,
                confirmButtonText: "是",
                cancelButtonText: '否',
                closeOnConfirm: true,
                animation: 'slide-from-top'
            }, function () {
                if (typeof fn === 'function') {
                    fn('yes');
                }
            });
        },
        error: function (msg, fn, scope) {
            var cfg, text;
            if (typeof msg == 'string') {
                text = msg;
            }
            else if (msg.errMsg) {
                // css 强制换行: word-wrap:break-word;word-break:break-all;
                text = '<div style="word-wrap:break-word;word-break:break-all;">' + msg.errMsg + '</div>';
                if (msg.detail) {
                    text = text + '<p style="margin:10px 0 0;"><a onclick="$(\'.detailedInfo\').toggle();" id="viewErrorMsgDetail" class="expandable" href="javascript:void(0);" ' +
                        '><span>+</span>' + '详细信息' + '</a></p>' +
                        '<div class="detailedInfo" style="display:none;max-height:200px;overflow: auto;border: 1px solid #ccc;width: 350px;margin: 0 auto;">' + msg.detail + '</div>';
                }
            }

            return swal({
                title: '错误',
                text: text.replace(/\n/gi, '<br />'),
                type: 'error',
                html: true,
                confirmButtonText: '确定',
                closeOnConfirm: true
            }, function () {
                if (typeof fn === 'function') {
                    fn();
                }
            });

            // cfg = {
            //     title: '错误',
            //     msg: text,
            //     buttons: this.OK,
            //     fn: fn,
            //     scope: scope,
            //     width: 450,
            //     icon: Ext.Msg.ERROR
            // };

            // return this.show(cfg);
        },
        read: function (msg, fn, scope) {
            return swal({
                title: "提示",
                text: msg.replace(/\n/gi, '<br />'),
                type: "input",
                html: true,
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "请输入"
            }, function (inputValue) {
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError("输入为空！");
                    return false
                }
                fn(inputValue);
            });
        },
        password: function (msg, fn, scope) {
            return swal({
                title: "提示",
                text: msg.replace(/\n/gi, '<br />'),
                type: "input",
                html: true,
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "请输入",
                inputType: 'password'
            }, function (inputValue) {
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError("输入为空！");
                    return false
                }
                fn(inputValue);
            });
        },
        success: function (msg, fn, scope){
            return swal({
                title: '成功',
                text: msg.replace(/\n/gi, '<br />'),
                type: 'success',
                html: true
            }, fn);
        }
    });
});

// Ext.require('Ext.selection.CheckboxModel', function (){
//     Ext.override(Ext.selection.CheckboxModel, {
//         mode: 'SIMPLE'
//     });
// });

Ext.require('Ext.form.field.Date', function () {
    Ext.override(Ext.form.field.Date, {
        cleanBtn: false, // config parameter, if you need, just set it as true. then a clean button will pop up beside today button used to clean value in inputEl.
        cleanHandler: Ext.emptyFn,
        onTriggerClick: function () {
            var me = this;
            me.callParent(arguments);
            if (me.cleanBtn && me.picker.todayBtn.container.query('.datefield-clean-button').length <= 0) {
                var btn = new Ext.Button({
                    text: '清空',
                    cls: 'datefield-clean-button',
                    handler: function () {
                        me.setValue('');
                        me.triggerBlur(); // this is private functionality, not recommended. any better idea?
                        if (typeof me.cleanHandler == 'function'){
                            me.cleanHandler();
                        }
                    }
                });
                btn.render(me.picker.todayBtn.container);
            }
        }
    });
});

// override enableOverflow property to make sure tha tall toolbar will automatically overflow.
Ext.require('Ext.toolbar.Toolbar', function () {
    Ext.toolbar.Toolbar.prototype.enableOverflow = true;
});

Ext.require('Ext.grid.Panel', function() {
    Ext.override(Ext.grid.Panel, {
        focusRow: function(row) {
            var selModel = this.getSelectionModel(),
                gridView = this.getView(),
                st = this.getStore(),
                index;
            if (row) {
                selModel.deselectAll();
                index = st.indexOf(row);
                gridView.focusRow(index, 200);
                selModel.select(index);
            }
            else {
                // do nothing.
            }
        }
    });
});

// actionName: if false, use default action "get"
function ajaxGet(className, actionName, params, callback) {
    if (Ext.isObject(params) && !Ext.Object.isEmpty(params)) {
        var url = './libs/api.php?action=' + className + '.' + (actionName ? actionName : 'get');
        for (var pro in params) {
            if (params.hasOwnProperty(pro)) {
                var val = params[pro];
                url += '&' + pro + '=' + val;
            }
        }
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            callback: function (opts, success, res) {
                if (success) {
                    var obj = Ext.decode(res.responseText);
                    callback(obj);
                }
            }
        });
    }
    else {
        showMsg('参数不正确！');
    }
}

// isCustomAction: if true, className will be the classical className + actionName. 
// combined by developer before invoke this function.
function ajaxUpdate(className, params, conditionParams, callback, isCustomAction) {
    if (Ext.isObject(params) && !Ext.Object.isEmpty(params)) {
        if (isCustomAction == true) {
            var url = './libs/api.php?action=' + className;
        }
        else {
            var url = './libs/api.php?action=' + className + '.update';
        }
        var p = {};
        if (!Ext.isArray(conditionParams)) {
            conditionParams = [conditionParams];
        }
        for (var pro in params) {
            if (params.hasOwnProperty(pro)) {
                var val = params[pro];
                if (Ext.Array.contains(conditionParams, pro)) {
                    p[pro] = val;
                }
                else {
                    p['@' + pro] = val;
                }
            }
        }
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: p,
            callback: function (opts, success, res) {
                if (success) {
                    var obj = Ext.decode(res.responseText);
                    if ('successful' == obj.status) {
                        callback(obj);
                    }
                    else {
                        showMsg(obj.errMsg);
                    }
                }
            }
        });
    }
    else {
        showMsg('参数不正确！');
    }
}

function ajaxAdd(className, params, callback, errorHandler, isCustomAction) {
    function add(className, p, isCustomAction) {
        if (p && !Ext.Object.isEmpty(p)) {
            if (isCustomAction == true) {
                var url = './libs/api.php?action=' + className;
            }
            else {
                var url = './libs/api.php?action=' + className + '.add';
            }
            var params = {};
            for (var pro in p) {
                if (p.hasOwnProperty(pro)) {
                    var val = p[pro];
                    params['@' + pro] = val;
                }
            }
            Ext.Ajax.request({
                url: url,
                params: params,
                method: 'POST',
                callback: function (opts, success, res) {
                    if (success) {
                        var obj = Ext.decode(res.responseText);
                        if ('successful' == obj.status) {
                            callback(obj);
                        }
                        else {
                            showMsg(obj.errMsg);
                            if (typeof errorHandler == 'function') {
                                errorHandler(obj);
                            }
                        }
                    }
                }
            });
        }
        else {
            showMsg('参数有误！');
        }
    }
    if (Ext.isObject(params)) {
        add(className, params, isCustomAction);
    }
    else {
        showMsg('参数不正确！');
    }
}

/**
 * @params only need pass the id of corresponding record.
 */
function ajaxDel(className, params, callback) {
    if (Ext.isObject(params) && !Ext.Object.isEmpty(params)) {
        var url = './libs/api.php?action=' + className + '.del';
        for (var pro in params) {
            if (params.hasOwnProperty(pro)) {
                var val = params[pro];
                url += '&' + pro + '=' + val;
            }
        }
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            callback: function (opts, success, res) {
                if (success) {
                    var obj = Ext.decode(res.responseText);
                    if ('successful' == obj.status) {
                        callback(obj);
                    }
                    else {
                        showMsg(obj.errMsg);
                    }
                }
            }
        });
    }
    else {
        showMsg('参数不正确！');
    }
}

function renderNumber(n) {
    var str = '⓪①②③④⑤⑥⑦⑧⑨',
        result = [];
    n = parseInt(n, 10);
    if (Ext.isNumber(n) && n >= 0) {
        n = n.toString();
        result = n.split('');
        Ext.each(result, function (item, index, arr) {
            arr[index] = str[parseInt(item, 10)];
        });
    }
    return result.join('');
}

// index为对应要生成的编号，从1开始
function getId(index) {
    if (index) {
        var cluster = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var str = '', len = cluster.length;
        if (index > len) {
            var m = Math.ceil(index / len),
                r = index % len;
            for (var i = 0; i < m; i++) {
                str += cluster[r - 1];
            }
            return str;
        }
        else {
            str = cluster[index - 1];
            return str;
        }
    }
    else {
        return '';
    }
}

function getIndex(c) {
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return str.indexOf(c) + 1;
}

// (function () {
//     var showing = false,
//         tid;
//     window.showMsg = function (title, format) {
//         Ext.select('#tipBox .text').setHTML(title);
//         Ext.select('#tipBox').slideIn('t', {
//             //  easing: 'easeOut',
//             duration: 500
//         });
//         if (tid) {
//             clearTimeout(tid);
//         }
//         tid = setTimeout(hideMsg, 4000);
//         showing = true;
//     };

//     window.hideMsg = function () {
//         if (showing) {
//             var el = Ext.select('#tipBox').first();
//             if (el.isVisible()) {
//                 el.slideOut('t', {
//                     //  easing: 'easeOut',
//                     duration: 500
//                 });
//             }
//         }
//         showing = false;
//     };
// })();

// this functionality is used to replace the old showMsg pop up dialogue.
// use DHTMLX library.
function showMsg(msg) {
    dhtmlx.message({
        text: '<img src="resources/img/message-hint.png" width="22" height="22" /> ' + msg
    });
}

//Ext.Ajax.disableCachingParam = true;
Ext.require('Ext.Ajax', function () {
    /**
     * To be called when the request has come back from the server
     * @private
     * @param {Object} request
     * @return {Object} The response
     */
    Ext.Ajax.onComplete = function (request) {
        var me = this,
            options = request.options,
            result,
            success,
            response;

        try {
            result = me.parseStatus(request.xhr.status);
        }
        catch (e) {
            // in some browsers we can't access the status if the readyState is not 4, so the request has failed
            result = {
                success: false,
                isException: false
            };
        }
        success = result.success;

        if (success) {
            response = me.createResponse(request);
            if (me.fireEvent('requestcomplete', me, response, options)) {
                Ext.callback(options.success, options.scope, [response, options]);
            }
            else {
                success = false;
                Ext.callback(options.failure, options.scope, [response, options]);
            }
        }
        else {
            if (result.isException || request.aborted || request.timedout) {
                response = me.createException(request);
            }
            else {
                response = me.createResponse(request);
            }
            me.fireEvent('requestexception', me, response, options);
            Ext.callback(options.exception, options.scope, [response, options]);
        }
        Ext.callback(options.callback, options.scope, [options, success, response]);
        delete me.requests[request.id];
        return response;
    };

    /**
     * Fires before a network request is made to retrieve a data object.
     */
    Ext.Ajax.on('beforerequest', function (conn, opts, eopts) {
        if (/#debug/gi.test(location.hash)) {
            opts.url += (opts.url.indexOf('?') != -1 ? '&debug' : '?debug');
        }
        opts.silent = opts.silent || (opts.operation ? opts.operation.silent : false) ||
            (opts.proxy ? opts.proxy.silent : false);
        if (opts.silent === true && opts.automatic === true) {
            return;
        }
        // else if (!opts.ga) {
        //     ga(opts.url+"+"+JSON.stringify(opts.params));
        //     return;
        // }

        if (opts.mask) {
            Ext.get(opts.mask).mask('', 'x-mask-wait');
        }
        else {
            var el = Ext.get('topMask');
            el && el.setStyle('display', 'block');
        }
    });

    Ext.Ajax.on('requestcomplete',
        /**
         * Fires if the request was successfully completed.
         * @return {?boolean}
         */
        function (conn, response, opts, eopts) {
            if (opts.mask) {
                Ext.get(opts.mask).unmask();
            }
            else {
                var el = Ext.get('topMask');
                el && el.setStyle('display', 'none');
            }
            var text = response.responseText;
            var showMgs = opts.showMsg || Ext.Ajax.showMsg;
            if (typeof showMgs === 'undefined') {
                showMgs = true;
            }

            return checkResponseError(text, showMgs, opts.silent);
        }
    );

    /**
     * @desc Checks whether the responseText is error or not.
     * @param {string} text  An string in jsonData type as usual.
     * @param {boolean} showMgs  errors the errMsg if passes this parameter while the errMsg exists.
     * @return {boolean} result  Return value reponses the check result.
     */
    function checkResponseError(text, showMgs, silent) {
        try {
            var json = Ext.JSON.decode(text, true);

            if (null === json) {
                throw 'Ext.JSON decode text run error';
            }

            if (json.status == 'failing') {
                if (!silent && showMgs) {
                    Ext.defer(function () {
                        Ext.Msg.error(json);
                    }, 300);
                }
                return false;
            }
        }
        catch (e) {
            return true;
        }
        return true;
    }

    /**
     * Fires if an error HTTP status was returned from the server.
     */
    Ext.Ajax.on('requestexception', function (conn, response, opts, eopts) {
        if (opts.silent === true) {
            return;
        }
        if (opts.mask) {
            Ext.get(opts.mask).unmask();
        }
        else {
            var el = Ext.get('topMask');
            el && el.setStyle('display', 'none');
        }
        var status = response.status;
        if (status === 0) {
            Ext.defer(function () {
                Ext.Msg.error('请求失败, 服务器没有响应。');
            }, 300);
            return;
        }
        else if (status === 403) {
            Ext.defer(function () {
                Ext.Msg.error('您没有进行该操作的权限, 可能由以下原因造成:<br/>1. 用户未被授予该操作的权限<br/>2. 产品或功能未授权或授权已失效');
            }, 300);
            return;
        }
        else if (status === 404) {
            Ext.defer(function () {
                Ext.Msg.error('您请求的页面不存在');
            }, 300);
            return;
        }
        else if (status === 401) {
            var obj = Ext.decode(response.responseText);
            Ext.defer(function () {
                Ext.Msg.error(obj.errMsg, logoutWithoutCleanningSession);
                // logout ten seconds after detecting user logined in another device.
                Ext.defer(function (){
                    logoutWithoutCleanningSession();
                }, 10000);
            }, 300);
        }
        else if (status === -1) {
            // do nothing
        }
        else {
            Ext.defer(function () {
                Ext.Msg.error(response.status + ':' + response.statusText);
            }, 300);
        }
    });
});

function logout() {
    Ext.Ajax.request({
        url: './libs/user.php?action=logout',
        method: 'POST',
        callback: function (opts, success, res) {
            if (success) {
                var obj = Ext.decode(res.responseText);
                if (obj.status == 'successful') {
                    Ext.util.Cookies.clear('lastXtype');
                    location.href = 'login/index.html';
                }
            }
        }
    });
}

function logoutWithoutCleanningSession() {
    location.href = 'login/index.html';
}

/**
 * polish raw data into html string(\n \r to br etc.)
 * @param  {string} str raw data
 * @return {string}     decorated string
 */
function polish(str) {
    str = unescape(str);
    str = str.replace(/[\r\n]/gi, '<br>').replace(/[\s]/ig, '&nbsp;');
    return str;
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return accAdd(arg, this);
};

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
    return accSub(arg, this);
};

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return accMul(arg, this);
};

/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return accDiv(this, arg);
};

function requestChannel(receiver, content) {
    if (privateChannel) {
        Ext.Ajax.request({
            url: './channel/message.php',
            method: 'POST',
            params: {
                message: content,
                to: 'sae_channel_' + receiver
            },
            callback: function (opts, success, res) {
            }
        });
    }
}

// send message to make a record.
// hint: showTime is only needed when this message acts as a delayed information which is gonna be shown in dynamic reminder bar.
function sendMsg(sender, receiver, content, type, extraId, showTime) {
    var p = {
        action: 'add',
        sender: sender,
        content: content,
        receiver: receiver
    };
    if (type) {
        Ext.apply(p, {
            type: type
        });
    }
    if (extraId) {
        Ext.apply(p, {
            extraId: extraId
        });
    }
    if (showTime) {
        Ext.apply(p, {
            showTime: showTime
        })
    }
    Ext.Ajax.request({
        url: './libs/message.php',
        method: 'POST',
        params: p,
        callback: function (opts, success, res) {
            if (success) {
                var obj = Ext.decode(res.responseText);
                if (obj.status == 'successful') {
                    requestChannel(receiver, content);
                }
                else {
                    showMsg(obj.errMsg);
                }
            }
        }
    });
}

function checkMsg(obj) {
    Ext.Ajax.request({
        url: './libs/msg.php?action=checkmsg',
        method: 'POST',
        params: {
            content: obj.content
        },
        callback: function (opts, success, res) {
            if (success) {
                obj.success(res);
            }
            else {
                obj.failure(res);
            }
        }
    })
}

// time: 20151019124530 yyyyMMddHHmmss
function sendSMS(sender, reciever, recieverPhone, content, rightnow) {
    if (sender && reciever) {
        Ext.Ajax.request({
            url: './libs/user.php?action=getrealname',
            method: 'GET',
            params: {
                name: sender
            },
            callback: function (opts, success, res) {
                if (success) {
                    var obj = Ext.decode(res.responseText);
                    if (obj.status == 'successful') {
                        sender = obj['realname'];
                        Ext.Ajax.request({
                            url: './libs/user.php?action=getrealname',
                            method: 'GET',
                            params: {
                                name: reciever
                            },
                            callback: function (opts, success, res) {
                                obj = Ext.decode(res.responseText);
                                if (obj.status == 'successful') {
                                    reciever = obj['realname'];
                                    if (!recieverPhone) {
                                        setTimeout(function () {
                                            showMsg('发送用户没有手机号，无法发送！');
                                        }, 1000);
                                    }
                                    else {
                                        var p = {
                                            sender: sender,
                                            reciever: reciever,
                                            recieverPhone: recieverPhone,
                                            content: content
                                        };
                                        Ext.apply(p, {
                                            rightnow: rightnow === true ? true : false
                                        });
                                        Ext.Ajax.request({
                                            url: './libs/msg.php?action=sendmsg',
                                            method: 'POST',
                                            params: p,
                                            callback: function (opts, success, res) {
                                                if (success) {
                                                    var obj = Ext.decode(res.responseText);
                                                    if (obj.status == 'successful') {
                                                        setTimeout(function () {
                                                            showMsg('短信发送成功！');
                                                        }, 500);
                                                    }
                                                    else {
                                                        setTimeout(function () {
                                                            showMsg(obj.errMsg);
                                                        }, 500);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                                else {
                                    showMsg(obj.errMsg);
                                }
                            }
                        })
                    }
                    else {
                        showMsg(obj.errMsg);
                    }
                }
            }
        });
    }
    else {
        setTimeout(function () {
            showMsg('短信发送没有发送方或接收方!');
        })
    }
}

function sendExternalMail(mailAddress, subject, content) {
    if (mailAddress && subject && content) {
        var p = {
            recipient: mailAddress,
            subject: subject,
            body: content
        };
        Ext.Ajax.request({
            url: './libs/mail.php?action=send',
            method: 'POST',
            params: p,
            callback: function (opts, success, res) {
                if (success) {
                    var obj = Ext.decode(res.responseText);
                    if (obj.status == 'successful') {
                        setTimeout(function () {
                            showMsg('邮件发送成功！');
                        }, 500);
                    }
                    else {
                        setTimeout(function () {
                            showMsg(obj.errMsg);
                        }, 500);
                    }
                }
            }
        });
    }
    else {
        showMsg('信息不完全，无法发送邮件！');
    }
}

function sendMail(reciever, recieverMail, subject, content) {
    if (reciever) {
        var originalReceiverName = reciever;
        Ext.Ajax.request({
            url: './libs/user.php?action=getrealname',
            method: 'GET',
            params: {
                name: reciever
            },
            callback: function (opts, success, res) {
                obj = Ext.decode(res.responseText);
                if (obj.status == 'successful') {
                    if (!recieverMail) {
                        setTimeout(function () {
                            showMsg('用户' + obj['realname'] + '没有邮箱地址，请通知用户尽快完善信息！');
                        }, 1000);
                    }
                    else {
                        var p = {
                            recipient: reciever,
                            subject: subject,
                            body: content
                        };
                        Ext.Ajax.request({
                            url: './libs/mail.php?action=send',
                            method: 'POST',
                            params: p,
                            callback: function (opts, success, res) {
                                if (success) {
                                    var obj = Ext.decode(res.responseText);
                                    if (obj.status == 'successful') {
                                        setTimeout(function () {
                                            showMsg('邮件发送成功！');
                                        }, 500);
                                        requestChannel(originalReceiverName, content);
                                    }
                                    else {
                                        setTimeout(function () {
                                            showMsg(obj.errMsg);
                                        }, 500);
                                    }
                                }
                            }
                        });
                    }
                }
                else {
                    showMsg(obj.errMsg);
                }
            }
        });
    }
    else {
        setTimeout(function () {
            showMsg('邮件发送没有接收方!');
        })
    }
}

function ga(url) {
    Ext.Ajax.request({
        ga: true,
        silent: true,
        url: './libs/conn.php?action=ga',
        params: {
            userName: User.getName(),
            interfaceName: url
        },
        method: 'POST',
        callback: function (opts, success, res) {

        }
    });
}

function isDebug() {
    var hashTag = location.hash;
    return '#debug' == hashTag;
}

// get how many days in one specific month of a year.
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// check if an array is full of Date or one variable is a Date
function isDate(d) {
    var flag = true;
    if (d.constructor === Array) {
        for (var i = 0; i < d.length; i++) {
            var element = d[i];
            if (element && element.constructor === Date) {
                continue;
            }
            else if (typeof element === 'string') {
                var elementD = Ext.Date.parse(element, 'Y-m-d');
                if (elementD && elementD.constructor === Date) {
                    continue;
                }
                else {
                    flag = false;
                    break;
                }
            }
            else {
                flag = false;
                break;
            }
        }
    }
    else {
        if (d && d.constructor === Date) {
            flag = true;
        }
        else if (typeof d === 'string') {
            var dd = Ext.Date.parse(d, 'Y-m-d');
            if (dd && dd.constructor === Date) {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        else {
            flag = false;
        }
    }
    return flag;
}

// get how many days between two given dates.
function daysBetweenTwoDates(first, second) {
    if (isDate([first, second])) {
        return Math.abs(first - second) / 1000 / 60 / 60 / 24;
    }
    else {
        return false;
    }
}

window.onresize = function () {
    var w = Ext.query('.x-window');
    Ext.each(w, function (item) {
        var win = Ext.getCmp(item.id);

        win.center();
    })
}

String.prototype.format = function () {
    var res = this;
    for (var i = 0; i < arguments.length; i++)
        res = res.replace("%" + (i + 1), arguments[i]);
    return res;
}

function showPic(src, title) {
    if (src) {
        var win = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: title || '',
            width: 400,
            height: 400,
            modal: true,
            autoScroll: true,
            maximizable: true,
            items: [{
                xtype: 'image',
                src: src
            }]
        });
        win.show();
    }
    else {
        showMsg('没有图片!');
    }
}

Ext.require('Ext.form.field.VTypes', function () {
    Ext.apply(Ext.form.field.VTypes, {
        'phone': function () {
            var re = /^[\(\)\.\- ]{0,}[0-9]{3}[\(\)\.\- ]{0,}[0-9]{4}[\(\)\.\- ]{0,}[0-9]{4}[\(\)\.\- ]{0,}$/;
            return function (v) {
                return re.test(v);
            };
        } (),
        'phoneText': '手机号码错误, 例如: 123-456-7890 (破折号可选) 或者 (123) 456-7890',
        'fax': function () {
            var re = /^[\(\)\.\- ]{0,}[0-9]{3}[\(\)\.\- ]{0,}[0-9]{3}[\(\)\.\- ]{0,}[0-9]{4}[\(\)\.\- ]{0,}$/;
            return function (v) {
                return re.test(v);
            };
        } (),
        'faxText': 'The fax format is wrong',
        'zipCode': function () {
            var re = /^\d{5}(-\d{4})?$/;
            return function (v) {
                return re.test(v);
            };
        } (),
        'zipCodeText': 'The zip code format is wrong, e.g., 94105-0011 or 94105',
        'ssn': function () {
            var re = /^\d{3}-\d{2}-\d{4}$/;
            return function (v) {
                return re.test(v);
            };
        } (),
        'ssnText': 'The SSN format is wrong, e.g., 123-45-6789',
        'mail': function () {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return function (v) {
                return re.test(v);
            }
        } (),
        'mailText': '邮箱格式错误，请重新输入'
    });
});

Ext.define('FamilyDecoration.Common', {});