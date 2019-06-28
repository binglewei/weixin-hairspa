// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 云函数入口函数
exports.main = async(event, context) => {
  var now_timestamp = Math.round(new Date().getTime() / 1000);
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond = date.getMilliseconds()
  var date_str = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  const db = cloud.database();
  const reservation_list_data = db.collection('reservation_list');
  var reservation_list_datas = await reservation_list_data.where({
    // _openid: app.globalData.openid
    reservation_status: 1,
  }).orderBy('out_trade_no', 'desc').get({
    success: function(res) {
      var data = res.data;
      console.log('==1111=', res, data)
    },
  });
  var reservation_datas = reservation_list_datas.data;
  for (var aa in reservation_datas) {

    var reservation_time = reservation_datas[aa].reservation_time;
    var new_str = reservation_time.replace(/:/g, "-");
    new_str = new_str.replace(/ /g, "-");
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4]));
    var reservation_timestamp = datum.getTime() / 1000;
    var out_trade_no = reservation_datas[aa].out_trade_no;
    console.log('==aaaaaaaaaa=', out_trade_no, reservation_time, now_timestamp,reservation_timestamp, date_str);

    if (reservation_timestamp < now_timestamp) {
      await reservation_list_data.where({
        out_trade_no: out_trade_no,
      }).update({
        data: {
          reservation_status: 3,
          reservation_describe: "已经过期",
          update_time: date_str
        },
        }).then(console.log)
        .catch(console.error);
    }
  }

  //   success: function(res) {
  //     var data=res.data;
  //     aaa;
  //     console.log('==1111=', res, data)
  //   },
  //   fail: function (res) {
  //     console.error('==2222=', err)
  //   }
  // });
  //where({
  // _openid: app.globalData.openid
  // reservation_status: 1,
  // }).
  //orderBy('out_trade_no', 'desc').

}