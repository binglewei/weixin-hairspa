// 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

const cloud = require('wx-server-sdk');

cloud.init();

// const wxContext = cloud.getWXContext();

const rq = require('request-promise');

const APPID = "wxc6c41875b492a9c0"; ///wxContext.APPID//wx1da5d27c85ff4a6b
const APPSECRET = 'f0a2ad687da6ac12bbc69fd64ca61725';

exports.main = async(event, context) => {

  let res = await rq({
    method: 'GET',
    uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
  });
  res = JSON.parse(res);
  // console.error("/api.weixin.qq.com/cgi-bin/token===res=", res);
  var access_token = res.access_token;
  // 10位当前时间
  var now_timestamp = Math.round(new Date().getTime() / 1000);
  var expires_time = res.expires_in + now_timestamp;
  // console.log("/now_timestamp===", res,now_timestamp);
  const db = cloud.database();
  var publicField = db.collection("publicField");
  var res_update = await publicField.where({
      type: 1,
    }).update({
      data: {
        // 表示将 done 字段置为 true
        access_token: access_token,
        expires_time: expires_time,
        update_date: new Date()
      }
    })
    .then(console.log)
    .catch(console.error);
  // res_update = JSON.parse(res_update);
  console.log("res=33333==", res);
  res["res_update"] = res_update;
  return res;
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   access_token: access_token,
  // }

}