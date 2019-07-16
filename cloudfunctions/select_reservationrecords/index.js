// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var wxContext = cloud.getWXContext()
  var from_page = event.from_page;
  var select_data = {};
  select_data.reservation_status = event.reservation_status;
  // select_data._openid = wxContext.OPENID;
  if (from_page) {
    delete select_data._openid
  }
  console.log("select_data=cloudcloud=11=1==", select_data);
  var db = cloud.database();
  var reservation_list = db.collection('reservation_list');
  var res_select = await reservation_list.where(
    select_data
  ).orderBy('out_trade_no', 'desc', "reservation_status").get({
    success: function(res) {
      // console.log("res.data========", res.data)
    }
  })
  var data = res_select.data;
  var reservation_list = [];
  // console.log('[数据库] [查询记录]结果=1111111111111=：', res_select, data);
  if (from_page) {
    for (var ii in data) {
      data_cha = data[ii];
      _openid = data_cha["_openid"];
      // console.log('[数据库] _openid=====：', _openid);
      var db = cloud.database();
      const address_list_data = db.collection('address_list');
      var address_info_data = await address_list_data.where({
        _openid: _openid
      }).get({
        success: function(res) {
          // console.log("res.data====2222222222222222====", res.data)
        }
      });
      var address_info = address_info_data.data[0]
      var user_magess = "";
      // console.log('[数据库] [查询记录]结果=user_info=11111111111=：', address_info, address_info_data);
      if (address_info){
      var name = address_info.name;
      var remark = address_info.remark; //data
      var userInfo = address_info.userInfo; //nickName
      if (remark) {
        user_magess = user_magess + remark
      }
      if (name) {
        user_magess = user_magess + "-" + name
      }
      if (userInfo) {
        user_magess = user_magess + "-" + userInfo.nickName
      }
      }
      data_cha.user_magess = user_magess;
      reservation_list.push(data_cha);

      // console.log('[数据库] [查询记录]结果=user_info=：', name, nickName, remark);
    }
  }else{
    reservation_list=data 
  }
  return reservation_list;




}