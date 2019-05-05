var app = getApp();
// var bannerUrls = app.globalData.bannerUrls;
// var product_list = app.globalData.product_list;
Page({
  data: {
    bannerUrls: "",
    product_list: "app.globalData.product_list",
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6" // 环境ID：wxc6c41875b492a9c0-1c74f6
    });
    //拿到表
    // const seach_hot_data = db.collection('seach_hot');
    const banner_urls_data = db.collection('banner_urls');
    banner_urls_data.where({
      // _openid: this.data.openid
      // _id:1
    }).get({
      success: function (res) {
        // console.log('[数据库] [查询banner_urls_data记录] 成功: ', res);
        var banner_urls_1 = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        // app.globalData.bannerUrls = banner_urls_1;
        self.setData({
          bannerUrls: banner_urls_1,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    const product_list_data = db.collection('product_list');
    product_list_data.where({
      // _openid: this.data.openid
      // _id:1
      // type:2
    }).get({
      success: function (res) {
        console.log('[数据库] [查询product_list_data记录]222 成功: ', res);
        var product_list = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        app.globalData.product_list = product_list;
        self.setData({
          product_list: product_list,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    product_list_data.where({
      // _openid: this.data.openid
      // _id:1
      type:2
    }).limit(10).get({
      success: function (res) {
        console.log('[数据库] [查询product_list_data记录]222 成功: ', res);
        var project_lists = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        // app.globalData.product_list = product_list;
        self.setData({
          project_lists: project_lists,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    // this.setData({
    //   product_list: product_list
    // });
    // for var urls in bannerUrls{
    //   url = encodeURI(urls.url);
    //   urls.url = urls;
    // }
    // wx.cloud.init();
    // wx.cloud.callFunction({
    //   name: 'get_openid',
    //   complete: res => {
    // console.log('云函数获取到的openid: ', res.result.userInfo.openId)
    // console.log('bannerUrls===: ', bannerUrls)
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
  // goUrl: function (e) {
  //   console.log("url=urlurlurlurlurl===", e.currentTarget.dataset.url);
  //   if (e.currentTarget.dataset.url != '#') {

  //     wx.navigateTo({

  //       url: e.currentTarget.dataset.url,
  //     })
  //   }
  //   },
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