// miniprogram/page/member_manage/member_manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      curIndex: "index",
      hasList: false,
      page:1

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
    this.bindTap();
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
    this.setData({
      page:this.data.page+1
    })
    console.log("页面上拉触底事件的处理函数====", this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  phoneCall: function (e) {

    wx.makePhoneCall({

      phoneNumber: e.currentTarget.dataset.phone,

      success: function () {

        console.log("成功拨打电话")

      },

    })

  },
  bindTap(e) {

    // var from_page = this.data.from_page;
    // if (from_page) {
    //   var select_data = {
    //     from_page: from_page,
    //     shop_name: this.data.shop_name
    //     // _openid: this.data.openid
    //   }
    // } else {
    //   var select_data = {
    //     // _openid: this.data.openid
    //   }
    // }

    if (e) {
      var index = parseInt(e.currentTarget.dataset.index);
    } else {
      var index = 0;
    }
    wx.showLoading({
      title: '加载中',
    })
    if (index == 0) {
      setTimeout(function () {
        wx.hideLoading()
        // wx.navigateBack();
      }, 1000);
    } else {
      setTimeout(function () {
        wx.hideLoading()
        // wx.navigateBack();
      }, 3000);
    }
    var select_data={};
    select_data.page=this.data.page;
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_userinfo',
      data: select_data
    }).then(res => {
      console.log("data=wx.cloud.callFunction--=",res)
      var data = res.result;
      if (data.length > 0) {
        var len_name = "list_len_" + index;
        var list_lens = {};
        // list_lens[len_name] = data.length;
        list_lens[len_name] = " " + String(data.length);
        console.log(" list_lens =",list_lens );
        this.setData({
          userinfo_list: data,
          list_lens: list_lens,
          curIndex: index,
          hasList: true, // 列表是否有数据
        })
      } else {
        this.setData({
          // reservation_list: data,
          curIndex: index,
          hasList: false
        })
      }
    }).catch(err => {
      // handle error
      console.error("data=wx.cloud.callFunction--=", err)
    })
    if (index){

    } else {
    this.setData({
      // reservation_list: data,
      curIndex: index,
      hasList: false
    })
    }
    }
})