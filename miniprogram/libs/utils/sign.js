/*
 * 根据openid 发起微信支付  
 */
// var config=require('/../../../../../')
function wxpay(req) {
  var param = req.query || req.params;

  var openid = req.request.body.openid;

  var total_fee = (req.request.body.total_fee) * 100; // 订单价格 单位是 分

  var spbill_create_ip = req.ip.replace(/::ffff:/, ''); // 获取客户端ip

  var body = '充值'; // 商品描述

  var notify_url = 'https://www.vajssa.cn/api/wxpay' // 支付成功的回调地址  可访问 不带参数

  var nonce_str = createNonceStr(); // 随机字符串

  var out_trade_no = wxConfig.getWxPayOrdrID(); // 商户订单号（按自己需要生成）

  var timestamp = Math.round(new Date().getTime() / 1000); // 当前时间
  
  var appid = "wxc6c41875b492a9c0";//appId:'wxc6c41875b492a9c0',
  var Mch_id = "1529712601";//商户号
  var bodyData = '<xml>';
  bodyData += '<appid>' + appid + '</appid>'; // 小程序ID
  bodyData += '<body>' + body + '</body>'; // 商品描述
  bodyData += '<mch_id>' + Mch_id + '</mch_id>'; // 商户号
  bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
  bodyData += '<notify_url>' + notify_url + '</notify_url>'; // 支付成功的回调地址 
  bodyData += '<openid>' + openid + '</openid>'; // 用户标识
  bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'; // 商户订单号
  bodyData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>'; // 终端IP
  bodyData += '<total_fee>' + total_fee + '</total_fee>'; // 总金额 单位为分
  bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI

  // 签名
  var sign = paysignjsapi(
    appid,
    body,
    Mch_id,
    nonce_str,
    notify_url,
    openid,
    out_trade_no,
    spbill_create_ip,
    total_fee
  );
  bodyData += '<sign>' + sign + '</sign>';
  bodyData += '</xml>';
  // 微信小程序统一下单接口https://api.mch.weixin.qq.com/pay/unifiedorder
  var urlStr = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
  
  return new Promise(function(resolve, reject) {
    request({
      url: urlStr,
      method: 'POST',
      body: bodyData
    }, 
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var returnValue = {};
        parseString(body, function(err, result) {
          if (result.xml.return_code[0] == 'SUCCESS') {
            returnValue.msg = '操作成功';
            returnValue.status = '100';
            returnValue.out_trade_no = out_trade_no; // 商户订单号
            returnValue.total_fee = total_fee; // 交易金额
            // 小程序 客户端支付需要 nonceStr,timestamp,package,paySign  这四个参数
            returnValue.nonceStr = result.xml.nonce_str[0]; // 随机字符串
            returnValue.timestamp = timestamp.toString(); // 时间戳
            returnValue.package = 'prepay_id=' + result.xml.prepay_id[0]; // 统一下单接口返回的 prepay_id 参数值
            returnValue.paySign = paysignjs(config.Mch_appid, returnValue.nonceStr, returnValue.package, 'MD5', timestamp); // 签名
            resolve(JSON.stringify(returnValue))
          } else {
            returnValue.msg = result.xml.return_msg[0];
            returnValue.status = '102';
            reject(JSON.stringify(returnValue))
          }
        });
      }
    })
  }).catch(function(error) { //加上catch 
    console.log('error=', error);
    return error
  })
}