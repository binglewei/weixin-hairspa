// miniprogram/page/shop_list/shop_list.js
// import '../../utils/data_list.js'
// var aa=123;
// 引入SDK核心类
var QQMapWX = require('../../../libs/qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;
// // 实例化API核心类
var demo = new QQMapWX({
  key: 'RFHBZ-V56CU-25RVN-4QV2L-ZONZO-KVBWO' // 必填RFHBZ-V56CU-25RVN-4QV2L-ZONZO-KVBWO
});
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    // shop_list: ""
    shop_list: app.globalData.shop_list
    
  },
  
  phoneCall: function(e) {

    wx.makePhoneCall({

      phoneNumber: e.currentTarget.dataset.phone,

      success: function() {

        console.log("成功拨打电话")

      },

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var shop_list = app.globalData.shop_list;
    // this.setData(shop_list);
    // var app = getApp();
    // var shop_list = app.globalData.shop_list;
    // this.setData({
    //   shop_list: shop_list
    // });
    // console.log("shop_list ===", shop_list)
  },
  seeMap: function(e) {
    // 调用接口
    // demo.reverseGeocoder({
    //   location: {
    //     latitude: 39.984060,
    //     longitude: 116.307520
    //   },
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     console.log(res);
    //   }
    // });
    //地址解析(地址转坐标)     

    demo.geocoder({
      address: e.currentTarget.dataset.address,
      success: function(res) {
        //console.log(res.result.location.lng);
        var latitude = res.result.location.lat
        var longitude = res.result.location.lng
        // var name=res.result
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          name: e.currentTarget.dataset.address,
          address: e.currentTarget.dataset.address +"丝域养发馆"
        })

      },
      fail: function(res) {
        // console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },


  openMap: function() {

    wx.getLocation({
      type: 'gcj02', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      success: function(res) {
        // var latitude = res.latitude
        // var longitude = res.longitude
        var latitude = 113.341392;
        var longitude = 23.138709;
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  /**
   * 弹出层函数 开始
   */
  // submit: function () {
  //   this.setData({
  //     showModal: true
  //   })
  // },
  submit(e) {
    let aid = e.currentTarget.dataset.id;
    switch (aid) {
      case '1':
        this.setData({
          a_tel: "020-38038789",
          a_add: "广东省广州市天河区天河路490号壬丰大厦西厅1704",
          showModal: true

          //gd: this.data.gd ? false : true
        })
        break;
      case '2':
        this.setData({
          a_tel: "0755-33320126",
          a_add: "广东省深圳市福田区深南大道6013号 中国有色大厦1013室",
          showModal: true
          //xn: this.data.xn ? false : true
        })
        break;
    }
  },
  preventTouchMove: function() {},
  go: function() {
    this.setData({
      showModal: false
    })
  },
  map: function() {

    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）

      url: "/pages/map/map"

    })
  },
  /**
   * 弹出层函数 结束
   */
  onToggle(e) {
    let idId = e.currentTarget.dataset.id;
    switch (idId) {
      case 'gd':
        this.setData({
          gd: this.data.gd ? false : true
        })
        break;
      case 'xn':
        this.setData({
          xn: this.data.xn ? false : true
        })
        break;
      case 'hd':
        this.setData({
          hd: this.data.hd ? false : true
        })
        break;
      case 'xb':
        this.setData({
          xb: this.data.xb ? false : true
        })
        break;
    }
  }
})