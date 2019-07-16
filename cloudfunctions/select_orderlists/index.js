// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var wxContext = cloud.getWXContext()
  var select_data = {};
  var from_page = event.from_page;
  // if (event.expense){
  select_data.expense = event.expense;
  select_data.status = event.status;
  // }
  if (!from_page) {
    select_data._openid = wxContext.OPENID;
  }
  // console.log("select_data=cloudcloud=11=1==", select_data);
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
  if (from_page) {
    var orders_list_new = [];
    // console.log('[数据库] [查询记录]结果=1111111111111=：', res_select, data);
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
      if (address_info) {
        // console.log('[数据库] [查询记录]结果=user_info=11111111111=：', address_info, address_info_data);

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
      } else {
        user_magess = "用户信息是空的！"
      }
      data_cha.user_magess = user_magess;
      orders_list_new.push(data_cha);

      // console.log('[数据库] [查询记录]结果=user_info=：', name, nickName, remark);
    }
    console.log('[数据库] [查询记录]结果=orders_list_new===：', orders_list_new);
    return orders_list_new;
  } else {
    return data
  }




  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}