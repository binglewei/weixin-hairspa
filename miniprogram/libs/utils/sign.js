/*
 * 根据openid 发起微信支付  
 */
// var config=require('/../../../../../')
var md5 = require("../utils/md5.js");
var utils = require("../utils/utils.js");
var parser = require("../xmldom/dom-parser.js");


// /**
//  * @method login
//  * @return {} promise对象，包含openid,appid
//  * @desc 用户登陆
// */
// var login = async () => {
//   return await wx.cloud.callFunction({
//     name: 'login'
//   })
// };
function wxpay(req) {
  var returnValue = {};
  // var timestamp = Math.round(new Date().getTime() / 1000); // 当前时间
  var timestamp = Math.round(new Date().getTime()); // 当前时间
  var date_str = utils.format_date(new Date()); //// 当前时间，年月日时分秒
  // var param = req.query || req.params;

  var openid = req.openId; //oMmrX5WmrqvJgqR7yQQh5AZYoJtU
  var total_fee = (req.total) * 100; // 订单价格 单位是 分

  // var spbill_create_ip = req.ip.replace(/::ffff:/, ''); // 获取客户端ip

  var body = "test"; // 商品描述

  var notify_url = 'https://apis.map.qq.com/api/wxpay' // 支付成功的回调地址  可访问 不带参数
  var nonce_str = String(timestamp) + utils.RandomNumBoth(10000, 99999); // 随机字符串
  var out_trade_no = date_str + utils.RandomNumBoth(10000, 99999); // 商户订单号（按自己需要生成）
  var phone = req.address.phone;
  if (phone) {
    nonce_str += phone;
    // out_trade_no += req.address.
  }
  // console.log("nonce_str=out_trade_no===", timestamp, date_str,nonce_str, out_trade_no);

  var appid = "wxc6c41875b492a9c0"; //appId:'wxc6c41875b492a9c0',
  var mch_id = "1529712601"; //商户号
  var bodyData = '<xml>';
  bodyData += '<appid>' + appid + '</appid>'; // 小程序ID
  bodyData += '<body>' + body + '</body>'; // 商品描述
  bodyData += '<mch_id>' + mch_id + '</mch_id>'; // 商户号
  bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
  bodyData += '<notify_url>' + notify_url + '</notify_url>'; // 支付成功的回调地址 
  bodyData += '<openid>' + openid + '</openid>'; // 用户标识
  bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'; // 商户订单号
  // bodyData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>'; // 终端IP
  bodyData += '<total_fee>' + total_fee + '</total_fee>'; // 总金额 单位为分
  bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI

  // 签名

  var sign_body = ("appid=" + appid + "&body=" + body + "&mch_id=" + mch_id + "&nonce_str=" + nonce_str + "&notify_url=" + notify_url + "&openid=" + openid + "&out_trade_no=" + out_trade_no + "&total_fee=" + total_fee + "&trade_type=JSAPI");

  var Apikey = "symeiyu1357048216039688322766666"; //不同于AppSecret(小程序密钥)#sy89667567	#api 密钥 

  var stringSignTemp = sign_body + "&key=" + Apikey;
  console.log("sign_body==stringSignTemp==", sign_body, stringSignTemp);
  var sign = md5.hexMD5(stringSignTemp).toUpperCase();
  // var sign = paysignjsapi(
  //   appid,
  //   body,
  //   mch_id,
  //   nonce_str,
  //   // notify_url,
  //   // openid,
  //   out_trade_no,
  //   // spbill_create_ip,
  //   total_fee
  // );
  // console.log("sign==", sign);
  bodyData += '<sign>' + sign + '</sign>';
  bodyData += '</xml>';
  // 微信小程序统一下单接口
  // https://api.mch.weixin.qq.com/pay/unifiedorder

  var urlStr = "https://api.mch.weixin.qq.com/pay/unifiedorder";
  console.log("bodyData=befor==", bodyData);
  wx.request({
    url: urlStr,
    data: bodyData,
    header: {},
    method: 'POST',
    // dataType: 'xml',
    // responseType: 'text',
    success: function(res) {
      console.log(' wx.request==成功了111==', res);
      var result_xml = res.data;
      var xml_parser = new parser.DOMParser();
      var xml = xml_parser.parseFromString(result_xml);
      var nonce_str_s = xml.getElementsByTagName('nonce_str');
      var prepay_id_s = xml.getElementsByTagName('prepay_id');
      // console.log("prepay_id[0]======", prepay_id_s[0]);
      returnValue.out_trade_no = out_trade_no; // 商户订单号
      returnValue.appId = appid;
      returnValue.nonceStr = nonce_str_s[0].firstChild.nodeValue; // 随机字符串
      returnValue.timeStamp = timestamp.toString(); // 时间戳
      returnValue.package = 'prepay_id=' + prepay_id_s[0].firstChild.nodeValue; // 统一下单接口返回的 prepay_id 参数值
      // paySign = MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6
      var paysign_temp = ("nonceStr=" + returnValue.nonceStr + "&package=" + returnValue.package + "&signType=MD5&             timeStamp=" + returnValue.timeStamp + "&key=" + Apikey); // 签名  appId=" + returnValue.appId + "
      console.log("paysign_temp=====", paysign_temp);
      returnValue.paySign = md5.hexMD5(paysign_temp).toUpperCase();
      // console.log(" returnValue.paySign=====", returnValue.paySign);
      console.log(" returnValue=====", returnValue);
      return returnValue;

    },
    fail: function(res) {
      console.log(' wx.request==出错了22==', res);
      return error
    },
    complete: function(res) {
      // console.log('complete==3333==', res);
    },
  });
  // return returnValue;
  // console.log(" returnValue===22222222222222222222222222==", returnValue);
  // return new Promise(function(resolve, reject) {
  //   wx.request({
  //       url: urlStr,
  //       method: 'POST',
  //       body: bodyData
  //     },
  //     function(error, response, body) {
  //       if (!error && response.statusCode == 200) {
  //         var returnValue = {};
  //         parseString(body, function(err, result) {
  //           if (result.xml.return_code[0] == 'SUCCESS') {
  //             returnValue.msg = '操作成功';
  //             returnValue.status = '100';
  //             returnValue.out_trade_no = out_trade_no; // 商户订单号
  //             returnValue.total_fee = total_fee; // 交易金额
  //             // 小程序 客户端支付需要 nonceStr,timestamp,package,paySign  这四个参数
  //             returnValue.nonceStr = result.xml.nonce_str[0]; // 随机字符串
  //             returnValue.timestamp = timestamp.toString(); // 时间戳
  //             returnValue.package = 'prepay_id=' + result.xml.prepay_id[0]; // 统一下单接口返回的 prepay_id 参数值
  //             // returnValue.paySign = paysignjs(config.Mch_appid, returnValue.nonceStr, returnValue.package, 'MD5', timestamp); // 签名
  //             resolve(JSON.stringify(returnValue))
  //           } else {
  //             returnValue.msg = result.xml.return_msg[0];
  //             returnValue.status = '102';
  //             reject(JSON.stringify(returnValue))
  //           }
  //         });
  //       }
  //     })
  // }).catch(function(error) { //加上catch 
  //   console.log('error==出错了==', error);
  //   return error
  // })
}

module.exports = {
  wxpay: wxpay
}