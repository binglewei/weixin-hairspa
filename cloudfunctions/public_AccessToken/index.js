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

const wxContext = cloud.getWXContext();
const db = cloud.database();
const rq = require('request-promise');

const APPID = "wx1da5d27c85ff4a6b";///微信公众号的信息
const APPSECRET = '27668406ce316c1d5727b645bd875b45';//20190514
// const COLLNAME = 'publicField';
// const FIELDNAME = 'ACCESS_TOKEN'

exports.main = async (event, context) => {

  let res = await rq({
    method: 'GET',
    uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
  });
  res = JSON.parse(res);
  // console.error("/api.weixin.qq.com/cgi-bin/token===res=", res);
  var access_token = res.access_token;
  // 10位当前时间
  var now_timestamp = Math.round(new Date().getTime() / 1000);
  var expires_in = res.expires_in + now_timestamp;
  // console.log("/now_timestamp===", res,now_timestamp);
  var publicField = db.collection("publicField")
  var res_update = publicField.where(
    {
      type: 0
    }
  ).update({
    data: {
      // 表示将 done 字段置为 true
      access_token: access_token,
      expires_in: expires_in,
      update_date: new Date(),
    }
  })
    .then(console.log)
    .catch(console.error)
  console.log("res=33333==", res);
  // res.res_update = JSON.parse(res_update);
  return res;
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   access_token: access_token,
  // }

}