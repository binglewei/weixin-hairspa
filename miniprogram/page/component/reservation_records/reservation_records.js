// miniprogram/page/component/consumption_records.js
var app = getApp();
var md5_2 = require('../../../libs/utils/md5_2.js');
var util = require('../../../libs/utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservation_list: [],
    hasList: true          // 列表是否有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var from_page = options.from_page;
    // var
    this.setData({
      from_page: from_page,
      shop_name: options.shop_name
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.bindTap();
    // // 云数据库初始化
    // const db = wx.cloud.database({
    //   env: "wxc6c41875b492a9c0-1c74f6"
    // });
    // const reservation_list_data = db.collection('reservation_list');
    // reservation_list_data.where({
    //   // _openid: app.globalData.openid
    // }).orderBy('out_trade_no', 'desc').get({
    //   success: res => {
    //     var data=res.data;
    //     if (data.length>0){
    //       this.setData({
    //         reservation_list: data,
    //         hasList: true 
    //       })
    //     }else{
    //       this.setData({
    //         // reservation_list: data,
    //         hasList: false
    //       })
    //     }
        
    //     // console.log('[数据库] [查询记录] 成功: ', res.data)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     // console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // });
  },
  //  发起取消请求
  cancel_reservation(e) {
    var self = this;
    var id = e.target.dataset.id;
    wx.showModal({
      title: '取消预约提示',
      content: '您确定要取消预约服务吗？？？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定--取消')
          const db = wx.cloud.database({
            env: "wxc6c41875b492a9c0-1c74f6"
          });
          const reservation_list_data = db.collection('reservation_list');
          // console.log("e=e.target.dataset.id=11111111=", id);

          reservation_list_data.doc(id).update({
            data: {
              reservation_status: 0,
              reservation_describe: "已取消预约",
              // ddxz:22,
              update_time: util.format_date_5(new Date())
              // out_trade_no: 66666666666666
            },
            success: res => {
              // console.log('[数据库] [更新记录] 成功：', res);
              wx.showToast({
                title: '取消预约成功!',
                icon: 'success',
                duration: 2000
              })
              getCurrentPages()[getCurrentPages().length - 1].onShow()
              // this.setData({
              //   count: newCount
              // })
            },
            fail: err => {
              icon: 'none',
                // console.error('[数据库] [更新记录] 失败：', err);
                getCurrentPages()[getCurrentPages().length - 1].onShow()

            }

          })
        } else if (res.cancel) {
          console.log('用户点击取消---取消')
        }
      }
    })
    
  },
 

 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindTap(e) {
    
    var from_page = this.data.from_page;
    if (from_page) {
      var select_data = {
        from_page: from_page,
        shop_name: this.data.shop_name
        // _openid: this.data.openid
      }
    } else {
      var select_data = {
        // _openid: this.data.openid
      }
    }
    if (e) {
      var index = parseInt(e.currentTarget.dataset.index);
    } else {
      var index = 0;
    }
    // const index = parseInt(e.currentTarget.dataset.index);
    // var bindTap_expense = 0;
    var bindTap_reservation_status = 1
    if (index == 0) {
      bindTap_reservation_status = 1;
      // bindTap_status = 0;
      // bindTap_expense_describe = "未消费";
      // select_data.expense = bindTap_expense;
      select_data.reservation_status = bindTap_reservation_status;

    } 
    // else if (index == 1) {
      // bindTap_expense = 0;
      // bindTap_status = 1;
      // select_data.expense = bindTap_expense;
      // select_data.status = bindTap_status;
    // };
    console.log('index, bindTap_reservation_status, select_data, select_data.length====', index, bindTap_reservation_status, select_data)
    // 云数据库初始化
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_reservationrecords',
      // name:"test"
      data: select_data
    }).then(res => {
      // console.log("data=wx.cloud.callFunction--=",res)
      var data = res.result;
      if (data.length > 0) {
        var len_name = "list_len_" + index;
        var list_lens = {};
        list_lens[len_name] = "："+String(data.length)+"条";
        // console.log(" list_lens =",list_lens );
        this.setData({
          reservation_list: data,
          list_lens: list_lens,
          curIndex: index,
          hasList: true,          // 列表是否有数据
        });
        for (var li in data){
          var _openid = data[li]["_openid"]
          console.log(" _openid =", li, _openid);

        }
      } else {
        this.setData({
          // reservation_list: data,
          curIndex: index,
          hasList: false
        })
      }
    }).catch(err => {
      // handle error
      console.error("data=wx.cloud.callFunction--=", err)
    })
    // this.setData({
    //   expense: bindTap_expense,
    //   status: bindTap_status,
    //   curIndex: index

    // })
  }
})