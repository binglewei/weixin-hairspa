// page/component/new-pages/user/address/address.js
// var app = getApp();
// var globalData_address = app.globalData.address;
Page({
  data: {
    // address: globalData_address
    address: {
      name: '',
      phone: '',
      gender: '',
      birthday:'',
      detail: ''
    }
  },
  onLoad() {
    var self = this;

    wx.getStorage({
      key: 'address',
      success: function(res) {
        console.log("addressdetail====", res.data),
        self.setData({
          address: res.data
        })
      }
    })
  },
  formSubmit(e) {
    const value = e.detail.value;
    var phone=value.phone;
    var name = value.name;
    var detail = value.detail;
    var birthday = value.birthday;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/
    var flag = reg.test(phone)
    // if (flag) {
    //   console.log("flag,addressdetail==11==", flag,value);
    // }  else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '手机号跟生日是必填项哦！！！',
    //     showCancel: false
    //   })
    // }
    if (flag) {
      // wx.setStorage({
      //   key: 'address',
      //   data: value,
      //   success() {
      //     wx.navigateBack();
      //   }
      // })
      console.log("flag,addressdetail==11==", flag, value);
    } else {
      wx.showModal({
        title: '错误提示',
        content: '手机号不正确，请核对！',
        showCancel: false
      })
      console.log("flag,addressdetail==222==", flag, value);
    };
    if (phone & birthday) {
      wx.setStorage({
        key: 'address',
        data: value,
        success() {
          wx.navigateBack();
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '手机号跟生日是必填项哦！！！',
        showCancel: false
      })
    }
  }
  // getVerificationCode (e) {
  //   var reg = /^1[3|4|5|7|8][0-9]{9}$/
  //   var phone = this.data.phone
  //   var flag = reg.test(phone)
  //   if (flag) {
  //     var that = this
  //     var code
  //     this.setData({
  //       isValated: true
  //     })
  //   } else {
  //     Toast({
  //       message: '请输入正确的手机号',
  //       selector: '#zan-toast-test'
  //     });

  //   }
  // }
})

