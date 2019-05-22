// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(" console.log(event)==inin=1111=", event);
  var access_token = event.access_token;
  var page = event.page;
  var scene = event.scene;
  res = await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + access_token,
    body: {
      scene: scene,
      page: page,
      auto_color:true,
    }
  })
  return res
}