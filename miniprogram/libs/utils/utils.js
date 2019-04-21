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
  var date = String(year) + month + day + hour + minute + second + Millisecond
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
module.exports = {
  formatTime: formatTime,
  format_date: format_date,
  RandomNumBoth: RandomNumBoth
}