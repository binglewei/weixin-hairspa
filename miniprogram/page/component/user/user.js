// page/component/new-pages/user/user.js
// var app = getApp();
// var globalData_address= app.globalData.address;
var app = getApp();
var md5_2 = require('../../../libs/utils/md5_2.js');
var util = require('../../../libs/utils/utils.js');
// var WXBizDataCrypt = require('../../../libs/WXBizDataCrypt/WXBizDataCrypt.js');
Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    orders_list: [],
    orders_pay: [],
    hasAddress: false,
    address: {}
  },
  //加载
  onLoad() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow() {
    // 云数据库初始化
    const db = wx.cloud.database();
    // const orders_list = db.collection('orders_list');
    // orders_list.where({
    //   _openid: app.globalData.openId
    // }).limit(2).orderBy('out_trade_no', 'desc').get({
    //   success: res => {
    //     this.setData({
    //       orders_list: res.data
    //     })
    //     // console.log('[数据库] [查询记录] 成功: ', res.data)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     // console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // });
    var self = this;
    var userInfo = app.globalData.userInfo;
    self.setData({
      userInfo: userInfo,
      thumb: userInfo.avatarUrl,
      nickname: userInfo.nickName,
    });
    wx.getUserInfo({
      lang: "zh_CN",
      withCredentials: true,
      success: function (res) {
        var userInfo = res.userInfo;
       
        // wx.cloud.init();
        wx.cloud.callFunction({
          name: 'get_openid',
          complete: res => {
            console.log("get_openid====res=unionid==", res, res.result.unionid);
            var openId = res.result.openId;
            var unionid = res.result.unionid;
            // self.data.openId = openId;
            // self.data.unionid = unionid;
            self.setData({
              userInfo: userInfo,
              thumb: userInfo.avatarUrl,
              nickname: userInfo.nickName,
              openId: openId,
              unionid: unionid
            });
            const address_list_data = db.collection('address_list');
            var add_value = {};
            add_value.userInfo = userInfo;
            add_value.unionid = unionid;
            add_value.update_date = new Date();
            // console.log('[数据库] 操作前数据===: ', add_value);
            address_list_data.where({
              _openid: openId
            }).get({
              success: res => {
                var len_data = res.data.length;
                // console.log("len_data==len_data==", len_data, res.data);
                if (len_data == 0) {
                  console.log('[数据库] add: ', add_value);
                  address_list_data.add({
                    data: add_value

                  }).then(res => {
                    // console.log("DATASET==res==value===", res, add_value)
                  }).catch(err => {
                    console.error("DATASET==res==value===", err, add_value)
                  })
                }
                else {
                  var unionid_from = res.data[0].unionid;
                  if (!unionid_from) {
                    // console.log("unionid_from======", unionid_from)

                    console.log('[数据库] update:===在app.js= ', add_value)
                    var id = res.data[0]["_id"]
                    address_list_data.doc(id).update({
                      // data 字段表示需新增的 JSON 数据
                      // data: JSON.parse(orders_list_String)
                      data: add_value

                    }).then(res => {
                      // console.log("DATASET==res==update=su、s==", res, add_value)
                    }).catch(err => {
                      console.error("DATASET==res==value===", err, add_value)
                    })

                  }

                }
                // console.log('[数据库] [查询记录] 成功: ', res.data)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '查询记录失败'
                })
              }
            });

            // console.error('[数据库] [查询记录] 失败：', err)
          }
        });
      },
      fail: function (res) {
        console.error("wx.getUserInfo=====error===", res);
        wx.showModal({
          title: '提示',
          content: "请先点击 “我的》个人设置” 获取授权并完善个人信息哦！！",
          showCancel: false
        })
      }
    }); 

    var _openid = app.globalData.openId;
    var manager_list_data = db.collection('manager_list');
    manager_list_data.get({
      success: res => {
        // console.log("manager_list_data=111=user=", res.data, _openid,app.globalData);
        var data = res.data;
        var len_data = res.data.length;
        for (var ii in data) {
          var manage_openid = data[ii]["manage_openid"];
          // console.log("manage_openid========2222======", manage_openid, _openid)
          if (manage_openid == _openid) {

            self.setData({
              // address: data,
              is_manager: true
            })
            // console.log("manage_openid===222==", manage_openid, res.data, self.data);

          }
        }
        // if (len_data > 0) {
        //   // self.setData({
        //   //   address: data,
        //   //   hasAddress: true
        //   // })
        // }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        });
      },
    })
    var address_list_data = db.collection('address_list');
    address_list_data.where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        console.log("res.data=111=user=", res.data);
        var data = res.data[0];
        var len_data = res.data.length;
        if (data.shop) {
          self.setData({
            address: data,
            hasAddress: true
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        });
      },
    })
    // wx.getStorage({
    //   key: 'address',
    //   success: function(res) {
    //     var address = res.data;
    //     // address["gender"] = gender;
    //     // console.log("address===", address);
    //   }
    // })
    /**
     * 获取本地缓存 地址信息
     */

    // wx.getStorage({
    //   key: 'address',
    //   success: function(res) {
    //     // console.log("address22222===", res.data);
    //     self.setData({
    //       hasAddress: true,
    //       address: res.data
    //     })
    //   }
    // })
  },

  //  发起消费请求
  // expenseOrders(e) {
  //   var self = this;
  //   var id = e.target.dataset.id;
  //   wx.showModal({
  //     title: '消费提示',
  //     content: '您确定要确认消费吗？？？',
  //     success(res) {
  //       if (res.confirm) {
  //         // console.log('用户点击确定')
  //         const db = wx.cloud.database({
  //           env: "wxc6c41875b492a9c0-1c74f6"
  //         });
  //         const orders_list = db.collection('orders_list');
  //         // console.log("e=e.target.dataset.id=11111111=", id);

  //         orders_list.doc(id).update({
  //           data: {
  //             expense: 0,
  //             expense_describe: "已消费",
  //             // ddxz:22,
  //             expense_time: util.format_date_5(new Date())
  //             // out_trade_no: 66666666666666
  //           },
  //           success: res => {
  //             // console.log('[数据库] [更新记录] 成功：', res);
  //             getCurrentPages()[getCurrentPages().length - 1].onShow()
  //             // this.setData({
  //             //   count: newCount
  //             // })
  //           },
  //           fail: err => {
  //             icon: 'none',
  //             // console.error('[数据库] [更新记录] 失败：', err);
  //             getCurrentPages()[getCurrentPages().length - 1].onShow()

  //           }

  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // var orders_list_values = {};

  // orders_list.where({
  //   // _openid: app.globalData.openId,
  //   out_trade_no: e.target.dataset.out_trade_no,
  // }).update({
  //   success: res => {
  //     self.setData({
  //       orders_pay: res.data
  //     })
  //     // orders_list_values = res.data;
  //     console.log('[数据库] [查询记录] 222成功: ', res.data, self.data.orders_pay)
  //   },
  //   fail: err => {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '查询记录失败'
  //     })
  //     console.error('[数据库] [查询记录] 失败：', err)
  //   }
  // });
  // },



  /**
   * 发起支付请求
   */
  // payOrders(e) {
  //   var self = this;
  //   var index = e.target.dataset.index;
  //   var id = e.target.dataset.id;

  //   // console.log("e=e.target.dataset.index===22id===", index, id);
  //   var orders_list_values = {};
  //   var timeStamp = String(Math.round(new Date().getTime())); // 时间戳

  //   var orders_pay = self.data.orders_list[index];
  //   // console.log('==orders_pay=1111== ', orders_pay, self.data.orders_pay);
  //   var appId = app.globalData.appId;
  //   var Apikey = app.globalData.Apikey;
  //   var nonceStr = orders_pay.nonceStr;
  //   var out_trade_no = orders_pay.out_trade_no;
  //   var package_valus = orders_pay.package_valus;
  //   var paysign_temp = ("appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + package_valus + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + Apikey); // 签名
  //   // console.log("paysign_temp==USER=222222222==", paysign_temp);
  //   // var paySign = md5.hexMD5(paysign_temp).toUpperCase();
  //   var paySign = md5_2.md5(paysign_temp).toUpperCase();
  //   wx.requestPayment({
  //     timeStamp: timeStamp,
  //     nonceStr: nonceStr,
  //     package: package_valus,
  //     signType: 'MD5',
  //     paySign: paySign,
  //     success: function(res) {
  //       console.log("res==支付调用成功11==", res)
  //       const db = wx.cloud.database({
  //         env: "wxc6c41875b492a9c0-1c74f6"
  //       });
  //       const orders_list = db.collection('orders_list');
  //       orders_list.doc(id).update({
  //         data: {
  //           status_describe: "支付成功",
  //           status: 0,
  //           expense: 1,
  //           expense_describe: "未消费",
  //           expense_time: "",
  //           pay_time: util.format_date_5(new Date())
  //         },
  //         success: res => {
  //           // console.log('[数据库] [更新记录] 成功：', res)
  //           // getCurrentPages()[getCurrentPages().length - 1].onShow()
  //           // this.setData({
  //           //   count: newCount
  //           // })
  //         },
  //         fail: err => {
  //           // icon: 'none',
  //           // console.error('[数据库] [更新记录] 失败：', err)
  //           // getCurrentPages()[getCurrentPages().length - 1].onShow()
  //         }

  //       })
  //     },
  //     fail: function(res) {

  //       var err_code = res.err_code;
  //       var errMsg = res.errMsg;
  //       var find_text = errMsg.indexOf("重新");
  //       var find_text_cancel = errMsg.indexOf("fail cancel");
  //       console.log("res=fail=22==", res, err_code, errMsg, find_text);

  //       if (err_code == 2 || find_text > 0) {

  //         // wx.showModal({
  //         //   title: '支付提示',
  //         //   content: '微信支付失败，请从新下单!',
  //         //   showCancel: false
  //         // })
  //         const db = wx.cloud.database({
  //           env: "wxc6c41875b492a9c0-1c74f6"
  //         });
  //         const orders_list = db.collection('orders_list');
  //         orders_list.doc(id).update({
  //           data: {
  //             //  orders_list_String.status_describe = "支付成功";
  //             // orders_list_String.status = 0;
  //             // orders_list_String.expense = 1;
  //             // orders_list_String.expense_describe = "未消费";
  //             // orders_list_String.expense_time = "";
  //             // orders_list_String.pay_time = util.format_date_5(new Date()) ;
  //             status_describe: "订单已过期",
  //             status: 0,
  //             expense: 0,
  //             expense_describe: "未消费",
  //             expense_time: "",
  //             pay_time: util.format_date_5(new Date())
  //           },
  //           success: res => {
  //             // console.log('[数据库] [更新记录] 成功：', res)
  //             // getCurrentPages()[getCurrentPages().length - 1].onShow()
  //             // this.setData({
  //             //   count: newCount
  //             // })
  //           },
  //           fail: err => {
  //             // icon: 'none',
  //             // console.error('[数据库] [更新记录] 失败：', err),
  //             // getCurrentPages()[getCurrentPages().length - 1].onShow()
  //           },
  //           complete: err => {
  //             // console.log('complete==3333==', res);
  //             // getCurrentPages()[getCurrentPages().length - 1].onShow()

  //           },

  //         })
  //       } else if (find_text_cancel > 0) {
  //         // orders_list_String.status_describe = "取消失付";
  //         wx.showModal({
  //           title: '支付提示',
  //           content: '你已经取消支付！！!',
  //           showCancel: false
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '支付提示',
  //           content: '微信支付失败，请联系管理员!',
  //           showCancel: false
  //         })
  //       }

  //     },
  //     complete: function(res) {
  //       // console.log('complete==3333==', res);
  //       getCurrentPages()[getCurrentPages().length - 1].onShow()
  //     }
  //   })
  // }
})