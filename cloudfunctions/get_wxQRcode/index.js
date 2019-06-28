// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
// const axios = require('axios')
const fs = require('fs');
cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   console.log(" console.log(event)==inin=1111=", event);
//   var access_token = event.access_token;
//   var page = event.page;
//   var scene = event.scene;
//   try {
//     const result = await cloud.openapi.wxacode.getUnlimited({
//       // access_token: access_token,
//       scene: scene,
//       page: page,
//     })
//     console.log(result)
//     return result
//   } catch (err) {
//     console.log(err)
//     return err
//   }
// }
/*
function getQRCode (url, token) {
  const options = {
    method: 'post',
    url: `${url}?access_token=${token}`,
    data: JSON.stringify({
      path: 'pages/index/index'
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'stream'
  }

  axios(options).then((res) => {
    const rs = res.data
    const ws = fs.createWriteStream(`${__dirname}/wx_qrcode_${new Date().getTime()}.png`)
    rs.pipe(ws)
    console.log(`已获取二维码，保存路径为 ${__dirname}`)
  })
}


*/


exports.main = async(event, context) => {
  console.log(" console.log(event)==inin=1111=", event);
  var access_token = event.access_token;
  var page = event.page;
  var scene = event.scene;
  res = await rp({
    json: true,
    responseType: 'stream',
    method: 'POST',
    uri: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token,
    body: {
      scene: scene,
      page: page,
      // auto_color:true,
    }
  })
  var origin_buffer = res;
  var base64Image = new Buffer(origin_buffer).toString('base64');
  // var base64Image = origin_buffer.toString('base64')
  // console.log("base64Image==========", base64Image);
  // console.log("Buffer.compare(=====",new Buffer.compare(origin_buffer, decodeImg));  // 0 表示一样

  var path = scene + '.png'; //路径从app.js级开始找--
  var base64 = base64Image.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
  var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
  console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer)); // 输出是否是buffer对象
  fs.writeFile(path, dataBuffer, function(err) { //用fs写入文件
    console.log("开始写了！！！writeFile！")
    if (err) {
      console.log("errerr==出错了==",err);
    } else {
      console.log('写入成功！');
    }
  });

  return path

}