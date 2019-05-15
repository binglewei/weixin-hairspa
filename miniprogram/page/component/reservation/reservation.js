// miniprogram/page/component/reservation/reservation.js
// pages/orderTime/index.js
var utils = require('../../../libs/utils/utils.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    calendar: [],
    access_tokens: [],
    send_even: "",
    width: 0,
    address: {},
    shop_list: app.globalData.shop_list,
    hasAddress: false,
    currentIndex: 0,
    currentTime: 0,
    currentemployee: 0,
    employee_list: [],
    picker_prject_id: 0,
    picker_prject_Range: ["请选择你要预约的项目"],
    // picker_prject_Range: app.globalData.project_lists,
    timeArr: [{
        "time": "10:00",
        "status": ""
      },
      {
        "time": "10:30",
        "status": ""
      },
      {
        "time": "11:00",
        "status": ""
      },
      {
        "time": "12:00",
        "status": ""
      },
      {
        "time": "13:00",
        "status": ""
      },
      {
        "time": "14:00",
        "status": ""
      },
      {
        "time": "15:00",
        "status": ""
      },
      {
        "time": "16:00",
        "status": ""
      },
      {
        "time": "17:00",
        "status": ""
      },
      {
        "time": "18:00",
        "status": ""
      },
      {
        "time": "19:00",
        "status": ""
      },
      {
        "time": "20:00",
        "status": ""
      },
      {
        "time": "21:00",
        "status": ""
      },
      {
        "time": "22:00",
        "status": ""
      },
      // { "time": "21:00", "status": "" },

      // { "time": "8:00-22:00", "status": "约满" }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.setData({
      picker_prject_Range: app.globalData.project_lists
    });
    if (that.data.picker_prject_Range.length < 2) {
      // /刷新当前页面的数据
      console.log("=刷新当前页面的数据====");
      wx.request({
        url: "https://minipgm.siyuhome.net/rest/transmission/getProgramList?name=",
        data: "",
        header: {},
        method: 'GET',
        success: function(res) {
          // console.log("res=success=11==", res);
          var project_lists_sy = res.data
          // var product_list_1=app.globalData.product_list;
          app.globalData.project_lists = project_lists_sy;
          that.setData({
            picker_prject_Range: project_lists_sy,
            // project_lists: product_list_2,
            // product_list: product_list
          });
        },
        fail: function(res) {
          // console.log("res=fail=22==", res);
        },
        complete: function(res) {
          // console.log('complete==3333==', res);

        },
      });
      // getCurrentPages()[getCurrentPages().length - 1].onShow()//onShow()
    }

    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6"
    });
    const address_list_data = db.collection('address_list');
    address_list_data.where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log("res.data=111=rederbsyion=", res.data);
        var data = res.data[0];
        var len_data = res.data.length;
        if (len_data>0) {
          var picker_shop_id = Number(data.picker1Value);
          console.log('picker1Value=====：', picker_shop_id);
          that.setData({
            address: data,
            picker_shop_id: picker_shop_id,
            hasAddress: true
          })
          //拿到表
          // const seach_hot_data = db.collection('seach_hot');
          const employee_list_data = db.collection('employee_list');
          // console.log('picker1Value===2222==：', picker_shop_id);
          employee_list_data.where({
            shop_id: picker_shop_id
          }).get({
            success: function(res) {
              // console.log('[数据库] [查询banner_urls_data记录] 成功: ', res.data);
              var employee_list = res.data;
              // console.log('employee_list========== ', employee_list);
              // app.globalData.bannerUrls = banner_urls_1;
              that.setData({
                employee_list: employee_list,
                // product_list: product_list
              });
              // console.log('self.data.employee_list====3333333====== ', self.data.employee_list);
            },
            fail: function(res) {
              wx.showToast({
                icon: 'none',
                title: '查询护理师记录失败'
              })
              console.error('[数据库] [查询记录] 失败：', err)
            }
          });
        }else{
          wx.showModal({
            title: '门店信息为空',
            showCancel: true,
            content: "请您先选择要预约的门店，谢谢！",
            // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
            success: function (res) {
              if (res.confirm) {
                console.log('门店信息为空,用户点击确定')

              } else if (res.cancel) {
                console.log('门店信息为空,用户点击取消')
              }
            }
          })
        }

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        });
      },
    });
    // console.log('self.data====3333333==app.globalData==== ', that.data, app.globalData.project_lists);
    function getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }
    // 计算每月第一天是星期几
    function getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
    const date = new Date();
    // const date = new Date("Wed May 29 2019 13:40:31");
    // console.log("当前时间是===", date)
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const next_month = date.getMonth() + 2;
    const cur_date = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //利用构造函数创建对象
    function calendar(date, week) {
      this.date = cur_year + '-' + cur_month + '-' + date;
      if (date == cur_date) {
        this.week = "今天";
      } else if (date == cur_date + 1) {
        this.week = "明天";
        // } else if (date == cur_date + 2) {
        //   this.week = "后天";
      } else {
        this.week = '星期' + week;
      }
    }
    //当前月份的天数
    var monthLength = getThisMonthDays(cur_year, cur_month)
    //当前月份的第一天是星期几
    var week = getFirstDayOfWeek(cur_year, cur_month)
    var x = week;
    for (var i = 1; i <= monthLength; i++) {
      //当循环完一周后，初始化再次循环
      if (x > 6) {
        x = 0;
      }
      //利用构造函数创建对象
      that.data.calendar[i] = new calendar(i, [weeks_ch[x]][0])
      x++;
    }
    //限制要渲染的日历数据天数为7天以内（用户体验）
    var flag = that.data.calendar.splice(cur_date, that.data.calendar.length - cur_date <= 31 ? that.data.calendar.length : 31)
    that.setData({
      calendar: flag
    })
    //设置scroll-view的子容器的宽度
    that.setData({
      width: 186 * parseInt(that.data.calendar.length - cur_date <= 31 ? that.data.calendar.length : 31)
    })
    //  var self=this;
    //   var picker_shop_id = self.data.picker_shop_id;
    //   var shop = self.data.shop_list[picker_shop_id-1];
    console.log("this.data==this.data====", this.data)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  select: function(event) {
    //为上半部分的点击事件
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
    console.log(event.currentTarget.dataset.date)
  },
  selectTime: function(event) {
    //为下半部分的点击事件
    this.setData({
      currentTime: event.currentTarget.dataset.tindex
    })
    console.log(event, event.currentTarget.dataset.time)
  },
  selectemployee: function(event) {
    //处理选择护理师
    this.setData({
      currentemployee: event.currentTarget.dataset.index
    })
    console.log(event, event.currentTarget.dataset.employee_name)
  },
  normalPickerBindchange: function(e) {
    console.log("==normalPickerBindchange===", e, e.detail.value);
    this.setData({
      picker_prject_id: e.detail.value
    })
  },
  // submitInfo: function (e) {
  //   console.log('GG 敌方军团已同意投降 4票赞成 0票反对')
  //   console.log(e.detail.formId);
  // },
  confirm_reservation: function(e) {
    var self = this;
    var data = self.data;
    var form_id = e.detail.formId;

    var reservation_shop = data.address.shop;
    var reservation_prject = data.picker_prject_Range[data.picker_prject_id];
    var reservation_employee = data.employee_list[data.currentemployee];
    var reservation_time = data.calendar[data.currentIndex].date + " " + data.timeArr[data.currentTime].time;
    var nn = "\r\n";
    var colon = "：";
    var content = "预约门店：" + reservation_shop + nn + "预约项目：" + reservation_prject.name + "预计服务时长" + reservation_prject.nursingTime + "分钟" + nn + "预约护理师：" + reservation_employee.employee_number + reservation_employee.employee_name + nn + "预约时间：" + reservation_time;
    var confirm_reservation_data = {};
    confirm_reservation_data.reservation_shop = reservation_shop;
    confirm_reservation_data.reservation_prject = reservation_prject;
    confirm_reservation_data.reservation_employee = reservation_employee;
    confirm_reservation_data.reservation_time = reservation_time;

    wx.showModal({
      title: '预约服务确认提示',
      showCancel: true,
      cancelText: "取消预约",
      confirmText: "立即预约",
      confirmColor: "#AB956D",
      cancelColor: "#37f341",
      content: content,
      // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
      success: function(res) {

        if (res.confirm) {
          console.log('用户点击确定，立即预约')
          // console.log("====confirm_reservation_data===", confirm_reservation_data);
          confirm_reservation_data.reservation_status = 1;
          confirm_reservation_data.update_time = utils.format_date_5(new Date());;
          var date_str = utils.format_date(new Date());
          var out_trade_no = date_str + utils.RandomNumBoth(10000, 99999); // 商户订单号（按自己需要生成）
          confirm_reservation_data.out_trade_no = out_trade_no;
          // 云数据库初始化
          const db = wx.cloud.database();
          const reservation_list = db.collection('reservation_list');

          var send_even = {};
          // send_even.template_id = "iRNJNzEqz3Tt3ObtSR-9gSjHi5T6ZEJdmvuFxo7Fj3Y"; //服务预约成功通知 4个字段
          send_even.template_id = "iRNJNzEqz3Tt3ObtSR-9gYnMZ-du_mnfbkg034uUBp0"; //服务预约成功通知 9个字段

          send_even.msgData = {
            // 订单号
            "keyword1": {
              "value": out_trade_no,
              // "color": "#173177"
            },
            // 预约时间
            "keyword2": {
              "value": reservation_time
            },
            // / 预约项目
            "keyword3": {
              "value": reservation_prject.name,
              // "color": "#173177"
            },
            // / 服务技师
            "keyword4": {
              "value": reservation_employee.employee_name,
              // "color": "#173177"
            },
            // 店名
            "keyword5": {
              "value": reservation_shop
            },
            // // 门店电话
            // "keyword6": {
            //   "value": data.address
            // },
            // // 门店地址
            // "keyword7": {
            //   "value": reservation_prject.name
            // },
            // 预约客户
            "keyword6": {
              "value": data.address.name
            },
            // 客户电话
            "keyword7": {
              "value": data.address.phone
            }
          }
          send_even.page = "page/component/user/user";
          send_even.form_id = form_id;
          // var openids = [app.globalData.openId, app.globalData.openId]
          var openid = app.globalData.openId;
          send_even.openid = openid;

          const publicField = db.collection('publicField')

          publicField.where({
            type: 1
          }).get({
            success: res => {
              // this.setData({
              //   orders_list: res.data
              // })
              // console.log('[数据库] [查询记录] 成功: ', res.data)
              var expires_time = res.data[0].expires_time;
              var now_timestamp = Math.round(new Date().getTime() / 1000);
              console.log('expires_time====now_timestamp====', res, expires_time, now_timestamp);

              if (expires_time > now_timestamp + 60) {
                console.log('if ================IFIFIF');
                send_even.access_token = res.data[0].access_token;
                self.setData({
                  send_even: send_even
                })
              } else {
                console.log('ELSS=====================2222');
                wx.cloud.init();
                wx.cloud.callFunction({
                  // 要调用的云函数名称
                  name: 'get_AccessToken',
                }).then(res => {
                  wx.showModal({
                    title: '预约服务提示',
                    showCancel: true,
                    content: "数据库好像有点问题哦，请从新提交，谢谢！",
                    // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
                    success: function(res) {
                      if (res.confirm) {
                        console.log('预约服务提示,用户点击确定')

                      } else if (res.cancel) {
                        console.log('预约服务提示,用户点击取消')
                      }
                    }
                  });
                  send_even.access_token = res.result.access_token;
                  // console.log('云函数在APP获取到的access_token==3333=1 ', send_even);
                  self.setData({
                    send_even: send_even
                  });

                  // console.log('云函数===elf.data.send_even==3333=1 ',  self.data.send_even);
                  // output: res.result === 3
                }).catch(err => {
                  // handle error
                })
              }
              wx.cloud.callFunction({
                name: 'send_template_msg',
                data: self.data.send_even,
                complete: res => {
                  console.log('res======complete===222==res===', res);
                  var send_statusmsg = res.result.res.errmsg
                  var send_status = send_statusmsg.indexOf("ok")
                  if (send_status >= 0) {
                    // console.log("send_statusmsg======send_statuss===", send_statusmsg, send_status)
                    reservation_list.add({
                      // data 字段表示需新增的 JSON 数据
                      data: confirm_reservation_data

                    }).then(res => {
                      // console.log("DATASET==res==confirm_reservation_data===", res, confirm_reservation_data)
                    }).catch(err => {
                      // console.error("DATASET==res==confirm_reservation_data===", err, confirm_reservation_data)
                    });
                  } else {
                    wx.showModal({
                      title: '预约服务提示2',
                      showCancel: true,
                      content: "数据库好像有点问题哦，请从新提交，谢谢！",
                      // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
                      success: function(res) {
                        if (res.confirm) {
                          console.log('预约服务提示2,用户点击确定')

                        } else if (res.cancel) {
                          console.log('预约服务提示2,用户点击取消')
                        }
                      }
                    })
                  }

                },
              });
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })
              console.error('[数据库] [查询记录] 失败：', err)
            }
          });


        } else if (res.cancel) {
          console.log('用户点击取消，取消预约')
        }
      }
    })

  }
})