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
var getUserProfile = function (uid) {
    // This global accessed object is just for simulating.
    var reqCluster = window.reqCluster || {
        pendingReqs: [], // Due to requesting status, we have to push requests newly arrived into this array for next round of bulk requesting.
        requestingThreads: [], // Threads currently sending to backend to retrieve data; This array will be emptied once response's been sent from server.
        status: 'pending', // Indicator of requesting status: pending, requesting.
        promise: null // Attach invoked promise reference to reqCluster object for requests comes while requesting is ongoing.
    },
    promise;

    !window.reqCluster && (window.reqCluster = reqCluster);

    // Push newly arrived request into pending array.
    reqCluster.pendingReqs.push(uid);

    return new Promise(function (resolve, reject){
        setTimeout(function (){
            if (reqCluster.status === 'pending') {
                // Clone pending requests elements into requesting threads.
                // We can't directly copy array, coz this is a reference value,
                // all modifications on top of array will be bilaterally reflected 
                // to the other.
                reqCluster.requestingThreads = reqCluster.pendingReqs.slice(0);
                // Empty pending array.
                reqCluster.pendingReqs = [];
                // Mark status as 'requesting'
                reqCluster.status = 'requesting';
        
                // Requesting.
                promise = requestUserProfile(reqCluster.requestingThreads);
                reqCluster.promise = promise;
        
                promise.then(function (profileList){
    
                    reqCluster.status = 'pending';
    
                    var profileArr = profileList.filter(function (profile){
                        return profile.uid === uid;
                    });
                    resolve(profileArr[0]);
    
                    return profileList;
                });
            }
            else if (reqCluster.status === 'requesting') {
                reqCluster.promise.then(function (profileList){
                    resolve(profileList.filter(function (profile){;
                        return profile.uid === uid;
                    })[0]);
    
                    return profileList;
                });
            }
        }, 1000);
    });
}

getUserProfile(1).then(function (profile){console.log(profile)});
getUserProfile(2).then(function (profile){console.log(profile)});
getUserProfile(3).then(function (profile){console.log(profile)});