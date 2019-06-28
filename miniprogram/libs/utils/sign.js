/*
 * 根据openid 发起微信支付  
 */
// var md5 = require("../utils/md5.js");
var md5_2 = require("../utils/md5_2.js");
var utils = require("../utils/utils.js");
var parser = require("../xmldom/dom-parser.js");


function wxpay_getbodyData(req) {

  // var timestamp = Math.round(new Date().getTime() / 1000); // 当前时间10位
  var timestamp = Math.round(new Date().getTime()); // 当前时间13位
  var date_str = utils.format_date(new Date()); //// 当前时间，年月日时分秒毫秒201704151043256
  var openid = req.openId; //oMmrX5WmrqvJgqR7yQQh5AZYoJtU
  var total_fee = (req.total) * 100; // 订单价格 单位是 分

  // var spbill_create_ip = req.ip.replace(/::ffff:/, ''); // 获取客户端ip
  var phone = req.address.phone;
  var shop = req.address.shop;
  // var store_info = req.address;
  if (req.orders){
    var body = req.orders[0]["name"]+"..."; // 商品描述/// req.address.shop +
  }else{
    var body = req.bannerdata["name"]
  }
  if (shop) {
    var shop_splits = shop.split("-");
    var shop_end = shop_splits[shop_splits.length-1];
    console.log("shop,shop_end=shop.split()==", shop, shop_splits,shop_end)
    body = shop_end +"："+ body;
  }
  else{
    body = "无门店：" + body;
  }
  // console.log("body=bodybodybodybodybody=========", body);
  var notify_url = 'https://apis.map.qq.com/api/wxpay' // 支付成功的回调地址  可访问 不带参数
  var nonce_str = String(timestamp) + utils.RandomNumBoth(10000, 99999); // 随机字符串
  var out_trade_no = date_str + utils.RandomNumBoth(10000, 99999); // 商户订单号（按自己需要生成）
  if (phone) {
    nonce_str += phone;
  }

  var appid = "wxc6c41875b492a9c0"; //appId:'wxc6c41875b492a9c0',
  var mch_id = "1529712601"; //商户号
  var Apikey = "symeiyu1357048216039688322766666"; //不同于AppSecret(小程序密钥)#sy89667567	#api 密钥 
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

  

  var stringSignTemp = sign_body + "&key=" + Apikey;
  console.log("sign_body==stringSignTemp==", sign_body, stringSignTemp);
  // var sign = md5.hexMD5(stringSignTemp).toUpperCase();
  var sign = md5_2.md5(stringSignTemp).toUpperCase();
  bodyData += '<sign>' + sign + '</sign>';
  bodyData += '</xml>';

  console.log("bodyData=befor==", bodyData);
  return bodyData;
  
}

module.exports = {
  wxpay_getbodyData: wxpay_getbodyData
}