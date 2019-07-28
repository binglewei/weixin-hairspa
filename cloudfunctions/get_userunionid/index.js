// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
 
  var return_res = {}
  var app_openid = event.openid;
  // var app_openid = "oMmrX5ZcN2TdVn4Dq3a5KZx41hRQ";
  // var app_openid = "oMmrX5WmrqvJgqR7yQQh5AZYoJtU";
  if (app_openid) {
    app_openid = app_openid;
  } else {
    app_openid = "" //找不到app_openid时；
  }
  var db = cloud.database();
  var address_list_data = db.collection("address_list");
  var res_get = await address_list_data.where({
    _openid: app_openid
  }).get()
  console.log("address_list_data===111==", res_get);
  var res_data = res_get.data
  if (res_data.length){
  var unionid = res_data[0].unionid;
  console.log("address_list_data====22222========", unionid, res_get);
  if (unionid) {
    unionid = unionid;
  } else {
    unionid = "" //找不到unionid时；
    // const wxContext = cloud.getWXContext()
    // var openid = wxContext.OPENID;
    // console.log("wxContext====wxContex=5252222=", openid, app_openid, wxContext);
    // if (openid == app_openid){
    //   var unionid = wxContext.UNIONID;
    //   var value={};
    //   value.unionid = unionid;
    //   var id = res_data[0]["_id"];
    //   console.log("wxContext===6666666666666=", unionid, id, value);
    //   if (unionid) {
    //      var res_update =await address_list_data.doc(id).update({
    //     data: value
    //   })
    //   console.log("res_update==555555===", res_update);

    //   }
     
    // }
    // return {
    //   event,
    //   openId: wxContext.OPENID,
    //   appId: wxContext.APPID,
    //   unionid: wxContext.UNIONID,
    // }
  } 
  return_res.unionid = unionid;
  var public_userinfo_data = db.collection("public_userinfo");
  var res_public = await public_userinfo_data.where({
    unionid: unionid
  }).get()
    var res_public_data = res_public.data;
    if (res_public_data.length){
      var public_openid = res_public_data[0].openid; //data[""0""].openid
    }else{
      var public_openid="";
    }
  console.log("public_userinfo_data==3333====", public_openid, res_public);
  return_res.public_openid = public_openid;
  }else{
    return_res.unionid = "";
  }
  return return_res
}