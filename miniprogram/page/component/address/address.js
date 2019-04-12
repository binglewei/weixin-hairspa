// page/component/new-pages/user/address/address.js
var app = getApp();
var shop_list = app.globalData.shop_list;
Page({
  data: {
    // address: globalData_address
    picker1Value: 0,
    picker_data: '出生日期',
    // picker1Range: shop_list,
    picker1Range: ['请选择门店'],
    address: {
      name: '',
      phone: '',
      gender: '',
      birthday: '',
      detail: ''
    }
  },
  onLoad() {
    var self = this;
    var shop_names = ['请选择门店'];
    for (var num in shop_list) {
      console.log("shop====", num);
      var shop_name = shop_list[num]["shop_name"];
      console.log("shop_name====", shop_name);
      shop_names.push(shop_name);
    };
    self.setData({
      picker1Range: shop_names,
    });

    wx.getStorage({
      key: 'address',
      success: function(res) {
        console.log("addressdetail====", res.data),
          self.setData({
            address: res.data,
            picker_data: res.data.birthday,
            picker1Value: res.data.picker1Value
          })
      }
    })
  },
  normalPickerBindchange: function(e) {
    this.setData({
      picker1Value: e.detail.value
    })
  },
  datePickerBindchange: function(e) {
    // var address=this.address;
    // address.birthday = e.detail.value
    this.setData({
      picker_data: e.detail.value
      // address: address

    })
  },
  formSubmit(e) {
    const value = e.detail.value;
    console.log("formSubmit_e==", e);
    var phone = value.phone;
    var name = value.name;
    var detail = value.detail;
    var picker1Value = this.data.picker1Value;
    var shop = this.data.picker1Range[picker1Value]; //shop
    var birthday = this.data.picker_data;
    value["birthday"] = birthday;
    value["picker1Value"] = picker1Value;
    value["shop"] = shop;
    console.log("birthday=11shop11=", birthday, shop);
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

    if (!flag) {
      wx.showModal({
        title: '错误提示',
        content: '手机号不正确哦，请核对！',
        showCancel: false
      })
      console.log("flag,addressdetail==11==", flag, value);
    } else if (!birthday) {
      wx.showModal({
        title: '错误提示',
        content: '生日是必填项哦！！',
        showCancel: false
      })
      console.log("addressdetail==22==", value);
      
    } else if (!Number(picker1Value)) {
      wx.showModal({
        title: '错误提示',
        content: '请选择你喜欢的门店！！',
        showCancel: false
      })
      console.log("addressdetail==333==", value, Number(picker1Value));
    } else {
      console.log("addressdetail==else==", value);
      wx.setStorage({
        key: 'address',
        data: value,
        success() {
          wx.navigateBack();
        }
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