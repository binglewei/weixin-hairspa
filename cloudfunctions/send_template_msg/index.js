// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const rp = require('request-promise');
const wxContext = cloud.getWXContext();
// const openid = wxContext
// 云函数入口函数
exports.main = async(event, context) => {
  console.log(" console.log(event)==inin=1111=", event)
  var access_token = event.access_token;
  var template_id = event.template_id;
  var msgData = event.msgData;
  var openid = event.openid;
  // var form_id = event.form_id;
  var form_ids = event.form_ids;
  var page = event.page;
  var employee_openid = event.employee_openid;
  const wxContext = cloud.getWXContext()
  console.log("wxContext=11111=", wxContext);
  // console.log(" console.log(employee_openid)==222==", employee_openid, typeof (employee_openid));
  // console.log(" console.log(access_token)==222==", access_token);
  // console.log(" console.log(template_id)==222==", template_id);
  // console.log(" console.log(msgData)==222==", msgData);
  // console.log(" console.log(openid)==222==", openid);
  // console.log(" console.log(form_id)==222==", form_id);
  // console.log(" console.log(page)==222==", page);
  if (employee_openid) {
    // console.log(" console.log(page)==222==", page);
    res2 = await rp({
      json: true,
      method: 'POST',
      uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
      body: {
        touser: employee_openid,
        template_id: template_id,
        page: page,
        form_id: form_ids[0],
        data: msgData
      }
    })
    console.log(" console.log(res2222222)=222==res2=", res2);
  };
  res = await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
    body: {
      touser: openid,
      template_id: template_id,
      page: page,
      form_id: form_ids[1],
      data: msgData
    }
  })

  console.log(" console.log(res)=111===", res);

  return {
    res,
    event
  };
}