// miniprogram/page/component/reservation/reservation.js
// pages/orderTime/index.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    calendar: [],
    width: 0,
    address:{},
    shop_list: app.globalData.shop_list,
    hasAddress: false,
    currentIndex: 0,
    currentTime: 0,
    currentemployee:0,
    employee_list:[],
    picker_prject_id: 0,
    picker_prject_Range: ["请选择你要预约的项目"],
    // picker_prject_Range: app.globalData.project_lists,
    timeArr: [
      { "time": "10:00", "status": "" },
      { "time": "10:30", "status": "" },
      { "time": "11:00", "status": "" },
      { "time": "12:00", "status": "" },
      { "time": "13:00", "status": "" },
      { "time": "14:00", "status": "" },
      { "time": "15:00", "status": "" },
      { "time": "16:00", "status": "" },
      { "time": "17:00", "status": "" },
      { "time": "18:00", "status": "" },
      { "time": "19:00", "status": "" },
      { "time": "20:00", "status": "" },
      { "time": "21:00", "status": "" },
      { "time": "22:00", "status": "" },
      // { "time": "21:00", "status": "" },
      
      // { "time": "8:00-22:00", "status": "约满" }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    
    that.setData({
      picker_prject_Range: app.globalData.project_lists
    });
    if (that.data.picker_prject_Range.length<2){
      // /刷新当前页面的数据
      console.error("=刷新当前页面的数据====");
      getCurrentPages()[getCurrentPages().length - 1].onShow()//onShow()
    }
    // var self = this;
    // console.error("=picker_prject_Range====", that.data.picker_prject_Range);
    wx.getStorage({
      key: 'address',
      success(res) {
        var picker_shop_id = Number(res.data.picker1Value);
        // console.log('picker1Value=====：', picker_shop_id);
        that.setData({
          address: res.data,
          picker_shop_id: picker_shop_id,
          hasAddress: true
        })
        const db = wx.cloud.database({
          env: "wxc6c41875b492a9c0-1c74f6" // 环境ID：wxc6c41875b492a9c0-1c74f6
        });
        //拿到表
        // const seach_hot_data = db.collection('seach_hot');
        const employee_list_data = db.collection('employee_list');
        // console.log('picker1Value===2222==：', picker_shop_id);
        employee_list_data.where({
          // _openid: this.data.openid
          // _id:1
          shop_id: picker_shop_id
        }).get({
          success: function (res) {
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
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        });
      }

    });
    console.log('self.data====3333333==app.globalData==== ', that.data, app.globalData.project_lists);
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
    // console.log("this.data==this.data====", this.data)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  select: function (event) {
    //为上半部分的点击事件
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
    console.log(event.currentTarget.dataset.date)
  },
  selectTime: function (event) {
    //为下半部分的点击事件
    this.setData({
      currentTime: event.currentTarget.dataset.tindex
    })
    console.log(event,event.currentTarget.dataset.time)
  },
  selectemployee: function (event) {
    //处理选择护理师
    this.setData({
      currentemployee: event.currentTarget.dataset.index
    })
    console.log(event, event.currentTarget.dataset.employee_name)
  },
  normalPickerBindchange: function (e) {
    console.log("==normalPickerBindchange===", e, e.detail.value);
    this.setData({
      picker_prject_id: e.detail.value
    })
  },
  confirm_reservation: function (e) {
    var self = this;
    var data =self.data;
    // console.log("==self.data==55555=", data);
    var shop_mag ="预约门店："+ data.address.shop;
    var prject_mag = "预约项目：" + data.picker_prject_Range[data.picker_prject_id].name + "：预计服务时长" + data.picker_prject_Range[data.picker_prject_id].nursingTime +"分钟";
    var employee_mag = "预约护理师：" + data.employee_list[data.currentemployee].employee_name;
    // if 
    var time_mag = "预约时间：" + data.calendar[data.currentIndex].date + " " + data.timeArr[data.currentTime].time;
    // console.log("==data.data.calendar==8888===", data.calendar, data.currentTime);
    var nn = "\r\n";
    // var aaa = new Array(20).join(" ");
    var content = shop_mag + nn + prject_mag + nn + employee_mag + "      "+ nn + time_mag ;
    // console.log("==content==666666666===", content);
    // var self.data.address.;
    wx.showModal({
      title: '预约服务确认提示',
      showCancel:true,
      cancelText:"取消预约",
      confirmText:"立即预约",
      confirmColor:"#AB956D",
      cancelColor:"#37f341",
      content: content,
      // content: '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
})