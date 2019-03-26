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
    hasLogin: false,
    cart_totalNums:{},
    product_list: [{
      id: 1,
      image: '/image/sy_list/list_1.jpg',
      title: '草本养发',
      price: 0.01,
      stock: 10,
      detail: '这里是草本养发详情。',
      parameter: '好多好多钱！！！！！',
      service: '不支持退货'
    },
    {
      id: 2,
      image: '/image/sy_list/list_2.jpg',
      title: '净安养发',
      price: 0.02,
      stock: 200,
      detail: '',
      parameter: '',
      service: ''
      },
      {
        id: 3,
        image: '/image/sy_list/list_3.jpg',
        title: '舒缓调理',
        price: 0.03,
        stock: 300,
        detail: '这里是舒缓调理详情。',
        parameter: '舒缓调理舒缓调理舒缓调理好多好多钱！！！！！',
        service: '舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货,舒缓调理舒缓调理舒缓调理不支持退货'
      } ,
      {
        id: 4,
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
        shop_name: '广州市-海珠区-丝域翠城花园店',
        shop_phone: '020-89667567',
        shop_business_time: '10：30-22：30',
        shop_address: '广州市海珠区宝岗大道翠宝路182号'
      },
      {
        id: 2,
        shop_name: '广州市-海珠区-昌岗店',
        shop_phone: '020-89667567-2',
        shop_business_time: '10：30-22：30',
        shop_address: '广州市海珠区宝岗大道翠宝路182号---22222'
      },
      {
        id: 3,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: '车陂南'
      },
      {
        id: 4,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 5,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 6,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 7,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      },
      {
        id: 8,
        shop_name: '广州市-',
        shop_phone: '',
        shop_business_time: '10：30-22：30',
        shop_address: ''
      }
    ]
  }
})