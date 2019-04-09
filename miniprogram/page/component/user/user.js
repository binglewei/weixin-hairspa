// page/component/new-pages/user/user.js
// var app = getApp();
// var globalData_address= app.globalData.address;
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
            console.log('wx.login登录成功===', res);
            wx.getUserInfo({
                success: function(res) {
                  console.log('wx.getUserInfo成功===', res)
                  var gender = res.userInfo.gender;
                  self.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName,

                  });
                  wx.getStorage({
                    key: 'address',
                    success: function(res) {
                      var address = res.data;
                      address["gender"] = gender ;
                      console.log("address===", address);
                      wx.setStorage({
                        key: 'address',
                        data: address,
                      })
                    },
                  })
                  
                  // globalData_address.gender = res.userInfo.gender
                },
                fail: function(res) {
                  Toast({
                    message: '请先获取授权！！',
                    selector: '#zan-toast-test'
                  })
                  // }
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
        console.log("address22222===", res.data);
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