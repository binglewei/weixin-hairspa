function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// function format_data(date) {
  
//   // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
function format_date(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond=date.getMilliseconds()
  // var date = String(year) + month + day + hour + minute + second + Millisecond
  var date = [year, month, day, hour, minute, second , Millisecond].map(formatNumber).join("")
  return date
  }
function format_date_2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond = date.getMilliseconds()
  var date = [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second, Millisecond].map(formatNumber).join(':')
  return date
}
function format_date_3(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond = date.getMilliseconds()
  var date = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second, Millisecond].map(formatNumber).join(':')
  return date
}
function format_date_4(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond = date.getMilliseconds()
  var date = [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return date
}
function format_date_5(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var Millisecond = date.getMilliseconds()
  var date = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return date
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function RandomNumBoth(Min, Max) {

  var Range = Max - Min;

  var Rand = Math.random();

  var num = Min + Math.round(Rand * Range); //四舍五入

  return num;

}
//云开发初始化
wx.cloud.init()

//使用和云函数
function login() {
 wx.cloud.callFunction({
    name: 'login'
  })
}
module.exports = {
  formatTime: formatTime,
  format_date: format_date,
  format_date_2: format_date_2,
  format_date_3: format_date_3,
  format_date_4: format_date_4,
  format_date_5: format_date_5,
  RandomNumBoth: RandomNumBoth,
  
}