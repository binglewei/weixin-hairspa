function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var id = event.id;
  const db = cloud.database();
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond = date.getMilliseconds()
  var expense_time = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  const orders_list = db.collection('orders_list');
  console.log("event==1111111111111111111===", id, event, expense_time);
  orders_list.doc(id).update({
    data: {
      expense: 0,
      expense_describe: "已消费(门店确认)",
      expense_time: expense_time //util.format_date_5(new Date())
    },
    success: res => {
      console.log('[数据库] [更新记录] 成功===：', res);
      return res;
    },
    fail: err => {
      // icon: 'none',
      
      console.error('[数据库] [更新记录]==== 失败：', err);
      return err;

    }

  })
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}