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
  var form_id = event.form_id;
  var page = event.page;
  // console.log(" console.log(access_token)==222==", access_token);
  // console.log(" console.log(template_id)==222==", template_id);
  // console.log(" console.log(msgData)==222==", msgData);
  // console.log(" console.log(openid)==222==", openid);
  // console.log(" console.log(form_id)==222==", form_id);
  // console.log(" console.log(page)==222==", page);
  
  res=await rp({
      json: true,
      method: 'POST',
      uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
      body: {
        touser: openid,
        template_id: template_id,
        page: page,
        form_id: form_id,
        data: msgData
      }
    })
  
  console.log(" console.log(res)=22222===");
  console.log(" console.log(res)=33333333333===", res);
  return { res,event};
}