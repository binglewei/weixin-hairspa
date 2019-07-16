// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event==111111111111==", event)
  var shop=event.shop;
  // if (shop){

  // }
  var db = cloud.database();
  const address_list_data = db.collection('address_list');
  var address_info_data = await address_list_data.where({
    // _openid: _openid
    shop: shop
  }).get({
    success: function (res) {
      // console.log("res.data====2222222222222222====", res.data)
    }
  });
  var user_Info = address_info_data.data
  console.log("user_Info=1111111111==", user_Info)
  return user_Info
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}