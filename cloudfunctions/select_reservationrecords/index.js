// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var wxContext = cloud.getWXContext()
  select_data = {};
  select_data.reservation_status = event.reservation_status;
  // select_data._openid = wxContext.OPENID;
  if (!event.from_page) {
    select_data._openid = wxContext.OPENID;
  }
  console.log("select_data=cloudcloud=11=1==", select_data);
  var db = cloud.database();
  var reservation_list = db.collection('reservation_list');
  var res_select = await reservation_list.where(
    select_data
  ).orderBy('out_trade_no', 'desc',"reservation_status").get({
    success: function (res) {
      // console.log("res.data========", res.data)
    }
  })
  var data = res_select.data
  console.log('[数据库] [查询记录]结果222==：', res_select, data)
  return data;



  
}