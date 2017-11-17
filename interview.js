//现在有一个 Ajax 接口，根据用户 uid 获取用户 profile 信息，是一个批量接口。我把这个 ajax 请求封装成以下的异步函数
var requestUserProfile = function (uidList) {  // uidList 是一个数组，最大接受 100 个 uid
    // 这个方法的实现不能修改

    /** 先去重 */
    var uidList = uidList || [];
    var _tmp = {};
    var _uidList = [];
    uidList.forEach(function (uid) {
        if (!_tmp[uid]) {
            _tmp[uid] = 1;
            _uidList.push(uid);
        }
    })
    _tmp = null;
    uidList = null;

    return Promise.resolve().then(function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () { // 模拟 ajax 异步，1s 返回
                resolve();
            }, 1000);
        }).then(function () {
            var profileList = _uidList.map(function (uid) {
                if (uid < 0) {  // 模拟 uid 传错，服务端异常，获取不到部分 uid 对应的 profile 等异常场景
                    return null;
                } else {
                    return {
                        uid: uid,
                        nick: uid + 'Nick',
                        age: 18
                    }
                }
            });
            return profileList.filter(function (profile) {
                return profile !== null;
            });
        });
    });
}

/**
 * Implementation Core:
 * We push upcoming requests consisting of user id into buffer zone,
 * and wait until execution is waking up from its 1000 ms pause.
 * In the global object, we simply define status for requesting process.
 * When status is equivalent to 'pending', we will immediately trigger requesting
 * after aforementioned pause is finished.
 * Yet, when status comes to 'requesting', we just return promise property attached
 * to global Object `reqCluster`, and do the following execution when data successfully
 * returned from server side.
 * 
 * Of course, we have to make sure context of execution is symmetrically set correctly.
 * Which means status has to be restored once request is finished, so does `pendingReqs`.
 * @param {*User Id} uid 
 */

var cache = {};
var last = {
    timer: -1,
    data:[],
    promises: {}
};
var getUserProfile = function (uid) {
    if(cache.hasOwnProperty(uid)){
        if(cache[uid] instanceof Promise){
            return cache[uid];
        }else{
            return new Promise(function(resolve){
                resolve(cache[uid]);
            });
        }
        
    }else{
        var promise = new Promise(function(resolve, reject){
            window.setTimeout(function(){
                promise.resolve = resolve;
                promise.reject = reject;
            });
            window.clearTimeout(last.timer);
            last.data.push(uid);
            last.timer = window.setTimeout(function(){
                cache[uid] = new Promise(function(rs, rj){
                    requestUserProfile(last.data).then(function(rlist){
                        
                        for(var i=0; i<rlist.length; i++){
                            cache[rlist[i].uid] = rlist[i];
                            
                            if(last.promises[rlist[i].uid]){
                                last.promises[rlist[i].uid].resolve(rlist[i]);
                                delete last.promises[rlist[i].uid];
                            }
                            
                        }
                    })
                    .catch(function (reason){
                        for (var pro in last.promises) {
                            last.promises[pro].reject();
                        }
                        last.promises = {};
                        last.data = [];
                    });
                    last.data = [];
                });
            }, 100);
        });
        last.promises[uid] = promise;
        return last.promises[uid];
    }
}

getUserProfile(1).then(function (profile){console.log(profile)});
setTimeout(function (){
    getUserProfile(2).then(function (profile){console.log(profile)});
}, 90);
setTimeout(function (){
    getUserProfile(3).then(function (profile){console.log(profile)});
}, 120);

setTimeout(function (){
    getUserProfile(4).then(function (profile){console.log(profile)});
}, 240);
