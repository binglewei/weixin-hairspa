var app = getApp();
var bannerUrls = app.globalData.bannerUrls;
var product_list = app.globalData.product_list;
Page({
  data: {
    bannerUrls: bannerUrls,
    product_list: product_list,
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.cloud.init();
    // wx.cloud.callFunction({
    //   name: 'get_openid',
    //   complete: res => {
    //     console.log('云函数获取到的openid: ', res.result.userInfo.openId)
    //     var openId = res.result.openId;
    //     // app.globalData.openId = openId;
    //     // this.setdata({
    //     //   openId: openId
    //     // })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           // 用户已经同意小程序使用用户信息，后续调用 wx.userInfo 接口不会弹窗询问
    //           //wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口，请使用 <button open-type="getUserInfo"/>
    //           wx.startRecord()
    //         }
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})