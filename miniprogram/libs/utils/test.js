var requestp = require('request-promise');
var fs = require('fs'); // 载入fs模块

var wxapi = {};
module.exports = wxapi;
//获取二维码
wxapi.qrcode = async (ctx, next) => {
  //获取access_token
  var access_token = global.access_token
  var qrcodeurl = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + access_token
  let options = {
    method: 'POST',
    uri: qrcodeurl,
    encoding: null,
    body: {
      "path": 'pages/index/index?openid=' + ctx.query.openid,//带参数的path
      "width": 280,
      "is_hyaline": false
    },
    json: true
  }
  var imgname = './public/images/' + ctx.query.openid + '.jpg'
  var imgnameback = ctx.query.openid + '.jpg'
  fs.exists(imgname, function (exists) {
    //判断图片是否存在
    if (!exists) {
      //通过微信接口获取小程序码
      requestp(options)
        .then(function (body) {
          var base64Img = body.toString('base64');  // base64图片编码字符串
          var dataBuffer = new Buffer(base64Img, 'base64');
          //保存到本地
          fs.writeFile(imgname, dataBuffer, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("保存成功！");
            }
          });
        })
        .catch(function (err) {
          console.log(err)
        });
    }
  })
  //返回图片名
  ctx.body = {
    code: 1,
    img: imgnameback
  }
};