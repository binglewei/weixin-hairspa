// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("wxContext====wxContext.UNIONID,==", wxContext,wxContext.UNIONID);
  return {
    event,
    openId: wxContext.OPENID,
    appId: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}


