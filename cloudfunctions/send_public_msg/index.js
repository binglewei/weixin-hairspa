// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const rp = require('request-promise');
const wxContext = cloud.getWXContext();
var appid = "wxc6c41875b492a9c0";
// const openid = wxContext
// 云函数入口函数
exports.main = async(event, context) => {
  console.log(" event)==inin=111111111=", event)
  var employe_template_id = event.employe_template_id;
  var employe_msgData = event.employe_msgData;
  var employee_openid = event.employee_openid;
  var user_template_id = event.user_template_id;
  var user_msgData = event.user_msgData;
  var user_openid = event.openid;
  var pagepath = event.page;
  var miniprogram = {};
  miniprogram.appid = appid;
  miniprogram.pagepath = pagepath;
  const db = cloud.database();
  var publicField = db.collection("publicField");
  var res_get = await publicField.where({
    type: 0
  }).get()
  var access_token = res_get.data[0].access_token;
  // console.log("access_token==========11===12121212====", access_token);

  if (user_openid) {
    var call_data = {};
    call_data.openid = user_openid;
    var res_call = await cloud.callFunction({
      // 要调用的云函数名称
      name: 'get_userunionid',
      data: call_data
    });
    var user_openid_public = res_call.result.public_openid
    // console.log("res_call=====result===222222222222====", employee_openid_public, res_call);
    var res_user = await rp({
      json: true,
      method: 'POST',
      uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + access_token,
      body: {
        touser: user_openid_public,
        template_id: user_template_id,
        miniprogram: miniprogram,
        data: user_msgData
      }
    })
    var res_user_errmsg = res_user.errmsg;
    var errmsg_index = res_user_errmsg.indexOf("access_token")
    if (errmsg_index >= 0) {
      var public_AccessToken_update = await cloud.callFunction({
        // 要调用的云函数名称
        name: 'public_AccessToken',
        data: call_data
      });
      console.log(" public_AccessToken_update=====999999=====", public_AccessToken_update);
      access_token = public_AccessToken_update.result.access_token;
    }
    // 
    res_user.user_openid_public = user_openid_public;
    res_user.user_openid = user_openid;
    var res_user_errcode = res_user.errcode;
    console.log(" res_user33333333==res3333333333=", res_user_errcode,res_user);
    if (res_user_errcode){
      employe_msgData.remark.value = "请及时联系客户，用户可能还没有关注微信公众号哦，请提示用户先关注公众号“丝美域”，接收推送服务！！"
      console.log("employe_msgData.remark.value====888888======", employe_msgData);
    }
    if (employee_openid) {
      var call_data = {};
      call_data.openid = employee_openid;
      var res_call = await cloud.callFunction({
        // 要调用的云函数名称
        name: 'get_userunionid',
        data: call_data
      });
      var employee_openid_public = res_call.result.public_openid
      console.log("res_call=====result==1111111111111=====", employee_openid_public, res_call);
      var res_employee = await rp({
        json: true,
        method: 'POST',
        uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + access_token,
        body: {
          touser: employee_openid_public,
          template_id: employe_template_id,
          miniprogram: miniprogram,
          data: employe_msgData
        }

      })
  }
  
    // var res_employee_errmsg = res_employee.errmsg;
    // var res_employee_errmsg_index = res_employee_errmsg.indexOf("expired")
    // if (res_employee_errmsg_index >= 0) {
    //   var public_AccessToken_update222 = await cloud.callFunction({
    //     // 要调用的云函数名称
    //     name: 'public_AccessToken',
    //     data: call_data
    //   });
    //   console.log(" public_AccessToken_update222=====000000000000=====", public_AccessToken_update222);
    // }
    res_employee.employee_openid_public = employee_openid_public;
    res_employee.employee_openid = employee_openid;
    console.log("res_employee222=222==res2=", res_employee);
  }
  var res = {}
  res.res_employee = res_employee;
  res.res_user = res_user;
  console.log(" res============444444444444=======", res);
  return res
}