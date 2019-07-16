App({
  globalData: {
    userInfo: {},
    openId: '',
    Apikey: "symeiyu1357048216039688322766666", //不同于AppSecret(小程序密钥)#sy89667567	#api 密钥
    appId: 'wxc6c41875b492a9c0',
    mch_id: "1529712601", //商户号
    hasLogin: false,
    project_lists:[],
    address: {
      name: '',
      phone: '',
      gender: '',
      birthday: '',
      detail: ''
    },
    seach_hot: "",
    cart_totalNums: {},
    product_list: [],
    bannerUrls: [],
    shop_list:[],
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    wx.cloud.init();
    // wx.cloud.callFunction({
    //   name: 'get_openid',
    //   complete: res => {
    //     // console.log("get_openid====res=unionid==", res, res.result.unionid);
    //     var unionid = res.result.unionid;
    //     this.globalData.openId = unionid;
    //     var openId = res.result.openId;
    //     this.globalData.openId = openId;
    //   }
    // });
    const db = wx.cloud.database();
    //拿到表
    const seach_hot_data = db.collection('seach_hot');
    const shop_list_data = db.collection('shop_list');
    self = this;
    shop_list_data.where({
      // _openid: this.data.openid
      // _id:1
    }).get({
      success: function (res) {

        self.globalData.shop_list = res.data;
        // console.log('[数据库] [查询记录shop_list_data] 成功: ', self.globalData);
      },
      fail: function (res) {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    seach_hot_data.where({
      // _openid: this.data.openid
      // _id:1
    }).get({
      success: function (res) {
        // console.log('[数据库] [查询记录] 成功: ', res);
        var requey_data = res.data;
        var seach_hot_1 = [];
        for (var list in requey_data) {
          seach_hot_1.push(requey_data[list]["hot_text"])
        };
        self.globalData.seach_hot = seach_hot_1;
      },
      fail: function (res) {
        // wx.showToast({
        //   icon: 'none',
        //   title: '查询记录失败'
        // })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    wx.getUserInfo({
      lang: "zh_CN",
      withCredentials: true,
      success: function (res) {
        var userInfo = res.userInfo;
        self.globalData.userInfo = userInfo;
        // wx.cloud.init();
        wx.cloud.callFunction({
          name: 'get_openid',
          complete: res => {
            console.log("get_openid====res=unionid==", res, res.result.unionid);
            var openId = res.result.openId;
            var unionid = res.result.unionid;
            self.globalData.openId = openId;
            self.globalData.unionid = unionid;
            const address_list_data = db.collection('address_list');
            var add_value = {};
            add_value.userInfo = userInfo;
            add_value.unionid = unionid;
            add_value.update_date = new Date();
            console.log('[数据库] 操作前数据===: ', add_value);
            address_list_data.where({
              _openid: openId
            }).get({
              success: res => {
                var len_data = res.data.length;
                console.log("len_data==len_data==", len_data, res.data);
                if (len_data == 0) {
                  console.log('[数据库] add: ', add_value);
                  address_list_data.add({
                    data: add_value

                  }).then(res => {
                    console.log("DATASET==res==value===", res, add_value)
                  }).catch(err => {
                    console.error("DATASET==res==value===", err, add_value)
                  })
                }
                else {
                  var unionid_from = res.data[0].unionid;
                  if (!unionid_from) {
                    console.log("unionid_from======", unionid_from)

                    console.log('[数据库] update:===在app.js= ', add_value)
                    var id = res.data[0]["_id"]
                    address_list_data.doc(id).update({
                      // data 字段表示需新增的 JSON 数据
                      // data: JSON.parse(orders_list_String)
                      data: add_value

                    }).then(res => {
                      // console.log("DATASET==res==update=su、s==", res, add_value)
                    }).catch(err => {
                      console.error("DATASET==res==value===", err, add_value)
                    })

                  }

                }
                // console.log('[数据库] [查询记录] 成功: ', res.data)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '查询记录失败'
                })
              }
            });

            // console.error('[数据库] [查询记录] 失败：', err)
          }
        });
      },
      fail: function (res) {
        console.error("wx.getUserInfo=====error===", res);
        wx.showModal({
          title: '提示',
          content: "请先点击 “我的》个人设置” 获取授权并完善个人信息哦！！",
          showCancel: false
        })
      }
    }); 

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  }

  
})