// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var wxContext = cloud.getWXContext()
  var select_data = {};
  // if (event.expense){
  select_data.expense = event.expense;
  select_data.status = event.status;
  // }
  if (!event.from_page) {
    select_data._openid = wxContext.OPENID;
  }
  console.log("select_data=cloudcloud=11=1==", select_data);
  var db = cloud.database();
  var orders_list = db.collection('orders_list');
  var res_select = await orders_list.where(
    select_data
  ).orderBy('out_trade_no', 'desc').get({
    success: function(res) {
      // console.log("res.data========", res.data)
    }
  })

  // var res_select = orders_list.where(
  //   // select_data
  // ).orderBy('out_trade_no', 'desc').get({
  //   complete: res => {
  //     console.log('[数据库] [查询记录] 结果111===', res)
  //     var data = res.data;
  //     // return data;
  //   }
  // });

  var data = res_select.data
  // console.log('[数据库] [查询记录]结果222==：', res_select, data)
  return data;



  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}