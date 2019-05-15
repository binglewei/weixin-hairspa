App({
  globalData: {
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
    // cart_totalNums: { 0: { id: 0, title: '新鲜芹菜 半斤', image: '/image/s5.png', num: 4, price: 0.01, selected: true }},
    product_list: [],
    // product_list: [{
    //   id: 0,
    //   image: '/image/sy_list/list_1.jpg',
    //   title: '草本养发',
    //   price: 0.01,
    //   stock: 10,
    //   detail: '这里是草本养发详情。',
    //   parameter: '好多好多钱！！！！！',
    //   service: '不支持退货'
    // },
    // {
    //   id: 1,
    //   image: '/image/sy_list/list_2.jpg',
    //   title: '净安养发',
    //   price: 0.02,
    //   stock: 200,
    //   detail: '',
    //   parameter: '',
    //   service: ''
    // },
    // {
    //   id: 2,
    //   image: '/image/sy_list/list_3.jpg',
    //   title: '舒缓调理',
    //   price: 0.03,
    //   stock: 300,
    //   detail: '这里是舒缓调理详情。',
    //   parameter: '舒缓调理舒缓调理舒缓调理好多好多钱！！！！！',
    //   service: '舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货'
    // },
    // {
    //   id: 3,
    //   image: '/image/sy_list/list_4.jpg',
    //   title: '密罗木头皮保湿',
    //   price: 0.04,
    //   stock: 400,
    //   detail: '这里是密罗木头皮保湿详情。',
    //   parameter: '密罗木头皮保湿好多好多钱！！！！！',
    //   service: '舒密罗木头皮保湿不支持退货'
    // }
    // ],
    bannerUrls: [],
    shop_list: [{
      id: 1,
      shop_name: '广州市-海珠区-丝域养发馆-翠城花园店',
      shop_phone: '020-89667567',
      shop_business_time: '10：30-22：30',
      shop_address: '广州市海珠区宝岗大道南翠宝路182号(翠城花园)1015A号铺'
    },
    {
      id: 2,
      shop_name: '广州市-海珠区-丝域养发馆-昌岗店',
      shop_phone: '020-34248872',
      shop_business_time: '10：00-22：00',
      shop_address: '广州市海珠区昌岗中路188号合生生活天地二楼212铺'
    },
    {
      id: 3,
      shop_name: '佛山市-南海区-丝域养发馆',
      shop_phone: '0757-86323969',
      shop_business_time: '10：00-22：00',
      shop_address: '佛山市南海区桂城镇中海锦城南门商业街1座10号OUT-L2-217'
    },
    {
      id: 4,
      shop_name: '佛山市-顺德区-丝域养发馆',
      shop_phone: '0757-23617171',
      shop_business_time: '10：00-22：00',
      shop_address: '佛山市顺德区容桂华夏新城北门5号铺'
    },
    {
      id: 5,
      shop_name: '佛山市-南海区-丝域养发馆',
      shop_phone: '0757-86082511',
      shop_business_time: '10：00-22：00',
      shop_address: '佛山市南海区桂城万锦豪园北门建行旁'
    },
    {
      id: 6,
      shop_name: '上海市-闵行区-丝域养发馆',
      shop_phone: '021-34293663',
      shop_business_time: '10:00-22:00',
      shop_address: '上海市闵行区万源南路99弄中庚漫游城OUT-L2-217'
    }
    ]
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'get_openid',
      complete: res => {
        // console.log('云函数在APP获取到的res111= ', res);
        var openId = res.result.openId;

        this.globalData.openId = openId;
        // console.log('云函数在APP获取到的openid ', openId, res.result.event, this.globalData.openId);//result.event.userInfo.openId
      }
    });
    // wx.cloud.callFunction({
    //   name: 'get_AccessToken',
    //   complete: res => {
    //     console.log('云函数在APP获取到的res=22222== ', res, res.event);
    //     // var access_token = res.event.access_token;

    //     // this.globalData.openId = openId;
    //     // console.log('云函数在APP获取到的access_token=== ', access_token,res)
    //   }
    // });
    // 云数据库初始化
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6"// 环境ID：wxc6c41875b492a9c0-1c74f6
    });
    //拿到表
    const seach_hot_data = db.collection('seach_hot');
    // const banner_urls_data = db.collection('banner_urls');
    // #操作表
    // 增加记录
    // orders_list.add({
    //   // data 字段表示需新增的 JSON 数据
    //   // data: JSON.parse(orders_list_String)
    //   data: orders_list_String

    // }).then(res => {
    //   console.log("DATASET==res==orders_list_String===", res, orders_list_String)
    // }).catch(err => {
    //   console.log("DATASET==res==orders_list_String===", err, orders_list_String)
    // })
    // 获取
    // orders_list.where({
    // }).get({ // get 方法会触发网络请求，往数据库取数据
    //   success: function (res) {
    //     console.log("resorders_lis=====", res)
    //   }
    // })
    // var aaa = { "hot_text": "养发" }
    // seach_hot.add({
    //   // data 字段表示需新增的 JSON 数据
    //   // data: JSON.parse(orders_list_String)
    //   data: aaa

    // });
    self=this;
    seach_hot_data.where({
      // _openid: this.data.openid
      // _id:1
    }).get({
      success: function (res){
        // console.log('[数据库] [查询记录] 成功: ', res);
        var requey_data = res.data;
        var seach_hot_1=[];
        for (var list in requey_data){
          // console.log('seach_hot===== ', list);
          seach_hot_1.push(requey_data[list]["hot_text"])
        };
        // console.log('seach_hot_1===== ', seach_hot_1);
        self.globalData.seach_hot = seach_hot_1;
        // console.log(' this.globalData===== ', self.globalData);
        

        // this.setData({
          // queryResult: JSON.stringify(res.data, null, 2)
        //   seach_hot: seach_hot
        // })
        // console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: function (res){
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        // console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {


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