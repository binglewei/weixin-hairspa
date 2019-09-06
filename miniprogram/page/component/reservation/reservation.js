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
    // action: "",
    formIdArray: [],
    access_tokens: [],
    send_even: "",
    width: 0,
    address: {},
    shop_list: app.globalData.shop_list,
    hasAddress: false,
    currentIndex: 0,
    currentTime: null,
    currentemployee: null,
    employee_list: [],
    picker_project_id: 0,
    timeArr: [],
    timeArr_init: [{
        "time": "10:00",
        "status": false
      },
      {
        "time": "10:30",
        "status": false
      },
      {
        "time": "11:00",
        "status": false
      },
      {
        "time": "11:30",
        "status": false
      },
      {
        "time": "12:00",
        "status": false
      },
      {
        "time": "12:30",
        "status": false
      },
      {
        "time": "13:00",
        "status": false
      },
      {
        "time": "13:30",
        "status": false
      },
      {
        "time": "14:00",
        "status": false
      },
      {
        "time": "14:30",
        "status": false
      },
      {
        "time": "15:00",
        "status": false
      },
      {
        "time": "15:30",
        "status": false
      },
      {
        "time": "16:00",
        "status": false
      },
      {
        "time": "16:30",
        "status": false
      },
      {
        "time": "17:00",
        "status": false
      },
      {
        "time": "17:30",
        "status": false
      },
      {
        "time": "18:00",
        "status": false
      },
      {
        "time": "18:30",
        "status": false
      },
      {
        "time": "19:00",
        "status": false
      },
      {
        "time": "19:30",
        "status": false
      },
      {
        "time": "20:00",
        "status": false
      },
      {
        "time": "20:30",
        "status": false
      },
      {
        "time": "21:00",
        "status": false
      },
      {
        "time": "21:30",
        "status": true
      },
      {
        "time": "22:00",
        "status": true
      }
    ],
    // picker_project_Range: ["请选择你要预约的项目"],
    picker_project_Range: app.globalData.project_lists,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options==1111111111111==", options);
    var self = this;
    var picker_project_id = options.project_id;
    var out_trade_no = options.out_trade_no;
    var reservation_id = options.reservation_id;
    var action = options.action;
    // var picker_project_id = options.project_id;
    // if (out_trade_no) {
    self.setData({
      picker_project_id: picker_project_id,
      out_trade_no: out_trade_no,
      reservation_id: reservation_id,
      action: action
    })
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_timearr',
      // // name:"test"
      // data: select_data
    }).then(res => {
      // console.log("wx.cloud.callFunction======success===", res);
      var res_select_timearr = res.result;
      self.setData({
        // picker_project_Range: app.globalData.project_lists,
        // timeArr: res_select_timearr,
        timeArr_init: res_select_timearr
      });
      // app.globalData.timeArr_init = res_select_timearr;

    })


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
    var db = wx.cloud.database();

    that.setData({
      picker_project_Range: app.globalData.project_lists,
      timeArr: that.data.timeArr_init,
    });
   

    if (that.data.picker_project_Range.length < 2) {
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
            picker_project_Range: project_lists_sy,
          });
        },
        fail: function(res) {
          console.log("res=picker_project_Range=22==", res);
        },
        complete: function(res) {
          console.log('complete=picker_project_Rangepicker_project_Range=3333==', res);

        },
      });
    }

    if (that.data.reservation_id) {
      var reservation_list = db.collection('reservation_list');
      reservation_list.where({
        _id: that.data.reservation_id
      }).get({
        success: function(res) {
          var res_data = res.data[0]
          // console.error("res.data[0].=ifififif==",res.data[0]);
          var picker_project_id = that.data.picker_project_id;
          if (!picker_project_id) {
            picker_project_id = res.data[0].reservation_prject["id"]
          }

          var currentemployee_name = res_data.reservation_employee.currentemployee_name;
          var employee_number = res_data.reservation_employee.employee_number;
          var employee_openid = res_data.reservation_employee.employee_openid;
          var reservation_time_from = res_data.reservation_time;
          var out_trade_no_from = res_data.out_trade_no;

          // console.log("res.data[0].=ifififif==", res.data[0], picker_project_id,currentemployee_name, currentTime_from)
          var picker_project_Range = that.data.picker_project_Range;
          for (var id in picker_project_Range) {
            var picker_project = picker_project_Range[id]
            var project_id = picker_project["id"]
            if (picker_project_id == project_id) {
              that.setData({
                picker_project: picker_project,
                currentemployee_name: currentemployee_name,
                out_trade_no_from: out_trade_no_from,
                reservation_time_from: reservation_time_from,
                employee_openid: employee_openid
              })
            }
          };
        }
      });
    } else {
      var picker_project_id = that.data.picker_project_id;
      console.error("picker_project_id==8888=else==", picker_project_id)
      var picker_project_Range = that.data.picker_project_Range;
      for (var id in picker_project_Range) {
        var picker_project = picker_project_Range[id]
        var project_id = picker_project["id"]
        if (picker_project_id == project_id) {
          that.setData({
            picker_project: picker_project,
            // currentTime: currentTime
          })
          // console.log('picker_project==111111111111111==', picker_project,picker_project_id)
        }
      };
    }

    // console.error('picker_project_Range==3333==', picker_project_id, picker_project_Range, picker_project_Range[picker_project_id]);
    // const db = wx.cloud.database({
    //   // env: "wxc6c41875b492a9c0-1c74f6"
    // });
    const address_list_data = db.collection('address_list');
    address_list_data.where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        console.log("res.data=111=rederbsyion=", res.data);
        var data = res.data[0];
        var len_data = res.data.length;
        if (len_data > 0) {
          var picker_shop_id = Number(data.picker1Value);
          console.log('picker_shop_id=====：', picker_shop_id);
          that.setData({
            address: data,
            picker_shop_id: picker_shop_id,
            hasAddress: true
          })
          //拿到表
          const employee_list_data = db.collection('employee_list');
          // console.log('picker_shop_id===2222==：', picker_shop_id);
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
                employee_list_all: employee_list
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
        } else {
          wx.showModal({
            title: '门店信息为空',
            showCancel: true,
            content: "请您先选择要预约的门店，谢谢！",
            // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
            success: function(res) {
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
    // const date = new Date("Wed May 2 2019 13:40:31");
    console.log("当前时间是===", date);
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const next_month = date.getMonth() + 2;
    const cur_date = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //利用构造函数创建对象
    // const date = new Date()
    function calendar(date, week) {
      var monthLength = getThisMonthDays(cur_year, cur_month)
      if (date > monthLength) {
        var date2 = date - monthLength;
        this.date = cur_year + '-' + next_month + '-' + date2;
      } else {
        this.date = cur_year + '-' + cur_month + '-' + date;
      }
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
    var next_monthLength = getThisMonthDays(cur_year, next_month)
    //当前月份的第一天是星期几
    var week = getFirstDayOfWeek(cur_year, cur_month)
    var x = week;
    for (var i = 1; i <= monthLength + next_monthLength; i++) {
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
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () {
      wx.hideLoading();
      that.select();
    }, 1000)
   
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
    //为上半部分的点击事件(处理选择日期)
    if (event) {
      var currentIndex = event.currentTarget.dataset.index
    } else {
      var currentIndex = 0
    }
    this.setData({
      currentIndex: currentIndex
    })
    var date = new Date();
    var timeArr = Object.assign([], this.data.timeArr_init);
    var employee_list_selectTime = Object.assign([], this.data.employee_list_all);
    if (currentIndex == 0) {
      var cur_Hours = date.getHours();
      // var timeArr_if = JSON.parse(JSON.stringify(timeArr));
      var timeArr_if = timeArr;
      // console.log("this.timeAr==12321312312313==", timeArr, this.timeArr);
      for (var aa in timeArr_if) {
        var time_cur = timeArr_if[aa].time;
        var list_hours = time_cur.split(":")[0]
        if (list_hours <= cur_Hours + 1) {
          timeArr_if[aa].status = true
        }
        // console.log("cur_Hours==cur_Hours==", time_cur, list_hours, timeArr, this.data);
      }
      // console.log("timeArr=if==111111111111111111==", timeArr_if, app.globalData);

      this.setData({
        timeArr: timeArr_if,
        employee_list: employee_list_selectTime,
        currentTime: null,
        currentemployee: null
      })
    } else {
      var timeArr2222 = timeArr; //JSON.parse(JSON.stringify(timeArr));
      for (var aa in timeArr2222) {
        timeArr2222[aa].status = false
        var time = timeArr2222[aa].time;
        if (time == "22:00" || time == "21:30") {
          timeArr2222[aa].status = true
        }
      }
      console.log("timeArr=  else=222222222===", timeArr2222);
      this.setData({
        timeArr: timeArr2222,
        employee_list: employee_list_selectTime,
        currentTime: null,
        currentemployee: null,
      })
    }
  },
  selectTime: function(event) {
    //为下半部分的点击事件(处理选择时间)
    var currentTime = event.currentTarget.dataset.tindex;
    this.setData({
      currentTime: currentTime
    })
    // 云数据库初始化
    var select_data = {};
    select_data.reservation_status = 1;
    var data = this.data;
    // select_data.reservation_time = "_.in([" + list_reservation_time+"])";
    select_data.reservation_shop = data.address.shop;

    // select_data.reservation_times = data.timeArr[data.currentTime].time;
    select_data.reservation_date = data.calendar[data.currentIndex].date;
    var reservation_time_current = data.timeArr[currentTime].time;
    var reservation_times_list = [];
    reservation_times_list.push(reservation_time_current);
    var last_currentTime = currentTime - 1;
    if (last_currentTime >= 0) {
      var last_reservation_time = data.timeArr[last_currentTime].time;
      reservation_times_list.push(last_reservation_time);
    }
    var last_currentTime_2 = currentTime - 2;
    if (last_currentTime_2 >= 0) {
      var last_reservation_time_2 = data.timeArr[last_currentTime_2].time;
      reservation_times_list.push(last_reservation_time_2);
    }
    // select_data.reservation_date = 
    console.log("data=wx.cloud.callFunction==before--==select_data==", select_data, reservation_times_list);
    // for (var ti in reservation_times_list){
    select_data.reservation_times = reservation_time_current;
    select_data.reservation_times_list = reservation_times_list;
    console.log("data=wx.cloud.callFunction==in--forforforfor==22222222==", reservation_times_list, select_data);
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_reservationrecords',
      // name:"test"
      data: select_data
    }).then(res => {
      console.log("data=wx.cloud.callFunction-----==select_reservationrecords==", res)
      var res_result = res.result;
      var employee_list_selectTime = Object.assign([], this.data.employee_list_all); // this.data.employee_list_all;
      var employee_list_selectTime_if = employee_list_selectTime;
      // console.log("employee_list_selectTime=before=", employee_list_selectTime);
      if (res_result.length) {
        for (var da in res_result) {
          //  var employee_list_selectTime_if = employee_list_selectTime;
          var res_employee_number = res_result[da].reservation_employee.employee_number;
          console.log("res_employee_name====employee_list_selectTime==if===11111==", res_employee_number);
          // var index_delete = String(res_employee_number)[res_employee_number.length - 1];
          // // delete employee_list_selectTime_if[index_delete-1];
          // employee_list_selectTime_if.splice(index_delete - 1, 1);
          for (var index_delete in employee_list_selectTime_if) {
            var employee_number_inlist = employee_list_selectTime_if[index_delete].employee_number;
            if (res_employee_number == employee_number_inlist) {
              employee_list_selectTime_if.splice(index_delete, 1);
            }

            // console.log("res_employee_name====employee_list_selectTime==if===222222==", res_employee_number, index_delete, employee_number_inlist,employee_list_selectTime_if.length, employee_list_selectTime_if);
          }


        }
        if (employee_list_selectTime_if.length) {
          this.setData({
            employee_list: employee_list_selectTime_if
          })
        } else {
          this.setData({
            employee_list: employee_list_selectTime_if
          })
          wx.showModal({
            title: '预约提示',
            content: '当天当前时间段已经预约满了哦，请选择其他时间吧！！',
            showCancel: false
          })
        }

      } else {
        // var employee_list_selectTime_else = employee_list_selectTime;
        // console.log("res_employee_name====employee_list_selectTime===else==3333==", employee_list_selectTime.length, employee_list_selectTime, this.data);
        this.setData({
          employee_list: employee_list_selectTime
        })
      }
    }).catch(err => {
      // handle error
      console.error("data=wx.cloud.callFunction--=", err)
    })
    //  }
  },
  selectemployee: function(event) {
    //处理选择护理师
    var currentemployee = event.currentTarget.dataset.index;
    this.setData({
      currentemployee: currentemployee
    })
    // 云数据库初始化
    var select_data = {};
    var data = this.data;
    select_data.reservation_status = 1;
    select_data.reservation_shop = data.address.shop;
    select_data.reservation_date = data.calendar[data.currentIndex].date;
    select_data.employee_number = data.employee_list[currentemployee].employee_number;
    console.log("select_data=wx.cloud.callFunction--in===3333 before=====", select_data);
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_reservationrecords',
      // name:"test"
      data: select_data
    }).then(res => {
      console.log("data=wx.cloud.callFunction--in selectemployee=====", res, currentemployee)
      var res_result = res.result

      var res_result_length = res_result.length
      var timeArr = Object.assign([], this.data.timeArr_init);
      // var timeArr = Object.assign([], this.data.timeArr);
      if (res_result_length) {
        var timeArr_select = JSON.parse(JSON.stringify(timeArr));
        // console.log("this.timeAr==赋值结果=ifififif=", timeArr_select == timeArr, timeArr_select);
        for (var da in res_result) {
          var res_result_data = res_result[da]
          var reservation_times = res_result_data.reservation_times;
          var reservation_prject_nursingTime = res_result_data.reservation_prject.nursingTime;
          // console.log("this.timeAr==12321312312313==", timeArr_select);
          for (var aa in timeArr_select) {
            var time_cur = timeArr_select[aa].time;
            if (time_cur == reservation_times) {
              var aa_1 = Number(aa) + 1;
              var aa_2 = Number(aa) + 2;
              var aa_3 = Number(aa) + 3;
              // console.log("t timeArr[aa], timeArr[aa + 1], timeArr[aa + 2]==", timeArr_select[aa], aa_1, aa_2, reservation_prject_nursingTime);
              timeArr_select[aa].status = true
              timeArr_select[aa_1].status = true
              timeArr_select[aa_2].status = true
              // if (reservation_prject_nursingTime>60){
              //   timeArr_select[aa_3].status = true
              // }
            }
            // console.log("list_times, reservation_times, timeArr====55==", time_cur, reservation_times, timeArr);
          }
          // console.log("timeArr=if==111111111111111111==", timeArr, app.globalData);
          this.setData({
            timeArr: timeArr_select,
          })
          console.log("timeArr_select===timeArr_select==", timeArr_select)
        }
      } else {
        var timeArr_select_else = JSON.parse(JSON.stringify(timeArr));
        this.setData({
          timeArr: timeArr_select_else,

        })
        console.log("timeArr_select_else====elsee111===", timeArr_select_else == timeArr,timeArr_select_else)
      }
      var court_true = 0;
      var timeArr_select = this.data.timeArr;
      for (var a2 in timeArr_select) {
        var a2_status = timeArr_select[a2].status
        if (a2_status) {
          court_true = court_true + 1;
        }
      }
      if (court_true >= 25) {
        console.log("court_true===ifififfi=court_true>=25=", court_true);
        wx.showModal({
          title: '预约提示',
          content: '当前护理师当天已经预约满了哦，请选择其他护理师吧！！',
          showCancel: false
        })
      } else {
        console.log("court_true===else==", court_true)
      }
    }).catch(err => {
      // handle error
      console.error("data=wx.cloud.callFunction--=", err)
    })
  },
  // normalPickerBindchange: function(e) {
  //   console.log("==normalPickerBindchange===", e, e.detail.value);
  //   this.setData({
  //     picker_project_id: e.detail.value
  //   })
  // },
  // submitInfo: function (e) {
  //   console.log('GG 敌方军团已同意投降 4票赞成 0票反对')
  //   console.log(e.detail.formId);
  // },
  saveFormId: function(v) {
    console.log("vvvvvvv===", v)
    if (v.detail.formId != 'the formId is a mock one') {
      this.data.formIdArray.push(v.detail.formId);
    }
    console.log("formIdArray===", this.data.formIdArray)
  },
  get_reservation_mag: function(e) {

  },
  confirm_reservation: function(e) {
    var self = this;
    var data = self.data;
    this.saveFormId(e);
    var form_ids = data.formIdArray;
    var reservation_shop = data.address.shop;
    var currentTime = data.currentTime;
    var currentemployee = data.currentemployee;
    // console.log("currentTime, currentemployee========", currentTime, currentemployee);
    if (!reservation_shop) {
      wx.showModal({
        title: '预约提示',
        content: '请先选择要预约的门店!',
        showCancel: false
      })
    } else if (currentTime == null) {
      wx.showModal({
        title: '预约提示',
        content: '请先选择要预约的具体时间!',
        showCancel: false
      })
    } else if (currentemployee == null) {
      wx.showModal({
        title: '预约提示',
        content: '请先选择要预约的护理师!',
        showCancel: false
      })
    } else if (!data.picker_project) {
      wx.showModal({
        title: '预约提示',
        content: '请先选择要预约的项目!',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '加载中',
      });
      setTimeout(function() {
        wx.hideLoading()
      }, 1500)

      var reservation_prject = data.picker_project;
      var reservation_employee = data.employee_list[data.currentemployee];
      var employee_number = data.employee_list[data.currentemployee].employee_number;
      var reservation_time = data.calendar[data.currentIndex].date + " " + data.timeArr[data.currentTime].time;
      var reservation_times = data.timeArr[data.currentTime].time;
      var reservation_date = data.calendar[data.currentIndex].date;
      var nn = "\r\n";
      var content = "预约门店：" + reservation_shop + nn + "预约项目：" + reservation_prject.name + "预计服务时长" + reservation_prject.nursingTime + "分钟" + nn + "预约护理师：" + reservation_employee.employee_name + nn + "预约时间：" + reservation_time;
      var confirm_reservation_data = {};
      confirm_reservation_data.reservation_shop = reservation_shop;
      confirm_reservation_data.reservation_prject = reservation_prject;
      confirm_reservation_data.reservation_employee = reservation_employee;
      confirm_reservation_data.employee_number = employee_number;
      confirm_reservation_data.reservation_time = reservation_time;
      confirm_reservation_data.reservation_times = reservation_times;
      confirm_reservation_data.reservation_date = reservation_date;
    }
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
          wx.showLoading({
            title: '预约中',
          });

          console.log('用户点击确定，立即预约');

          // console.log("====confirm_reservation_data===", confirm_reservation_data);
          confirm_reservation_data.reservation_status = 1;
          confirm_reservation_data.reservation_describe = "预约成功";
          confirm_reservation_data.update_time = utils.format_date_5(new Date());;
          var date_str = utils.format_date(new Date());
          var out_trade_no = date_str + utils.RandomNumBoth(10000, 99999); // 商户订单号（按自己需要生成）
          confirm_reservation_data.out_trade_no = out_trade_no;
          // 云数据库初始化
          const db = wx.cloud.database();
          const reservation_list = db.collection('reservation_list');
          // 云数据库初始化
          var select_data = {};
          // var data = this.data;
          select_data.reservation_status = 1;
          select_data.reservation_shop = data.address.shop;
          select_data.reservation_date = data.calendar[data.currentIndex].date;
          select_data.employee_number = data.employee_list[currentemployee].employee_number;
          var reservation_time_current = data.timeArr[currentTime].time;
          var reservation_times_list = [];
          reservation_times_list.push(reservation_time_current);
          var last_currentTime = currentTime - 1;
          if (last_currentTime >= 0) {
            var last_reservation_time = data.timeArr[last_currentTime].time;
            reservation_times_list.push(last_reservation_time);
          }
          var last_currentTime_2 = currentTime - 2;
          if (last_currentTime_2 >= 0) {
            var last_reservation_time_2 = data.timeArr[last_currentTime_2].time;
            reservation_times_list.push(last_reservation_time_2);
          }
          // select_data.reservation_date = 
          console.log("data=wx.cloud.callFunction==before--8888881==select_data=11=", select_data, reservation_times_list);
          // for (var ti in reservation_times_list){
          select_data.reservation_times = reservation_time_current;
          select_data.reservation_times_list = reservation_times_list;
          console.log("select_data=wx.cloud.callFunction--in===8888882 before=====", select_data);
          wx.cloud.init();
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'select_reservationrecords',
            // name:"test"
            data: select_data
          }).then(res => {
            console.log("data=wx.cloud.callFunction--in selectemployee==8888883===", res, currentemployee)
            var res_result = res.result

            var res_result_length = res_result.length
            // var timeArr = Object.assign([], this.data.timeArr_init);
            
            if (res_result_length) {
              console.log("data=res_result_lengthe==8888884===", res_result_length)
              wx.showModal({
                title: '预约提示',
                content: '护理师当前时间已经预约满了哦!',
                showCancel: false
              });
              console.log('刷新下页面========');
              getCurrentPages()[getCurrentPages().length - 1].onShow();
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            }else{
         
          var send_even = {};
          // send_even.template_id = "iRNJNzEqz3Tt3ObtSR-9gSjHi5T6ZEJdmvuFxo7Fj3Y"; //服务预约成功通知 4个字段
          // send_even.template_id = "iRNJNzEqz3Tt3ObtSR-9gYnMZ-du_mnfbkg034uUBp0"; //服务预约成功通知 7q ww usr 个字段
          send_even.employe_template_id = "aX3pxsFG0_cEDtjF-zibzAPbd09LkXXFWD1AR9ibhbo"; //公众号成功通知 
          send_even.user_template_id = "eeBOlrKPLtyyXU_HyOPdLH7ShboHtx0p11T9keSGleg"; //公众号成功通知 

          send_even.employe_msgData = {
            "first": {
              "value": "亲爱的" + reservation_shop + ",你有客人预约服务了！！",
              "color": "#173177"
            },
            "keyword1": {
              "value": data.address.name,
              "color": "#173177"
            },
            "keyword2": {
              "value": data.address.phone,
              "color": "#173177"
            },
            //预约项目：{{keyword3.DATA}}
            "keyword3": {
              "value": reservation_prject.name,
              "color": "#173177"
            },
            //预约时间
            "keyword4": {
              "value": reservation_time,
              "color": "#173177"
            },
            //服务人员
            "keyword5": {
              "value": reservation_employee.employee_name,
              "color": "#173177"
            },
            //{{remark.DATA}}
            "remark": {
              "value": "请及时联络客户！！",
              "color": "#173177"
            }
          }
          send_even.user_msgData = {
            "first": {
              "value": "亲爱的-" + data.address.name + "-客户，您好，恭喜您已预约成功！！",
              "color": "#173177"
            },
            //预约编号
            "keyword1": {
              "value": out_trade_no,
              "color": "#173177"
            },
            //预约项目：{{keyword3.DATA}}
            "keyword2": {
              "value": reservation_prject.name,
              "color": "#173177"
            },
            //预约门店：{{keyword3.DATA}}
            "keyword3": {
              "value": reservation_shop,
              "color": "#173177"
            },

            //预约时间
            "keyword4": {
              "value": reservation_time,
              "color": "#173177"
            },
            //门店地址：{{keyword5.DATA}}
            // "keyword5": {
            //   "value": data.shop_list,
            //   // "color": "#173177"
            // },
            //
            "remark": {
              "value": "感谢您的预约，我们不见不散。",
              "color": "#173177"
            }
          }
          //   // 订单号
          //   "keyword1": {
          //     "value": out_trade_no,
          //     // "color": "#173177"
          //   },
          //   // 预约时间
          //   "keyword2": {
          //     "value": reservation_time
          //   },
          //   // / 预约项目
          //   "keyword3": {
          //     "value": reservation_prject.name,
          //     // "color": "#173177"
          //   },
          //   // / 服务技师
          //   "keyword4": {
          //     "value": reservation_employee.employee_name,
          //     // "color": "#173177"
          //   },
          //   // 店名
          //   "keyword5": {
          //     "value": reservation_shop
          //   },
          //   // // 门店电话
          //   // "keyword6": {
          //   //   "value": data.address
          //   // },
          //   // // 门店地址
          //   // "keyword7": {
          //   //   "value": reservation_prject.name
          //   // },
          //   // 预约客户
          //   "keyword6": {
          //     "value": data.address.name
          //   },
          //   // 客户电话
          //   "keyword7": {
          //     "value": data.address.phone
          //   }
          // }
          send_even.page = "page/component/reservation_records/reservation_records";
          send_even.employee_page = "page/component/manage/manage";

          // send_even.form_ids = form_ids;
          // var openids = [app.globalData.openId, app.globalData.openId]
          var openid = app.globalData.openId;
          send_even.user_openid = openid;
          send_even.employee_openid = reservation_employee.employee_openid
          wx.cloud.init();
          // var res_call = await wx.cloud.callFunction({
          //   // 要调用的云函数名称
          //   name: 'get_userunionid',
          //   data: openid
          // });
          // console.log('res_call===========8888=======', res_call)

          const publicField = db.collection('publicField')

          publicField.where({
            type: 0
          }).get({
            success: res => {
              // this.setData({
              //   orders_list: res.data
              // })
              // console.log('[数据库] [查询记录] 成功: ', res.data)
              var expires_time = res.data[0].expires_time;
              var now_timestamp = Math.round(new Date().getTime() / 1000);
              // console.log('expires_time====now_timestamp====', res, expires_time, now_timestamp);

              // if (expires_time > now_timestamp + 60) {
              //   console.log('if ================IFIFIF');
              //   send_even.access_token = res.data[0].access_token;
              //   self.setData({
              //     send_even: send_even
              //   })
              // } else {
              //   console.log('ELSS=====================2222');
              //   wx.cloud.init();
              //   wx.cloud.callFunction({
              //     // 要调用的云函数名称
              //     name: 'get_AccessToken',
              //   }).then(res => {
              //     wx.showModal({
              //       title: '预约服务提示',
              //       showCancel: true,
              //       content: "数据库好像有点问题哦，请从新提交，谢谢！",
              //       // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
              //       success: function(res) {
              //         if (res.confirm) {
              //           console.log('预约服务提示,用户点击确定')

              //         } else if (res.cancel) {
              //           console.log('预约服务提示,用户点击取消')
              //         }
              //       }
              //     });
              //     send_even.access_token = res.result.access_token;
              //     // console.log('云函数在APP获取到的access_token==3333=1 ', send_even);
              //     self.setData({
              //       send_even: send_even
              //     });

              //     // console.log('云函数===elf.data.send_even==3333=1 ',  self.data.send_even);
              //     // output: res.result === 3
              //   }).catch(err => {
              //     // handle error
              //   })
              // }
              self.setData({
                send_even: send_even
              });
              console.log('res======befor===self.data.send_even===', self.data.send_even, self.data);
              wx.cloud.callFunction({
                // name: 'send_template_msg',
                name: 'send_public_msg',
                data: self.data.send_even,
                complete: res => {
                  console.log('res======complete===222==res===', res);
                  var send_status = res.result.res_employee.errcode
                  // var send_status = send_statusmsg.indexOf("ok")
                  if (!send_status) {
                    console.log("send_statusmsg======send_statuss===", send_status);
                    var action = self.data.action;
                    if (action == "update") {
                      var reservation_id = self.data.reservation_id;
                      console.log("self.data.action==ifififif ==", action, confirm_reservation_data);
                      console.log("reservation_id=ifififif ==22222==", reservation_id);
                      reservation_list.doc(reservation_id).update({
                        data: confirm_reservation_data,
                        success: res => {

                          console.log('[数据库] [更新记录] 成功：===', res);
                          wx.showToast({
                            title: '修改预约成功!',
                            icon: 'success',
                            duration: 2000
                          });
                          // wx.reLaunch({
                          wx.navigateTo({
                            // url: 'test?id=1'
                            url: "/page/component/reservation_records/reservation_records"
                          })
                          // self.setData({
                          //   action: "",
                          // });
                          // console.log('刷新下页面========', self.data);
                          // getCurrentPages()[getCurrentPages().length - 1].onShow()

                        },
                        fail: err => {
                          // icon: 'none',
                          console.error('[数据库] [更新记录] 失败：===', err);
                          getCurrentPages()[getCurrentPages().length - 1].onShow()

                        }

                      })
                    } else {
                      console.log("self.data.action==else ==", action)
                      reservation_list.add({
                        // data 字段表示需新增的 JSON 数据
                        data: confirm_reservation_data

                      }).then(res => {
                        wx.showToast({
                          title: '预约成功!',
                          icon: 'success',
                          duration: 2000
                        })
                        wx.navigateTo({
                          // wx.reLaunch({
                          // url: 'test?id=1'
                          url: "/page/component/reservation_records/reservation_records"
                        })

                        // console.log("DATASET==res==confirm_reservation_data===", res, confirm_reservation_data)
                      }).catch(err => {
                        // console.error("DATASET==res==confirm_reservation_data===", err, confirm_reservation_data)
                      });
                    }
                  } else {
                    wx.showModal({
                      title: '预约服务提示2',
                      showCancel: true,
                      content: "唉呀，提交失败了，请从新提交，谢谢！",
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
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
            }
              });
          // wx.hideLoading();
        } else if (res.cancel) {
          console.log('用户点击取消，取消预约')
        }
      }
    })

  },
  //  发起取消请求
  cancel_reservation(e) {
    var self = this;
    var data = this.data;
    var id = self.data.reservation_id;
    wx.showModal({
      title: '取消预约提示',
      content: '您确定要取消预约服务吗？？？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定--取消')
          const db = wx.cloud.database();
          const reservation_list_data = db.collection('reservation_list');
          console.log("e=e.target.dataset.id=11111111=", id);
          //self.data.reservation_id;
          var cancel_end_even = {};
          var employe_template_id = "brsMHU2COgxiO_39fdHi_x3iQQIPRRFd1sBNJUaai-s"; //客服取消模板ID
          var user_template_id = "9DCiXZmKqz2q0lnjHAlr7_Cmq24Cm3r3fv3zf7Eg6g0"; //用户取消模板ID
          cancel_end_even.employe_template_id = employe_template_id;
          cancel_end_even.user_template_id = user_template_id;
          cancel_end_even.page = "page/component/reservation_records/reservation_records";
          cancel_end_even.employee_page = "page/component/manage/manage";
          cancel_end_even.user_openid = app.globalData.openId;
          
          // var reservation_employee = data.employee_list[data.currentemployee];
          cancel_end_even.employee_openid = data.employee_openid;
          // var reservation_shop = data.address.shop;
          cancel_end_even.employe_msgData = {
            "first": {
              "value": "亲爱的" + data.address.shop + ",您的顾客取消了预约！！",
              "color": "#173177"
            },
            //客户姓名
            "keyword1": {
              "value": data.address.name,
              "color": "#173177"
            },
            //客户电话
            "keyword2": {
              "value": data.address.phone,
              "color": "#173177"
            },
            // //预约项目：{{keyword3.DATA}}
            // "keyword3": {
            //   "value": reservation_prject.name,
            //   "color": "#173177"
            // },
            //预约时间
            "keyword3": {
              "value": data.reservation_time_from,
              "color": "#173177"
            },
            // //服务人员
            // "keyword5": {
            //   "value": reservation_employee.employee_name,
            //   "color": "#173177"
            // },
            //{{remark.DATA}}
            "remark": {
              "value": "请及时联络客户，了解客户情况！！",
              "color": "#173177"
            }
          };
          cancel_end_even.user_msgData = {
            "first": {
              "value": "亲爱的-" + data.address.name + "-客户，您好，已为您取消预约。",
              "color": "#173177"
            },
            //预约编号
            "keyword1": {
              "value": data.out_trade_no_from,
              "color": "#173177"
            },
            // //预约项目：{{keyword3.DATA}}
            // "keyword2": {
            //   "value": reservation_prject.name,
            //   "color": "#173177"
            // },
            //预约门店：{{keyword3.DATA}}
            "keyword2": {
              "value": data.address.shop,
              "color": "#173177"
            },

            //预约时间
            "keyword3": {
              "value": data.reservation_time_from,
              "color": "#173177"
            },
            //服务人员
            // "keyword5": {
            //   "value": reservation_prject.name,
            //   // "color": "#173177"
            // },
            //门店地址：{{keyword5.DATA}}
            "remark": {
              "value": "期待您的下次光临。",
              "color": "#173177"
            }
          }
          console.log('send_public_msge=====callFunction===222==cancel_end_even===', cancel_end_even);
          wx.cloud.callFunction({
            // name: 'send_template_msg',
            name: 'send_public_msg',
            data: cancel_end_even,
            complete: res => {
              console.log('res======complete===222==res===', res);
              var send_status = res.result.res_employee.errcode
              if (!send_status) {
                reservation_list_data.doc(id).update({
                  data: {
                    reservation_status: 0,
                    reservation_describe: "已取消预约",
                    // ddxz:22,
                    update_time: utils.format_date_5(new Date()),
                    // out_trade_no: 66666666666666
                  },
                  success: res => {
                    console.log('[数据库] [更新记录] 成功：', res);
                    wx.showToast({
                      title: '取消预约成功!',
                      icon: 'success',
                      duration: 1000
                    });
                    wx.navigateTo({
                      // wx.reLaunch({
                      // url: 'test?id=1'
                      url: "/page/component/reservation_records/reservation_records"
                    })

                    // self.setData({
                    //   action: "",
                    // });
                    // console.log('刷新下页面========', self.data);
                    // getCurrentPages()[getCurrentPages().length - 1].onShow()

                  },
                  fail: err => {
                    // icon: 'none',
                    console.error('[数据库] [更新记录] 失败：', err);
                    getCurrentPages()[getCurrentPages().length - 1].onShow()

                  }

                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消---取消')
        }
      }
    })

  }
})