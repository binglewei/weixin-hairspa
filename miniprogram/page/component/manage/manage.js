// miniprogram/page/component/manage/manage.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerUrls:[],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,

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
    var self=this;
    const db = wx.cloud.database();
    //拿到表
    // const seach_hot_data = db.collection('seach_hot');
    const banner_urls_data = db.collection('banner_urls');
    banner_urls_data.where({
      type: 3
    }).orderBy("_id", "desc").get({
      success: function (res) {
        console.log('[数据库] [查询banner_urls_data记录] 成功: ', res);
        var banner_urls_1 = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        // app.globalData.bannerUrls = banner_urls_1;
        self.setData({
          bannerUrls: banner_urls_1,
          // product_list: product_list
        });
        console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    const manager_list_data = db.collection('manager_list');
    manager_list_data.get({
      success: function (res) {
        // console.log('[数据库] [查询manager_list_data记录] 成功: ', res);
        var manager_list_datas = res.data;
        var _openid = app.globalData.openId;
        // console.log('_openid===manager_list_datas===111==== ', _openid, self.data, manager_list_datas);
        for (var ma in manager_list_datas){
          var manage_openid = manager_list_datas[ma]["manage_openid"];
          var manage_type = manager_list_datas[ma]["manage_type"];
          var shop_name = manager_list_datas[ma]["shop_name"];
          // console.log('manage_type======11111==== ', ma, manage_type, manage_openid, _openid,self.data);
          if (manage_openid == _openid) {

            
            if (manage_type==1){
              self.setData({
                manage_type: manage_type,
                shop_name: shop_name,
                is_super_admin: true
              });
            }else{
              self.setData({
                manage_type: manage_type,
                shop_name: shop_name,
                is_super_admin:false
              });
            }
            console.log('manage_type======22222==== ', ma, manage_type, manage_openid, self.data);
          } 
        }
        // console.log('banner_urls_1========== ', banner_urls_1);
        // app.globalData.bannerUrls = banner_urls_1;
        // self.setData({
        //   bannerUrls: banner_urls_1,
        //   // product_list: product_list
        // });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });
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