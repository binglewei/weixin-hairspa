// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const rp = require('request-promise');
const wxContext = cloud.getWXContext();
// const openid = wxContext
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(" console.log(event)==inin=1111=", event)
  // var access_token = event.access_token;
  var template_id = event.template_id;
  var msgData = event.msgData;
  var openid = event.openid;
  // var form_id = event.form_id;
  // var form_ids = event.form_ids;
  var page = event.page;
  var employee_openid = event.employee_openid;
  const wxContext = cloud.getWXContext()
  console.log("wxContext=11111=", wxContext);
  res = await rp({
    json: true,
    method: 'POST',
    // https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN
    uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
    // body: {
    //   // touser: openid,
    //   // template_id: template_id,
    //   // page: page,
    //   // form_id: form_ids[1],
    //   // data: msgData
    // }
    body: {
      "touser": openid,
      "template_id": template_id,
      // "url": "http://weixin.qq.com/download",
      "miniprogram": {
        "appid": "xiaochengxuappid12345",
        "pagepath": "index?foo=bar"
      },
      "data": msgData
    }
  })

  console.log(" console.log(res)=111===", res);

  return {
    res,
    event
  };
}