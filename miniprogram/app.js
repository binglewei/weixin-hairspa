App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {

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

  },
  globalData: {
    appId: 'wxc6c41875b492a9c0',
    hasLogin: false,
    address: {
      name: '',
      phone: '',
      gender: '',
      birthday: '',
      detail: ''
    },
    seach_hot: ['草本养发', '净安养发'],
    cart_totalNums: {},
    // cart_totalNums: { 0: { id: 0, title: '新鲜芹菜 半斤', image: '/image/s5.png', num: 4, price: 0.01, selected: true }},
    product_list: [{
        id: 0,
        image: '/image/sy_list/list_1.jpg',
        title: '草本养发',
        price: 0.01,
        stock: 10,
        detail: '这里是草本养发详情。',
        parameter: '好多好多钱！！！！！',
        service: '不支持退货'
      },
      {
        id: 1,
        image: '/image/sy_list/list_2.jpg',
        title: '净安养发',
        price: 0.02,
        stock: 200,
        detail: '',
        parameter: '',
        service: ''
      },
      {
        id: 2,
        image: '/image/sy_list/list_3.jpg',
        title: '舒缓调理',
        price: 0.03,
        stock: 300,
        detail: '这里是舒缓调理详情。',
        parameter: '舒缓调理舒缓调理舒缓调理好多好多钱！！！！！',
        service: '舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货'
      },
      {
        id: 3,
        image: '/image/sy_list/list_4.jpg',
        title: '密罗木头皮保湿',
        price: 0.04,
        stock: 400,
        detail: '这里是密罗木头皮保湿详情。',
        parameter: '密罗木头皮保湿好多好多钱！！！！！',
        service: '舒密罗木头皮保湿不支持退货'
      }
    ],
    bannerUrls: [
      '/image/sy_banner/banner_1.jpg',
      '/image/sy_banner/banner_2.jpg',
      '/image/sy_banner/banner_3.jpg',
      '/image/sy_banner/banner_4.jpg'
    ],
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
      // {
      //   id: 6,
      //   shop_name: '上海市-闵行区-丝域养发馆',
      //   shop_phone: '021-34293663',
      //   shop_business_time: '10:00-22:00',
      //   shop_address: '上海市闵行区万源南路99弄中庚漫游城OUT-L2-217'
      // }
    ]
  }
})