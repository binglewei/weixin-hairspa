// page/component/orders/orders.js
var util = require('../../../libs/utils/utils.js');
var md5 = require('../../../libs/utils/md5.js');
var sign = require('../../../libs/utils/sign.js');
var app = getApp();
var cart_totalNums = app.globalData.cart_totalNums;
Page({
  data: {
    openId: "",
    address: {},
    hasAddress: false,
    total: 0,
    orders: [
      // {id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03}
    ]
  },

  onReady() {
    this.getTotalPrice();
  },
  onShow: function() {
    // wx.cloud.init();
    var self = this;
    var orders_1 = [];
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'get_openid',
      complete: res => {
       
        var openId = res.result.userInfo.openId;
        this.setData({
          openId: openId
        })
        console.log('云函数获取到的openid: ', openId)
      }
    })
    // let that = this;
    // wx.cloud.callFunction({
    //   name: 'get_openid',//get_openid
    //   complete: res => {
    //     console.log('云函数获取到的openid: ', res.result.openId)
    //     var openid = res.result.openId;
    //     self.setData({
    //       openId: openId
    //     })
    //   }
    // });

    for (var key in cart_totalNums) {
      var selected = cart_totalNums[key]["selected"];
      if (selected) {
        orders_1.push(cart_totalNums[key]);
        // console.log("selected orders_1==", selected, orders_1);
      }
      // console.log("orders_1==", orders_1);
      self.setData({
        orders: orders_1,
        // hasAddress: true
      })
    };
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },
  /**
   * 发起支付请求
   */
  toPay() {

    var resp = {}
    resp["total"] = this.data.total;
    resp["address"] = this.data.address;
    resp["orders"] = this.data.orders;
    resp["openId"] = this.data.openId;
    console.log("res==resp=befor=", resp);
    var returnValue = sign.wxpay(resp);
    console.log("res==returnValue============", returnValue);

    // var appId = app.globalData.appId;
    // var timeStamp = util.formatTime(new Date());
    // var nonceStr = md5.hexMD5(timeStamp);
    // // var package = sign
    // var paySign = md5.hexMD5(timeStamp);
    wx.requestPayment({
      // appId: returnValue.appId,
      timeStamp: returnValue.timeStamp,
      nonceStr: returnValue.nonceStr,
      package: returnValue.package,
      signType: 'MD5',
      paySign: returnValue.paySign,
      success: function(res) {
        console.log("res==11==", res)
      },
      fail: function(res) {
        console.log("res=fail=22==", res);
        wx.showModal({
          title: '支付提示',
          content: 'res.content',
          showCancel: false
        })
      }
    })
  }
  // toPay() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '本系统只做演示，支付系统已屏蔽',
  //     text: 'center',
  //     complete() {
  //       wx.switchTab({
  //         url: '/page/component/user/user'
  //       })
  //     }
  //   })
  // }
})