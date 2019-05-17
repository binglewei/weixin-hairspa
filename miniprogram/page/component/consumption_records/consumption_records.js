// miniprogram/page/component/consumption_records.js
var app = getApp();
var md5_2 = require('../../../libs/utils/md5_2.js');
var util = require('../../../libs/utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders_list:[],
    hasList: true          // 列表是否有数据
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
    // 云数据库初始化
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6"
    });
    const orders_list = db.collection('orders_list');
    orders_list.where({
      // _openid: app.globalData.openid
    }).orderBy('out_trade_no', 'desc').get({
      success: res => {
        var data=res.data;
        if (data.length>0){
          this.setData({
            orders_list: res.data,
            hasList: true,          // 列表是否有数据
          })
        } else {
          this.setData({
            // reservation_list: data,
            hasList: false
          })
        }
       
        console.log('[数据库] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });
  },
  //  发起消费请求
  expenseOrders(e) {
    var self = this;
    var id = e.target.dataset.id;
    wx.showModal({
      title: '消费提示',
      content: '您确定要确认消费吗？？？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          const db = wx.cloud.database({
            env: "wxc6c41875b492a9c0-1c74f6"
          });
          const orders_list = db.collection('orders_list');
          // console.log("e=e.target.dataset.id=11111111=", id);

          orders_list.doc(id).update({
            data: {
              expense: 0,
              expense_describe: "已消费",
              // ddxz:22,
              expense_time: util.format_date_5(new Date())
              // out_trade_no: 66666666666666
            },
            success: res => {
              // console.log('[数据库] [更新记录] 成功：', res);
              getCurrentPages()[getCurrentPages().length - 1].onShow()
              // this.setData({
              //   count: newCount
              // })
            },
            fail: err => {
              icon: 'none',
                // console.error('[数据库] [更新记录] 失败：', err);
                getCurrentPages()[getCurrentPages().length - 1].onShow()

            }

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },



  /**
   * 发起支付请求
   */
  payOrders(e) {
    var self = this;
    var index = e.target.dataset.index;
    var id = e.target.dataset.id;

    // console.log("e=e.target.dataset.index===22id===", index, id);
    var orders_list_values = {};
    var timeStamp = String(Math.round(new Date().getTime())); // 时间戳

    var orders_pay = self.data.orders_list[index];
    // console.log('==orders_pay=1111== ', orders_pay, self.data.orders_pay);
    var appId = app.globalData.appId;
    var Apikey = app.globalData.Apikey;
    var nonceStr = orders_pay.nonceStr;
    var out_trade_no = orders_pay.out_trade_no;
    var package_valus = orders_pay.package_valus;
    var paysign_temp = ("appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + package_valus + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + Apikey); // 签名
    // console.log("paysign_temp==USER=222222222==", paysign_temp);
    // var paySign = md5.hexMD5(paysign_temp).toUpperCase();
    var paySign = md5_2.md5(paysign_temp).toUpperCase();
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: package_valus,
      signType: 'MD5',
      paySign: paySign,
      success: function (res) {
        console.log("res==支付调用成功11==", res)
        const db = wx.cloud.database({
          env: "wxc6c41875b492a9c0-1c74f6"
        });
        const orders_list = db.collection('orders_list');
        orders_list.doc(id).update({
          data: {
            status_describe: "支付成功",
            status: 0,
            expense: 1,
            expense_describe: "未消费",
            expense_time: "",
            pay_time: util.format_date_5(new Date())
          },
          success: res => {
            // console.log('[数据库] [更新记录] 成功：', res)
            // getCurrentPages()[getCurrentPages().length - 1].onShow()
            // this.setData({
            //   count: newCount
            // })
          },
          fail: err => {
            // icon: 'none',
            // console.error('[数据库] [更新记录] 失败：', err)
            // getCurrentPages()[getCurrentPages().length - 1].onShow()
          }

        })
      },
      fail: function (res) {

        var err_code = res.err_code;
        var errMsg = res.errMsg;
        var find_text = errMsg.indexOf("重新");
        var find_text_cancel = errMsg.indexOf("cancel");
        console.log("res=fail=22==", res, err_code, errMsg, find_text);

        if (err_code == 2 || find_text > 0) {

          // wx.showModal({
          //   title: '支付提示',
          //   content: '微信支付失败，请从新下单!',
          //   showCancel: false
          // })
          const db = wx.cloud.database({
            env: "wxc6c41875b492a9c0-1c74f6"
          });
          const orders_list = db.collection('orders_list');
          orders_list.doc(id).update({
            data: {
              //  orders_list_String.status_describe = "支付成功";
              // orders_list_String.status = 0;
              // orders_list_String.expense = 1;
              // orders_list_String.expense_describe = "未消费";
              // orders_list_String.expense_time = "";
              // orders_list_String.pay_time = util.format_date_5(new Date()) ;
              status_describe: "订单已过期",
              status: 0,
              expense: 0,
              expense_describe: "未消费",
              expense_time: "",
              pay_time: util.format_date_5(new Date())
            },
            success: res => {
              // console.log('[数据库] [更新记录] 成功：', res)
              // getCurrentPages()[getCurrentPages().length - 1].onShow()
              // this.setData({
              //   count: newCount
              // })
            },
            fail: err => {
              // icon: 'none',
              // console.error('[数据库] [更新记录] 失败：', err),
              // getCurrentPages()[getCurrentPages().length - 1].onShow()
            },
            complete: err => {
              // console.log('complete==3333==', res);
              // getCurrentPages()[getCurrentPages().length - 1].onShow()

            },

          })
        } else if (find_text_cancel > 0) {
          // orders_list_String.status_describe = "取消失付";
          wx.showModal({
            title: '支付提示',
            content: '你已经取消支付！！!',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '支付提示',
            content: '微信支付失败，请联系管理员!',
            showCancel: false
          })
        }

      },
      complete: function (res) {
        // console.log('complete==3333==', res);
        getCurrentPages()[getCurrentPages().length - 1].onShow()
      }
    })
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