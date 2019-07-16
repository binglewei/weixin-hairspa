// page/component/new-pages/user/address/address.js
var app = getApp();

Page({
  data: {
    // address: globalData_address
    picker1Value: 0,
    region: "",
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
    var shop_list = app.globalData.shop_list;
    var self = this;
    var shop_names = ['请选择门店'];
    for (var num in shop_list) {
      // console.log("shop====", num);
      var shop_name = shop_list[num]["shop_name"];
      // console.log("shop_name====", shop_name);
      shop_names.push(shop_name);
    };
    self.setData({
      picker1Range: shop_names,
    });
    // 云数据库初始化
    const db = wx.cloud.database();
    const address_list_data = db.collection('address_list');
    address_list_data.where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        // console.log("res.data===", res.data[0]);
        self.setData({
          address: res.data[0],
          picker_data: res.data[0].birthday,
          picker1Value: res.data[0].picker1Value
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    // wx.getStorage({
    //   key: 'address',
    //   success: function(res) {
    //     // console.log("addressdetail====", res.data),
    //     self.setData({
    //       address: res.data,
    //       picker_data: res.data.birthday,
    //       picker1Value: res.data.picker1Value
    //     })
    //   }
    // })
  },
  onShow(e) {
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
      // wx.navigateBack();
    }, 1000)
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
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e) {
    var self = this;
    const value = e.detail.value;
    console.log(" e.detail.value=formSubmit=", e);
    var phone = value.phone;
    var name = value.name;
    var remark = value.remark;
    var detail = value.detail;
    var picker1Value = this.data.picker1Value;
    var shop = this.data.picker1Range[picker1Value]; //shop
    var birthday = this.data.picker_data;
    value["birthday"] = birthday;
    value["picker1Value"] = picker1Value;
    value["shop"] = shop;
    value["remark"] = remark;
    // console.log("birthday=11shop11=", birthday, shop);
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
      // console.log("flag,addressdetail==11==", flag, value);
    } else if (!birthday) {
      wx.showModal({
        title: '错误提示',
        content: '生日是必填项哦！！',
        showCancel: false
      })
      // console.log("addressdetail==22==", value);

    } else if (!Number(picker1Value)) {
      wx.showModal({
        title: '错误提示',
        content: '请选择你喜欢的门店！！',
        showCancel: false
      })
      // console.log("addressdetail==333==", value, Number(picker1Value));
    } else {
      // console.log("addressdetail==else==", value);
      // 云数据库初始化
      const db = wx.cloud.database({
        env: "wxc6c41875b492a9c0-1c74f6"
      });
      value.update_date = new Date();
      // wx.getUserInfo({
      //   lang: "zh_CN",
      //   withCredentials: true,
      //   success: function (res) {
      //     value.userinfo = res.userInfo;
      //     app.globalData.userInfo = res.userInfo;
      //     self.setData({
      //       userInfo: res.userInfo,
      //     });
      //   },
      // });
      value.userInfo = app.globalData.userInfo;
      value.unionid = app.globalData.unionid;
      // console.log("addressdetail==value, app.globalData==", value.userInfo,value);
      const address_list_data = db.collection('address_list');
      address_list_data.where({
        _openid: app.globalData.openId
      }).get({
        success: res => {
          // this.setData({
          //   orders_list: res.data
          // })
          var len_data = res.data.length;
          // console.log("len_data====", res.data);
          if (len_data > 0) {
            console.log('[数据库] update: ', value)
            var id = res.data[0]["_id"]
            address_list_data.doc(id).update({
              // data 字段表示需新增的 JSON 数据
              // data: JSON.parse(orders_list_String)
              data: value

            }).then(res => {
              // console.log("DATASET==res==update=su、s==", res, value)
            }).catch(err => {
              console.error("DATASET==res==value===", err, value)
            })
          } else {
            console.log('[数据库] add: ',value);
            
            address_list_data.add({
              // data 字段表示需新增的 JSON 数据
              // data: JSON.parse(orders_list_String)
              data: value

            }).then(res => {
              // console.log("DATASET==res==value===", res, value)
            }).catch(err => {
              // console.error("DATASET==res==value===", err, value)
            })
          }
          // console.log('[数据库] [查询记录] 成功: ', res.data)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          // console.error('[数据库] [查询记录] 失败：', err)
        }
      });





      // wx.setStorage({
      //   key: 'address',
      //   data: value,
      //   success() {
      //     wx.navigateBack();
      //   }
      // })
      // new Date().t
      // sleep(3000);  //睡眠5秒
      wx.showLoading({
        title: '保存中',
      })

      setTimeout(function () {
        wx.hideLoading()
        wx.navigateBack();
      }, 1000)
      // setTimeout(function () {
      //   //要延时执行的代码
      //   wx.navigateBack();
      // }, 1000) //延迟时间 这里是1秒
      
    }
  }
  
})