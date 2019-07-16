// 云函数入口文件
const cloud = require('wx-server-sdk');
const rq = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database();
  var publicField = db.collection("publicField");
  var res_get = await publicField.where({
    type: 0
  }).get()
  // .then(console.log)
  // .catch(console.error);
  var access_token = res_get.data[0].access_token;
  var subscribe_total = res_get.data[0].subscribe_total;
  var res_get_id = res_get.data[0]["_id"];
  console.log("access_token==========11=======", access_token, subscribe_total, res_get);
 
  var res = await rq({
    method: 'GET',
    uri: "https://api.weixin.qq.com/cgi-bin/user/get?access_token=" + access_token
  });
  res = JSON.parse(res);

  var total = Number(res.count);
  var openids = res.data.openid;
  // console.log("/user/get====2222===", total, subscribe_total,openids);
  if (subscribe_total != total) {
    var data_publicField = {};
    data_publicField.subscribe_total = total;
    var res_update_subscribe = await publicField.doc(res_get_id).update({
      // data 字段表示需新增的 JSON 数据
      data: data_publicField
    })
    // .then(res => {
    //   console.log("DATASET==res==update=sus==", res, value)
    // }).catch(err => {
    //   // console.error("DATASET==res==value===", err, value)
    // })
    // console.log("subscribe_total != total==========222222=======", res_get_id, data_publicField,res_update_subscribe,subscribe_total , total);
    //https://api.weixin.qq.com/cgi-bin/user/info?openid=oktME1aVYc8LBebytkMFw6Fz9Ze8&access_token=&lang=zh_CN
    for (var i in openids) {
      var openid = openids[i]
      const db = cloud.database();
      var public_userinfo_data = db.collection("public_userinfo");
      var res_user = await public_userinfo_data.where({
        openid: openid
      }).get()
      var len_user = res_user.data.length
      console.log("openid===res_update_subscribe=3333333==111=", i, openid, len_user, res_user);
      if (len_user == 0) {
        var res_openid = await rq({
          method: 'GET',
          uri: "https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&access_token=" + access_token + "&openid=" + openid
        });
        res_openid = JSON.parse(res_openid);
        // var res_user_add = await public_userinfo_data.add(res_openid);
        // console.log('[数据库] add: ', res_openid);

        var res_user_add = await public_userinfo_data.add({
          // data 字段表示需新增的 JSON 数据
          data: res_openid

        }).then(res => {
          // console.log("DATASET==res==value===", res, res_openid)
        }).catch(err => {
          // console.error("DATASET==res==value===", err, res_openid)
        })
        // console.log("res_openid====3333333==222=", openid, res_openid);
      }
    }
  }
 


  // 
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}