 var app = getApp();
Page({
  data: {
    bannerUrls: "",
    product_list: "",
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
      // wx.navigateBack();
    }, 3000);
    var self = this;
    var openid = app.globalData.openId;
    if (openid == "") {
      wx.cloud.init();
      wx.cloud.callFunction({
        name: 'get_openid',
        complete: res => {
          // console.log('云函数获取到的openid: ', res, res.result.openId)
          var openId = res.result.openId;
          // console.log('云函数获取到的openid:==222222222= ', res, openId)
          app.globalData.openId = openId;
          // self.setdata({
          //   openId: openId
          // })
        }
      })

    };
    const db = wx.cloud.database();
    //拿到表
    // const seach_hot_data = db.collection('seach_hot');
    const banner_urls_data = db.collection('banner_urls');
    banner_urls_data.where({
      // _openid: this.data.openid
      // _id:1
      type: 1
    }).orderBy("_id","desc").get({
      success: function(res) {
        // console.log('[数据库] [查询banner_urls_data记录] 成功: ', res);
        var banner_urls_1 = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        self.setData({
          bannerUrls: banner_urls_1,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    const product_list_data = db.collection('product_list');
    product_list_data.where({
      // _openid: this.data.openid
      // _id:1
      // type:2
    }).get({
      success: function(res) {
        // console.log('[数据库] [查询product_list_data记录]222 成功: ', res);
        var product_list_1 = res.data;
        wx.request({
          url: "https://minipgm.siyuhome.net/rest/transmission/getProgramList?name=",
          data: "",
          header: {},
          method: 'GET',
          success: function(res) {
            // console.log("res=success=11==", res);
            var project_lists_sy = res.data
            var product_list_3 = product_list_1.concat(project_lists_sy);
            app.globalData.product_list = product_list_3;
            app.globalData.project_lists = project_lists_sy;
            self.setData({
              product_list: product_list_3,
              // project_lists: product_list_2,
              // product_list: product_list
            });
          },
          fail: function(res) {
            // console.log("res=fail=22==", res);
          },
          complete: function(res) {
            // console.log('complete==3333==', res);

          },
        });
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    product_list_data.where({
      // _openid: this.data.openid
      // _id:1
      type: 2
    }).limit(10).orderBy('_id', 'desc').get({
      success: function(res) {
        // console.log('[数据库] [查询product_list_data记录]222 成功: ', res);
        var project_lists_index = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        self.setData({
          project_lists_index: project_lists_index,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    product_list_data.where({
      // _openid: this.data.openid
      // _id:1
      type: 1
    }).limit(2).orderBy('_id', 'desc').get({
      success: function(res) {
        // console.log('[数据库] [查询product_list_data记录]222 成功: ', res);
        var product_list_index = res.data;
        self.setData({
          product_list_index: product_list_index,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    // this.setData({
    //   product_list: product_list
    // });
    // for var urls in bannerUrls{
    //   url = encodeURI(urls.url);
    //   urls.url = urls;
    // }
    
    // 
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