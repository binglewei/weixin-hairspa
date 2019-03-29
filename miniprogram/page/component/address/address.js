// page/component/new-pages/user/address/address.js
Page({
  data: {
    address: {
      name: '',
      phone: '',
      detail: ''
    }
  },
  onLoad() {
    var self = this;

    wx.getStorage({
      key: 'address',
      success: function(res) {
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
    if (name && phone && detail) {
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
        content: '请填写完整资料',
        showCancel: false
      })
    }
  },
  getVerificationCode (e) {
    var reg = /^1[3|4|5|7|8][0-9]{9}$/
    var phone = this.data.phone
    var flag = reg.test(phone)
    if (flag) {
      var that = this
      var code
      this.setData({
        isValated: true
      })
    } else {
      Toast({
        message: '请输入正确的手机号',
        selector: '#zan-toast-test'
      });

    }
  }
})

