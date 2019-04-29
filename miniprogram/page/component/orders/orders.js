// page/component/orders/orders.js
var util = require('../../../libs/utils/utils.js');
var md5 = require('../../../libs/utils/md5.js');
var md5_2 = require('../../../libs/utils/md5_2.js');
var sign = require('../../../libs/utils/sign.js');
var parser = require("../../../libs/xmldom/dom-parser.js");
var app = getApp();
var cart_totalNums = app.globalData.cart_totalNums;


Page({
  data: {
    openId: "",
    address: {},
    returnValue: '',
    hasAddress: false,
    total: 0,
    orders: [
      // {id:2,title:'素米 500g',image:'/image/s6.png',num:1,price:0.03}
      // { id: 0, title: '新鲜芹菜 半斤', image: '/image/s5.png', num: 4, price: 0.01, selected: true }
    ]
  },

  onReady() {
    this.getTotalPrice();
  },
  onShow: function() {
    // wx.cloud.init();
    var self = this;
    var orders_1 = [];
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'get_openid',
      complete: res => {

        var openId = res.result.userInfo.openId;
        // var openId = res.result.userInfo.appId;
        this.setData({
          // appId: appId,
          openId: openId

        })
        app.globalData.openId = openId;
        console.log('云函数获取到的openid ', openId, res.result.userInfo)
      }
    });
    for (var key in cart_totalNums) {
      var selected = cart_totalNums[key]["selected"];
      if (selected) {
        orders_1.push(cart_totalNums[key]);
        // console.log("selected orders_1==", selected, orders_1);
      }
      // console.log("orders_1==", orders_1);
      self.setData({
        orders: orders_1,
        // hasAddress: true
      })
    };
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },
  /**
   * 发起支付请求
   */
  toPay() {

    var resp = {}
    resp["total"] = this.data.total;
    resp["address"] = this.data.address;
    resp["orders"] = this.data.orders;
    resp["openId"] = this.data.openId;
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
      success: function(res) {
        console.log(' wx.request=unifiedorder=成功了111==', res);
        var result_xml = res.data;
        var xml_parser = new parser.DOMParser();
        var xml = xml_parser.parseFromString(result_xml);
        var return_xml = xml_parser.parseFromString(bodyData);
        var out_trade_no = return_xml.getElementsByTagName('out_trade_no')[0].firstChild.nodeValue;
        var total_fee = return_xml.getElementsByTagName('total_fee')[0].firstChild.nodeValue;
        console.log("out_trade_no==openId==22222=", out_trade_no);
        var orders_list_String = {};
        orders_list_String.openId = total_fee;
        orders_list_String.out_trade_no = out_trade_no;

        console.log("orders_list_String=111111111111111111==", orders_list_String)
        
        // 云数据库初始化
        const db = wx.cloud.database({
          env: "wxc6c41875b492a9c0-1c74f6"
        });
        const orders_list = db.collection('orders_list');
        orders_list.add({
          // data 字段表示需新增的 JSON 数据
          // data: JSON.parse(orders_list_String)
          data: orders_list_String

        }).then(res => {
          console.log("DATASET==res==orders_list_String===", res, orders_list_String)
        }).catch(err => {
          console.log("DATASET==res==orders_list_String===", err, orders_list_String)
        })
        // console.log(' result_xmldata=return_xml=', result_xml, return_xml);
        var nonce_str_s = xml.getElementsByTagName('nonce_str');
        var prepay_id_s = xml.getElementsByTagName('prepay_id');
        var appId = app.globalData.appId;
        var nonceStr = nonce_str_s[0].firstChild.nodeValue; // 随机字符串
        var timeStamp =String(Math.round(new Date().getTime())); // 时间戳
        var package_valus = 'prepay_id=' + prepay_id_s[0].firstChild.nodeValue; // 统一下单接口返     
        var Apikey = app.globalData.Apikey;
        // paySign = MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6
        var paysign_temp = ("appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + package_valus + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + Apikey); // 签名
        console.log("paysign_temp==1111===", paysign_temp);
        // var paySign = md5.hexMD5(paysign_temp).toUpperCase();
        var paySign = md5_2.md5(paysign_temp).toUpperCase();
        // console.log("timeStamp, nonceStr, package_valus, paySign==1111===", timeStamp, nonceStr, package_valus, paySign);
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: package_valus,
          signType: 'MD5',
          paySign: paySign,
          success: function(res) {
            console.log("res==支付调用成功11==", res)
           
          },
          fail: function(res) {
            console.log("res=fail=22==", res);
            wx.showModal({
              title: '支付提示',
              content: '微信支付失败，请联系管理员!',
              showCancel: false
            })
          }
        })

      },
      fail: function(res) {
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
  // toPay() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '本系统只做演示，支付系统已屏蔽',
  //     text: 'center',
  //     complete() {
  //       wx.switchTab({
  //         url: '/page/component/user/user'
  //       })
  //     }
  //   })
  // }
})