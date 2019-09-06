// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  // console.log("event==============11111=", event);
  var table_name = event.table_name;
 
  var id = event.id;
  var update_data = event.update_data;
  // console.log("event==============222222=", table_name, id, update_data);
  const db = cloud.database();
  const reservation_list_data = db.collection(table_name);
  var res_update = await reservation_list_data.doc(id).update({
    data: update_data,
    })
  console.log("res_update==============33333=", res_update);
  return res_update
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}