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
console.log('invoked')
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



var cache = {}; // Hash table, uid as key, corresponding profile object as value.
var last = {
    timer: -1,
    data: [],
    promises: {}
};
var getUserProfile = function (uid) {
    // If already cached, return a promise with cached data immediately.
    if (cache.hasOwnProperty(uid)) {
        if (cache[uid] instanceof Promise) {
            return cache[uid];
        } else {
            return new Promise(function (resolve) {
                resolve(cache[uid]);
            });
        }
    } else {
        var _resolve,
            _reject;
        var promise = new Promise(function (resolve, reject) {
            /**
             * Combine request's user Id.
             * Requests with 100ms to the other,
             * then we clean the previous timeout,
             * start a new timer to prepare the next ajax request
             * with combined user ids.
             */
            clearTimeout(last.timer);
            _resolve = resolve;
            _reject = reject;
            last.data.push(uid);
            last.timer = window.setTimeout(function () {
                cache[uid] = requestUserProfile(last.data)
                    .then(function (profileList) {
                        for (var i = 0; i < profileList.length; i++) {
                            var profile = profileList[i],
                                userId = profile.uid;
                            cache[userId] = profile;

                            if (last.promises[userId]) {
                                last.promises[userId]._resolve(profile);
                                delete last.promises[userId];
                            }

                        }
                    })
                    .catch(function (reason) {
                        for (var pro in last.promises) {
                            last.promises[pro]._reject(reason);
                        }
                        last.promises = {};
                        last.data = [];
                    });
                last.data = [];

            }, 100);
        });
        promise._resolve = _resolve;
        promise._reject = _reject;
        last.promises[uid] = promise;
        return promise;
    }
}

getUserProfile(1).then(profile => console.log(profile));
setTimeout(function () {
    getUserProfile(2).then(profile => console.log(profile));
}, 90);
setTimeout(function () {
    getUserProfile(3).then(profile => console.log(profile));
}, 120);

setTimeout(function () {
    getUserProfile(4).then(profile => console.log(profile));
}, 240);

setTimeout(function (){
    getUserProfile(2).then(profile => {
        console.log(profile)
    });
}, 3000);