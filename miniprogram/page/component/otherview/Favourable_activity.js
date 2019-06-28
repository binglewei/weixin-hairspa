// miniprogram/page/otherview/Favourable_activity.js
var util = require('../../../libs/utils/utils.js');
// var md5 = require('../../../libs/utils/md5.js');
var md5_2 = require('../../../libs/utils/md5_2.js');
var sign = require('../../../libs/utils/sign.js');
var parser = require("../../../libs/xmldom/dom-parser.js");
// var Poster = require('../../../miniprogram_dist/poster/poster.js');
import Poster from '../../../miniprogram_dist/poster/poster';
// var fs = require('fs');


var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_urls: [],
    bannerdata: [],
    posterConfig: [],
    userInfo: {},
    url_id: "",
    jumpUrl: "",
    retailPrice: "",
    tempFilePath: "",
    // url_type:0,
    // jump_imag_height:500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function() {
      wx.hideLoading()
      // wx.navigateBack();
    }, 3000);


    if (options.scene) {
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      const scene = decodeURIComponent(options.scene)
      url_id = scene;
      console.log("optionsoptionsoptions=1111111111111111=", options, url_id)
    } else {
      var url_id = options.url_id;
      console.log("optionsoptionsoptions=222222222222222=", options, url_id)
    }
    var self = this;
    wx.getUserInfo({
      lang: "zh_CN",
      withCredentials: true,
      success: function(res) {
        app.globalData.userInfo = res.userInfo;
        self.setData({
          userInfo: res.userInfo,
        });
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: "请先点击 “我的》个人设置” 获取授权并完善个人信息哦！！",
          showCancel: false
        })
      }
    });
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6" // 环境ID：wxc6c41875b492a9c0-1c74f6
    });
    //拿到表
    const banner_urls_data = db.collection('banner_urls');
    banner_urls_data.get({
      success: function(res) {
        var banner_urls_1 = res.data;
        for (var bann in banner_urls_1) {
          var id = banner_urls_1[bann]["_id"];
          if (id == url_id) {
            var jumpUrl = banner_urls_1[bann]["jumpUrl"];
            var retailPrice = banner_urls_1[bann]["retailPrice"];
            self.setData({
              url_id: url_id,
              banner_urls: banner_urls_1,
              jumpUrl: jumpUrl,
              bannerdata: banner_urls_1[bann],
              retailPrice: retailPrice,
            })
            // console.log('banner_urls=====22/2222===22222/22== ', self.data);
          }
        }

      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });


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
    console.log("self.data=====", this.data)
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
  onShareAppMessage: function(res) {
    var self = this;
    var bannerdata = self.data.bannerdata;
    console.log("bannerdata===", self.data, bannerdata);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target.id)
      console.log(res.from)
      //区分按钮分享
      if (res.target.id === "btn") {
        return {
          title: bannerdata.name,
          // path: '/pages/title/title',
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }
    }
    //右上角分享
    return {
      title: bannerdata.name,
      // path: `pages/index/index`,
      // imageUrl: ``,
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  /**
   * 发起支付请求
   */
  toPay(e) {
    
    var resp = {}
    var self = this;
    if (self.data.bannerdata.limit){
      var limit = self.data.bannerdata.limit;
      // 云数据库初始化
      const db = wx.cloud.database({
        env: "wxc6c41875b492a9c0-1c74f6"
      });
      const orders_list = db.collection('orders_list');
      orders_list.where({
        //查询支付成功的订单
        status:0,
        // _openid: app.globalData.openId
      }).orderBy('out_trade_no', 'desc').get({
        success: res => {
          var data = res.data;
          if (data.length > 0) {
            // 有支付成功的订单  
          }
          //  else {
          //   this.setData({
          //     // reservation_list: data,
          //     hasList: false
          //   })
          // }

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
    
    }
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
      success: function(res) {
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
          success: function(res) {
            console.log("res==支付调用成功11==", res)
            orders_list_String.status_describe = "支付成功";
            orders_list_String.status = 0;
            orders_list_String.expense = 1;
            orders_list_String.expense_describe = "未消费";
            orders_list_String.expense_time = "";
            orders_list_String.pay_time = util.format_date_5(new Date());

          },
          fail: function(res) {
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
            } else {
              wx.showModal({
                title: '支付提示',
                content: '微信支付失败，请联系管理员!',
                showCancel: false
              })
            }

          },
          complete: function(res) {
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
      fail: function(res) {
        console.log(' wx.request==出错了22==', res);
        wx.showModal({
          title: '支付提示',
          content: '订单生成失败，请联系管理员!',
          showCancel: false
        })
      },
      complete: function(res) {
        // console.log('complete==3333==', res);

      },
    });


  },

  // get_qrcode(e) {
  //   onsole.log("get_qrcode===", e);
  //   wx.cloud.init();
  //   wx.cloud.callFunction({
  //     // 要调用的云函数名称
  //     name: 'get_wxQRcode',
  //     data: e,
  //   }).then(res => {
  //     console.log("wx.cloud.callFunction===", res)
  //   }).catch(err => {
  //     // console.error("DATASET==res==confirm_reservation_data===", err, confirm_reservation_data)
  //   });
  // },
  // initCanvas() {
  //   var self = this;

  //   var generate_codeimg = self.data.bannerdata.generate_codeimg;
  //   console.error("DATASET==res==confirm_reservation_data===", generate_codeimg)
  // var url_id = self.data.url_id;
  // const db = wx.cloud.database({
  //   env: "wxc6c41875b492a9c0-1c74f6"
  // });
  // const publicField = db.collection('publicField');
  // publicField.where({
  //   type: 1
  // }).get({
  //   success: res => {

  //     var in_params = {};
  //     var access_token = res.data[0].access_token;
  //     var page = "page/component/otherview/Favourable_activity";
  //     in_params.access_token = access_token;
  //     in_params.scene = "url_id=" + url_id;
  //     in_params.page = page;
  //     // console.log("in_params=before==============", in_params);
  //     // var qrCodeUrl = self.get_qrcode(in_params);
  //     wx.cloud.init();
  //     wx.cloud.callFunction({
  //       // 要调用的云函数名称
  //       name: 'get_wxQRcode',
  //       data: in_params,
  //     }).then(res => {
  //       // console.log("wx.cloud.callFunction===", res);
  //       var qrCodeUrl = res.result; //result.buffer
  //       // console.log("wx.cloud.callFunction=qrCodeUrl=222222222222222222=", generate_codeimg, qrCodeUrl);
  //       var ctx = wx.createCanvasContext('generate')
  //       ctx.drawImage(generate_codeimg, 0, 0, 750, 1148)  //画海报
  //       ctx.drawImage(qrCodeUrl, 300, 886, 150, 150)  //画二维码
  //       ctx.draw()
  //       self.save() //生成微信临时模板文件path
  //     }).catch(err => {
  //       // console.error("DATASET==res==confirm_reservation_data===", err, confirm_reservation_data)
  //     });

  //   }
  //   });

  // },
  // save() {
  //   var self = this;
  //   setTimeout(() => {
  //   wx.canvasToTempFilePath({
  //     x: 0,
  //     y: 0,
  //     width: 241,
  //     height: 368,
  //     destWidth: 241,
  //     destHeight: 368,
  //     canvasId: 'poster',
  //     success: function(res) {
  //       console.log('save=============================', res.tempFilePath)
  //       self.saveUrl = res.tempFilePath; //保存临时模板文件路径
  //       self.setData({
  //         tempFilePath: res.tempFilePath
  //       })
  //     },
  //     fail: function(res) {
  //       wx.showToast({
  //         title: '网络繁忙',
  //         icon: 'none'
  //       })
  //       return
  //     }
  //   })
  //   }, 500)
  // },
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  toShare(e) {
    var self = this;
    var url_id = self.data.url_id;
    // const db = wx.cloud.database({
    //   env: "wxc6c41875b492a9c0-1c74f6"
    // });
    // const publicField = db.collection('publicField');
    // publicField.where({
    //   type: 1
    // }).get({
    //   success: res => {
    //     var in_params = {};
    //     var access_token = res.data[0].access_token;
    //     var page = "page/component/otherview/Favourable_activity";
    //     in_params.access_token = access_token;
    //     in_params.scene = url_id;
    //     in_params.page = page;
    //     // console.log("in_params=before==============", in_params);
    //     // var qrCodeUrl = self.get_qrcode(in_params);
    //     wx.cloud.init();
    //     wx.cloud.callFunction({
    //       name: 'get_wxQRcode',
    //       data: in_params,
    //     }).then(res => {
    //       var origin_buffer = res.result; //result.buffer
    //       console.log("res=origin_buffer=111111=", origin_buffer);


    //     }).catch(err => {
    //       console.error("catch(err =>===", err)
    //     })

    //   }
    // });
    if (self.data.userInfo){
      var nickName = self.data.userInfo.nickName;
      var avatarUrl = self.data.userInfo.avatarUrl;
    }else{
      var nickName = "丝美域";
      var avatarUrl = "https://7778-wxc6c41875b492a9c0-1c74f6-1258881596.tcb.qcloud.la/sy_banner/code/weixin_publi.jpg";
    };
    if (self.data.bannerdata.generate_codeimg){
      var generate_codeimg = self.data.bannerdata.generate_codeimg
    }else{
      var generate_codeimg = "https://7778-wxc6c41875b492a9c0-1c74f6-1258881596.tcb.qcloud.la/sy_banner/code/QRcode_default.jpg?sign=43cd413b300c313f724ffe7ebb056953&t=1558669645"
    }
    if (self.data.bannerdata.QRcode_img){
      var qrcode_text = '长按识别小程序码'
      var qrcode_img = self.data.bannerdata.QRcode_img;
    }else{
      var qrcode_text = '长按识别公众号码'
      var qrcode_img= "https://7778-wxc6c41875b492a9c0-1c74f6-1258881596.tcb.qcloud.la/sy_banner/code/weixin_publi.jpg?sign=778707eca6eca122fda451f0e517ce22&t=1558664950"
    }
    if (self.data.bannerdata.retailPrice){
      var retailPrice = self.data.bannerdata.retailPrice;
      var retailPrice_prefor = '惊喜价￥';
      var fontSize_price_prefor=30;
      var fontSize_price=50;
      var marginLeft_price = 30;

    }else{
      var retailPrice = "成就你我他！";
      var retailPrice_prefor = '分享快乐，';
      var fontSize_price_prefor = 30;
      var fontSize_price = 30;
      var marginLeft_price= 0;
    }
      
    var Config = {
      width: 750,
      height: 1334,
      backgroundColor: '#fff',
      debug: false,
      blocks: [{
          width: 690,
          height: 808,
          x: 30,
          y: 183,
          borderWidth: 2,
          borderColor: '#f0c2a0',
          borderRadius: 20,
        },
        {
          width: 634,
          height: 74,
          x: 59,
          y: 770,
          backgroundColor: '#fff',
          opacity: 0.5,
          zIndex: 100,
        },
      ],
      texts: [{
          x: 113,
          y: 61,
          baseLine: 'middle',
          // text: '伟仔',
          text: nickName,
          fontSize: 32,
          color: '#8d8d8d',
        },
        {
          x: 30,
          y: 113,
          baseLine: 'top',
          text: '发现一个好物，推荐给你呀！',
          fontSize: 38,
          color: '#080808',
        },
        // {
        //   x: 92,
        //   y: 810,
        //   fontSize: 38,
        //   baseLine: 'middle',
        //   text: '标题标题标题标题标题标题标题标题标题',
        //   width: 570,
        //   lineNum: 1,
        //   color: '#8d8d8d',
        //   zIndex: 200,
        // },
        {
          x: 59,
          y: 895,
          baseLine: 'middle',
          text: [{
            text: retailPrice_prefor,
            fontSize: fontSize_price_prefor,
              color: '#ec1731',
            },
            {
              text: retailPrice,
              fontSize: fontSize_price,
              color: '#ec1731',
              marginLeft: marginLeft_price,
            }
          ]
        },
        // {
        //   x: 522,
        //   y: 895,
        //   baseLine: 'middle',
        //   text: '已拼2件',
        //   fontSize: 28,
        //   color: '#929292',
        // },
        {
          x: 150,
          y: 970,
          baseLine: 'middle',
          textAlign:"center",
          // text: self.data.bannerdata.name,
          text: [{
              text: self.data.bannerdata.name,
              fontSize: 38,
              // color: '#929292',
            },
            // {
            //   text: '七天退货',
            //   fontSize: 28,
            //   color: '#929292',
            //   marginLeft: 50,
            // },
            // {
            //   text: '运费险',
            //   fontSize: 28,
            //   color: '#929292',
            //   marginLeft: 50,
            // },
          ]
        },
        {
          x: 360,
          y: 1065,
          baseLine: 'top',
          text: qrcode_text,
          fontSize: 38,
          color: '#080808',
        },
        {
          x: 360,
          y: 1123,
          baseLine: 'top',
          text: '加入丝美域，成就好未来！',
          fontSize: 28,
          color: '#929292',
        },
      ],
      images: [{
          width: 62,
          height: 62,
          x: 30,
          y: 30,
          borderRadius: 62,
          url: avatarUrl,
        },
        {
          width: 634,
          height: 634,
          x: 59,
          y: 210,
          url: generate_codeimg,
        },
        {
          width: 220,
          height: 220,
          x: 92,
          y: 1020,
          // 
          url: qrcode_img,
        },
        // {
        //   width: 750,
        //   height: 90,
        //   x: 0,
        //   y: 1244,
        //   url: 'https://lc-I0j7ktVK.cn-n1.lcfile.com/67b0a8ad316b44841c69.png',
        // }
      ]
    };
    wx.showActionSheet({
      itemList: ['点右上角转发给好友', '生成本地分享海报'],
      success(res) {
        var tapIndex = res.tapIndex;
        if (tapIndex == 0) {
          console.log("success(res)=ifififififif=", tapIndex)
          wx.showShareMenu({
            withShareTicket: true
          })
        } else if (tapIndex == 1) {

          console.log("success(res)=elseif ==tapIndex  =", tapIndex)
          wx.showLoading({
              title: '下载中...'
            })
          /**
           * 异步生成海报
           */
          setTimeout(function () {
            wx.hideLoading()
            // wx.navigateBack();
          }, 2000);
          console.log("sConfigConfig  =", Config)
          self.setData({
            posterConfig: Config
          }, () => {
            Poster.create(true); // 入参：true为抹掉重新生成 
          });
          // // saveImageToPhotosAlbum() {
          // self.initCanvas();

          // setTimeout(() => {
          //   console.log("self.saveUrl=========", self.data.tempFilePath);
          //   wx.showLoading({
          //     title: '下载中...'
          //   })
          // wx.downloadFile({
          //   url: self.data.tempFilePath,
          //   success: function(res) {
          //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          //     if (res.statusCode === 200) {
          //       wx.saveImageToPhotosAlbum({
          //         filePath: res.tempFilePath,
          //         success(result) {
          //           wx.hideLoading()
          //           wx.showToast({
          //             title: '已保存至相册',
          //             icon: 'none',

          //           })

          //         },
          //         fail(result) {
          //           wx.hideLoading()
          //           wx.showToast({
          //             title: '下载失败',
          //             icon: 'none',

          //           })

          //         }
          //       })
          //     }
          //   },
          //   fail(result) {
          //     wx.hideLoading()
          //     wx.showToast({
          //       title: '下载失败',
          //       icon: 'none',

          //     })

          //   }
          // })
          // }, 10000)

        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})