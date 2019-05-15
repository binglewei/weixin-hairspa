// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var now_timestamp = Math.round(new Date().getTime() / 1000);
  const db = cloud.database();
  const reservation_list_data = db.collection('reservation_list');

  reservation_list_data.where({
    // userName: _.eq(userName),
    reservation_time: _.lt(now_timestamp),
    // progress: _.lt(50)
  }).update({
    data: {
      reservation_status: 3,
      reservation_describe: "已经过期",
      update_time: util.format_date_5(new Date())
    },
    success: res => {
      console.log('[数据库] [更新记录] 成功：', res);
    },
    fail: err => {

      console.error('[数据库] [更新记录] 失败：', err);

    }

  })
}