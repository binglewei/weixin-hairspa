// miniprogram/page/component/manage/manage_reservation_record/manage_reservation_record.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker1Range: ['请选择门店'],
    // picker1Value: 0,
    calendar: [],
    shop_list: app.globalData.shop_list,
    timeArr: [],
    employee_list: [],
    picker_shop_id: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var from_page = options.from_page;
    // var
    this.setData({
      from_page: from_page,
      // shop_name: options.shop_name
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var shop_list = app.globalData.shop_list;
    var db = wx.cloud.database();
    const address_list_data = db.collection('address_list');
    address_list_data.where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        var len_data = res.data.length;
        // console.log("len_data==len_data==", len_data, res.data);
        if (len_data) {
          var user_address = res.data[0];
          var picker1Value = user_address.picker1Value;
          // console.log("picker1Value====", user_address, picker1Value);
          that.setData({
            picker1Value: picker1Value,
          });
        }
      }
    });
    var shop_names = ['请选择门店'];
    for (var num in shop_list) {
      // console.log("shop====", num);
      var shop_name = shop_list[num]["shop_name"];
      // console.log("shop_name====", shop_name);
      shop_names.push(shop_name);
    };
    that.setData({
      picker1Range: shop_names,
    });
    // console.log("shop_names====", that.data.picker1Range);
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_timearr',
      // data: select_data
    }).then(res => {
      // console.log("wx.cloud.callFunction======success===", res);
      var res_select_timearr = res.result;
      var width_time = 186 * parseInt(res_select_timearr.length);
      that.setData({
        timeArr: res_select_timearr,
        width_time: width_time
      });
    })

    //拿到表
    const employee_list_data = db.collection('employee_list');
    // console.log('picker_shop_id===2222==：', picker_shop_id);
    employee_list_data.where({
      shop_id: that.data.picker_shop_id
    }).get({
      success: function(res) {
        // console.log('[数据库] [employee_list_data===] 成功: ', res.data);
        var employee_list = res.data;
        that.setData({
          employee_list: employee_list,
        });
        // console.log('self.data.employee_list====3333333====== ', that.data.employee_list);
      },
      fail: function(res) {
        wx.showToast({
          icon: 'none',
          title: '查询护理师记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    //获取每个月的天数
    function getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }
    // 计算每月第一天是星期几
    function getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
    const date = new Date();
    // const date = new Date("Wed May 2 2019 13:40:31");
    // console.log("当前时间是===", date);
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
    // console.log("that.setData(========", that.data.calendar, that.data)
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function() {
      wx.hideLoading()
      that.select();
    }, 1000)

  },
  selectTime: function(event) {

    //为下半部分的点击事件(处理选择时间)
    var self = this;
    var currentTime = event.currentTarget.dataset.tindex;
    var reservation_times = event.currentTarget.dataset.time;
    var employee_number = event.currentTarget.dataset.emnumber;
    var status = event.currentTarget.dataset.status;
    this.setData({
      currentTime: currentTime
    })
    // console.log(" selectTime: currentTime=====", currentTime, event);
    var from_page = self.data.from_page;
    if (from_page) {
      var select_data = {
        from_page: from_page,
      }
    }
    if (status) {
      var currentIndex = self.data.currentIndex;
      select_data.reservation_date = self.data.calendar[currentIndex].date;;
      select_data.reservation_times = reservation_times;
      select_data.employee_number = employee_number;
      var picker1Value_1 = self.data.picker1Value;

      select_data.reservation_shop = self.data.picker1Range[picker1Value_1];
      // console.log("data=wx.cloud.callFunction-==in selectTime-=11111=before==", select_data)
      // 云数据库初始化
      wx.cloud.init();
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'select_reservationrecords',
        // name:"test"
        data: select_data
      }).then(res => {
        // console.log("data=wx.cloud.callFunction--=", res)
        var res_result = res.result; //result[""0""].reservation_time
        if (res_result.length) {
          var nn = "\r\n";
          var reservation_describe = res_result[0].reservation_describe;
          var user_magess = res_result[0].user_magess;
          var reservation_time = res_result[0].reservation_time;
          var reservation_shop = res_result[0].reservation_shop;
          var reservation_prject = res_result[0].reservation_prject;
          var reservation_employee = res_result[0].reservation_employee;
          var content = "预约状态：" + reservation_describe + nn + "预约客户：" + user_magess + nn + "预约门店：" + reservation_shop + nn + "预约项目：" + reservation_prject.name + "预计服务时长" + reservation_prject.nursingTime + "分钟" + nn + "预约护理师：" + reservation_employee.employee_name + nn + "预约时间：" + reservation_time;
          wx.showModal({
            title: '提示信息',
            content: content,
            showCancel: false
          })
        }
      });
    } else {
      // wx.showModal({
      //   title: '提示信息',
      //   content: '当前护理师当前时间段没有查询到预约记录哦！！',
      //   showCancel: false
      // })
    }
  },
  select: function(event) {
    var self = this;
    //为上半部分的点击事件(处理选择日期)
    if (event) {
      var currentIndex = event.currentTarget.dataset.index;
      var date_select = event.currentTarget.dataset.date;
      console.log(" select: function=====", currentIndex, date_select, event);
    } else {
      var currentIndex = 0
      var date_select = self.data.calendar[0].date;

    }
    self.setData({
      currentIndex: currentIndex
    })
    var from_page = self.data.from_page;
    if (from_page) {
      var select_data = {
        from_page: from_page,
        // reservation_shop: self.data.shop_name,
      }
    }
    select_data.reservation_date = date_select;
    var picker1Value_1 = self.data.picker1Value;
    select_data.reservation_shop = self.data.picker1Range[picker1Value_1];
    console.log("data=wx.cloud.callFunction-===select_data-==before==", picker1Value_1, self.data.picker1Value, select_data, self.data)
    // 云数据库初始化
    wx.cloud.init();
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'select_reservationrecords',
      // name:"test"
      data: select_data
    }).then(res => {
      console.log("data=wx.cloud.callFunction--=", res)
      var data = res.result;
      var employee_list = self.data.employee_list;
      var employee_list_all = [];
      //self.data.timeArr;
      var timeArr_in = Object.assign([], this.data.timeArr);
      for (var aa in employee_list) {
        var data_new = {};
        // var timeArr_in = Object.assign([], timeArr);

        var employee = employee_list[aa];
        var employee_number = employee.employee_number;

        data_new.timeArr_in = JSON.parse(JSON.stringify(timeArr_in));
        data_new.employee = employee;
        // console.log("data_new====befose====", data_new);
        for (var bb in data) {
          var employee_number_1 = data[bb].employee_number;
          var reservation_times_1 = data[bb].reservation_times;
          if (employee_number_1 == employee_number) {
            for (var cc in data_new.timeArr_in) {
              var cc = Number(cc);
              var next_cc = cc + 1;
              var next_cc_2 = cc + 2;
              // console.log("next_cc_2next_cc_2=====", cc,next_cc, next_cc_2);
              var time_in = data_new.timeArr_in[cc].time;
              if (time_in == reservation_times_1) {
                data_new.timeArr_in[cc].employee = data[bb];
                data_new.timeArr_in[cc].status = true;
                data_new.timeArr_in[next_cc].status = true;
                data_new.timeArr_in[next_cc_2].status = true;
              }
            }
          }
        }
        employee_list_all.push(data_new);
      }
      self.setData({
        employee_list_all: employee_list_all
      })
      console.log("employee_list_allemployee_list_all====", employee_list_all);
    })
  },
  normalPickerBindchange: function(e) {
    this.setData({
      picker1Value: e.detail.value
    })
    this.select()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})