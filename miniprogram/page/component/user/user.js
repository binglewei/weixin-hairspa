// page/component/new-pages/user/user.js

Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasAddress: false,
    address: {}
  },
  //加载
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    wx.login({
        success(res) {
          if (res.code) {
            // 发起网络请求
            // wx.request({
            //   url: 'https://test.com/onLogin',
            //   data: {
            //     code: res.code
            //   }
            // })
            wx.getUserInfo({
                success: function(res) {
                  console.log('wx.getUserInfo登录成功===', res)
                  self.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName,

                  });
                },
                fail: function(res) {
                  // <button open-type='getUserInfo'>获取授权</button>
                  console.log('getUserInfo失败！', res)
                }
              })
          } else {
            console.log('登录失败！', res.errMsg)
          }
        }
      }),
      // wx.getUserInfo({
      //   success: function(res){
      //     console.log('wx.getUserInfo===' ,  res)
      //     self.setData({
      //       thumb: res.userInfo.avatarUrl,
      //       nickname: res.userInfo.nickName,

      //     })
      // console.log("res.userInfo.avatarUrl==", res.userInfo.avatarUrl),
      //   },
      // }),


      /**
       * 发起请求获取订单列表信息
       */
      wx.request({
        url: 'http://www.gdfengshuo.com/api/wx/orders.txt',
        success(res) {
          self.setData({
            orders: res.data
          })
        }
      })
  },
  onShow() {
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  /**
   * 发起支付请求
   */
  payOrders() {
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        wx.showModal({
          title: '支付提示',
          content: '<text>',
          showCancel: false
        })
      }
    })
  }
})