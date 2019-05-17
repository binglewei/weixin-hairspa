// miniprogram/page/otherview/Favourable_activity.js
var util = require('../../../libs/utils/utils.js');
// var md5 = require('../../../libs/utils/md5.js');
var md5_2 = require('../../../libs/utils/md5_2.js');
var sign = require('../../../libs/utils/sign.js');
var parser = require("../../../libs/xmldom/dom-parser.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerdata:[],
    imgUrl: "",
    retailPrice:"",
    // url_type:0,
    // jump_imag_height:500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp();
    var bannerUrls = app.globalData.bannerUrls;
    var url_id = options.url_id;
    for (var bann in bannerUrls) {
      var _id = bannerUrls[bann]["_id"];
      if (_id == url_id) {
        var imgUrl = bannerUrls[bann]["jumpUrl"];
        var retailPrice = bannerUrls[bann]["retailPrice"];
        this.setData({
          imgUrl: imgUrl,
          bannerdata: bannerUrls[bann],
          retailPrice: retailPrice,
        })
      }
    }

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

  },
  /**
  * 发起支付请求
  */
  toPay() {

    var resp = {}
    var self = this;
    resp["total"] = self.data.retailPrice.toFixed(2);
    resp["address"] = app.globalData.address;
    resp["bannerdata"] = self.data.bannerdata;
    resp["openId"] = app.globalData.openId;
    console.log("res==resp=befor=", resp);
    // var Apikey = "symeiyu1357048216039688322766666"; //不同于AppSecret(小程序密钥)#sy89667567	#api 密钥

    var bodyData = sign.wxpay_getbodyData(resp);
    console.log("sign返回===bodyData=", bodyData);
    var urlStr_befor = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    wx.request({
      url: urlStr_befor,
      data: bodyData,
      header: {},
      method: 'POST',
      // dataType: 'xml',
      // responseType: 'text',
      success: function (res) {
        console.log(' wx.request=unifiedorder=成功了111==', res);
        var result_xml = res.data;
        var xml_parser = new parser.DOMParser();
        var xml = xml_parser.parseFromString(result_xml);
        var return_xml = xml_parser.parseFromString(bodyData);
        var out_trade_no = return_xml.getElementsByTagName('out_trade_no')[0].firstChild.nodeValue;
        var total_fee = return_xml.getElementsByTagName('total_fee')[0].firstChild.nodeValue;
        console.log("out_trade_no==openId==22222=", out_trade_no);

        // console.log(' result_xmldata=return_xml=', result_xml, return_xml);
        var nonce_str_s = xml.getElementsByTagName('nonce_str');
        var prepay_id_s = xml.getElementsByTagName('prepay_id');
        var appId = app.globalData.appId;
        var nonceStr = nonce_str_s[0].firstChild.nodeValue; // 随机字符串
        var timeStamp = String(Math.round(new Date().getTime())); // 时间戳
        var package_valus = 'prepay_id=' + prepay_id_s[0].firstChild.nodeValue; // 统一下单接口返     
        var Apikey = app.globalData.Apikey;
        // paySign = MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6
        var paysign_temp = ("appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + package_valus + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + Apikey); // 签名
        console.log("paysign_temp==1111===", paysign_temp);
        // var paySign = md5.hexMD5(paysign_temp).toUpperCase();
        var paySign = md5_2.md5(paysign_temp).toUpperCase();
        // console.log("timeStamp, nonceStr, package_valus, paySign==1111===", timeStamp, nonceStr, package_valus, paySign);
        var orders_list_String = {};
        orders_list_String.orders = [self.data.bannerdata];
        orders_list_String.address = app.globalData.address;
        orders_list_String.total_fee = total_fee / 100;
        orders_list_String.out_trade_no = out_trade_no;
        orders_list_String.package_valus = package_valus;
        // orders_list_String.paySign = paySign;
        orders_list_String.nonceStr = nonceStr;

        console.log("orders_list_String=111111111111111111==", orders_list_String)

        // 云数据库初始化
        const db = wx.cloud.database({
          env: "wxc6c41875b492a9c0-1c74f6"
        });
        const orders_list = db.collection('orders_list');

        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: package_valus,
          signType: 'MD5',
          paySign: paySign,
          success: function (res) {
            console.log("res==支付调用成功11==", res)
            orders_list_String.status_describe = "支付成功";
            orders_list_String.status = 0;
            orders_list_String.expense = 1;
            orders_list_String.expense_describe = "未消费";
            orders_list_String.expense_time = "";
            orders_list_String.pay_time = util.format_date_5(new Date());

          },
          fail: function (res) {
            console.log("res=fail=22==", res);
            orders_list_String.status_describe = "支付失败";
            orders_list_String.status = 1;
            orders_list_String.expense = 0;
            orders_list_String.expense_describe = "订单未支付";
            orders_list_String.expense_time = "";
            orders_list_String.pay_time = util.format_date_5(new Date());
            var errMsg = res.errMsg;
            var find_text = errMsg.indexOf("cancel");
            if (find_text > 0) {
              orders_list_String.status_describe = "取消失付";
              wx.showModal({
                title: '支付提示',
                content: '你已经取消支付！！!',
                showCancel: false
              })
            }
            else {
              wx.showModal({
                title: '支付提示',
                content: '微信支付失败，请联系管理员!',
                showCancel: false
              })
            }

          },
          complete: function (res) {
            // self.data.
            var orders = self.data.orders;
            // console.log("orderseeee=22222=", orders)
            for (var ord in orders) {
              var id = orders[ord]["id"]
              // console.log("cart_totalNums=222222222222222222=", app.globalData.cart_totalNums)
              delete app.globalData.cart_totalNums[id];
              // console.log("cart_totalNums=33333333333333333333=", app.globalData.cart_totalNums)
            }

            orders_list.add({
              // data 字段表示需新增的 JSON 数据
              // data: JSON.parse(orders_list_String)
              data: orders_list_String

            }).then(res => {
              console.log("DATASET==res==orders_list_String===", res, orders_list_String)
            }).catch(err => {
              console.log("DATASET==res==orders_list_String===", err, orders_list_String)
            })
          }
        })

      },
      fail: function (res) {
        console.log(' wx.request==出错了22==', res);
        wx.showModal({
          title: '支付提示',
          content: '订单生成失败，请联系管理员!',
          showCancel: false
        })
      },
      complete: function (res) {
        // console.log('complete==3333==', res);

      },
    });


  }
})