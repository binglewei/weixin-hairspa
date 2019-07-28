// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event==111111111111==", event)
  var shop = event.shop;
  // if (shop){

  // }
  var db = cloud.database();
  const timeArr_data = db.collection('timeArr');
  var timeArr_list_data = await timeArr_data.get({
    success: function (res) {
      console.log("res.data====2222222222222222====", res.data)
    }
  });
  var timeArr_list_datas = timeArr_list_data.data
  console.log("user_Info=1111111111==", timeArr_list_datas)
  return timeArr_list_datas
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}