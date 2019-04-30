// miniprogram/page/otherview/Favourable_activity.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp();
    var bannerUrls = app.globalData.bannerUrls;
    console.log("options===============", options, bannerUrls);
    var url_id = options.url_id;
    console.log("url_id=========22222==========", url_id);
    for (var bann in bannerUrls) {
      console.log("bann=======1111=====", bann, url_id);
      var _id = bannerUrls[bann]["_id"];
      if (_id == url_id) {
        var url = bannerUrls[bann]["url"];
        console.log("bann..url==22222=============", url);
        this.setData({
          // hasList: true,
          url: url
        })
      }
    }
    // encodeURI



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