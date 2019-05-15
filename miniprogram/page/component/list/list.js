// page/component/list/list.js
var app = getApp();
Page({
  data: {
    project_lists: "",
    bannerUrls: "",
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var type = options.type;
    console.log('type=========== ', options, type);
    var self = this;
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6" // 环境ID：wxc6c41875b492a9c0-1c74f6
    });
    if (type == 2) {
      wx.request({
        url: "https://minipgm.siyuhome.net/rest/transmission/getProgramList?name=",
        data: "",
        header: {},
        method: 'GET',
        success: function (res) {
          // console.log("res=success=11==", res);
          var project_lists = res.data
          // var product_list_1=app.globalData.product_list;
          // var product_list_2 = product_list_1.concat(project_lists);
          // app.globalData.product_list = product_list_2;
          self.setData({
            project_lists: project_lists,
            // product_list: product_list
          });
        },
        fail: function (res) {
          // console.log("res=fail=22==", res);
        },
        complete: function (res) {
          // console.log('complete==3333==', res);

        },
      })
    } else {
      const project_lists_data = db.collection('product_list');
      project_lists_data.where({
        // _openid: this.data.openid
        // _id:1,
        type: 1,
      }).orderBy('_id', 'desc').get({
        success: function (res) {
          // console.log('[数据库] [查询banner_urls_data记录] 成功: ', res);
          var project_lists = res.data;
          // console.log('banner_urls_1========== ', banner_urls_1);
          // app.globalData.bannerUrls = banner_urls_1;
          // app.globalData.product_list = project_lists;
          self.setData({
            project_lists: project_lists,
            // product_list: product_list
          });
          // console.log('bannerUrls====3333333====== ', banner_urls_1);
        },
        fail: function (res) {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          // console.error('[数据库] [查询记录] 失败：', err)
        }
      });
    }

    //拿到表
    // const seach_hot_data = db.collection('seach_hot');
    const banner_urls_data = db.collection('banner_urls');
    banner_urls_data.where({
      // _openid: this.data.openid
      // _id:1,
      type: 2,
    }).get({
      success: function (res) {
        // console.log('[数据库] [查询banner_urls_data记录] 成功: ', res);
        var banner_urls_1 = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        app.globalData.bannerUrls = banner_urls_1;
        self.setData({
          bannerUrls: banner_urls_1,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', banner_urls_1);
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
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function(options) {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})