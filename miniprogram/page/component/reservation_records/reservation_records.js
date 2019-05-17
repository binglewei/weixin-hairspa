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
    // 云数据库初始化
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6"
    });
    const reservation_list_data = db.collection('reservation_list');
    reservation_list_data.where({
      // _openid: app.globalData.openid
    }).orderBy('out_trade_no', 'desc').get({
      success: res => {
        var data=res.data;
        if (data.length>0){
          this.setData({
            reservation_list: data,
            hasList: true 
          })
        }else{
          this.setData({
            // reservation_list: data,
            hasList: false
          })
        }
        
        // console.log('[数据库] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });
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

  }
})