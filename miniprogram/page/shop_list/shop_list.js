// miniprogram/page/shop_list/shop_list.js

// var aa=123;
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;
// // 实例化API核心类
// var demo = new QQMapWX({
//   key: 'RFHBZ-V56CU-25RVN-4QV2L-ZONZO-KVBWO' // 必填RFHBZ-V56CU-25RVN-4QV2L-ZONZO-KVBWO
// });
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_list:[
      {
        id:1,
        shop_name: '广州市-海珠区-丝域翠城花园店',
        shop_phone: '020-89667567',
        shop_business_time: '10：30-22：30',
        shop_address: '广州市海珠区宝岗大道翠宝路182号'
      },
      {
        id: 2,
        shop_name: '广州市-海珠区-昌岗店',
        shop_phone: '020-89667567-2',
        shop_business_time: '10：30-22：30',
        shop_address: '广州市海珠区宝岗大道翠宝路182号---22222'
      },
      {
        id: 3,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 4,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 5,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id:6,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 7,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      }
      ,
      {
        id: 8,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      }
    ]

  },
  // QQMapWX:require('../../../qqmap/qqmap-wx-jssdk.js'),
  // demo:new QQMapWX({key: 'RFHBZ-V56CU-25RVN-4QV2L-ZONZO-KVBWO'}),
  
  get_map: function(e){
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',
    });
    // qqmapsdk.search({
    //   keyword: e.currentTarget.dataset.phone,
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // },
    // )
    },
  phoneCall: function (e) {

    wx.makePhoneCall({

      phoneNumber: e.currentTarget.dataset.phone,

      success: function () {

        console.log("成功拨打电话")

      },

    })

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'RFHBZ-V56CU-25RVN-4QV2L-ZONZO-KVBWO'
    });
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