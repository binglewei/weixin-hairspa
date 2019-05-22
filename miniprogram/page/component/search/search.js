let timeId = null;
var app = getApp();
// var seach_hot = app.globalData.seach_hot;

Page({
  data: {
    history: [],
    // hot: ['新鲜芹菜', '大红枣', '滋补桂圆干'],
    hot: "app.globalData.seach_hot",
    result: [],
    // result: [
    //     {
    //         id: 1,
    //         url: '../details/details',
    //         thumb: '/image/s4.png',
    //         title: '瓜子 100g',
    //         price: 0.01
    //     }
    // ],
    showKeywords: false,
    keywords: [],
    // keywords: ['山东肚脐橙', '湖南冰糖橙', '麻涌香蕉', '冰糖心苹果'],
    value: '',
    showResult: false,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var keywords = [];
    
    const db = wx.cloud.database({
      env: "wxc6c41875b492a9c0-1c74f6" // 环境ID：wxc6c41875b492a9c0-1c74f6
    });
    const product_list_data = db.collection('product_list');
    product_list_data.where({
      // _openid: this.data.openid
      // _id:1
      // type: 2
    }).get({
      success: function (res) {
        console.log('[数据库] [查询product_list_data记录]222 成功: ', res);
        var product_list = res.data;
        // console.log('banner_urls_1========== ', banner_urls_1);
        app.globalData.product_list = product_list;
        self.setData({
          product_list: product_list,
          // product_list: product_list
        });
        // console.log('bannerUrls====3333333====== ', self.data);
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    var product_list = this.data.product_list;
    for (var key in product_list) {
      var title = product_list[key]["title"]
      keywords.push(title);
    }
    // console.log("keywords===", keywords);
    var seach_hot = app.globalData.seach_hot;
    this.setData({
      keywords: keywords,
      hot:seach_hot
    });
  },
  cancelSearch() {
    this.setData({
      showResult: false,
      showKeywords: false,
      value: ''
    })
  },
  searchInput(e) {
    console.log("keywords===", e.detail.value);
    this.keywordHandle("",e.detail.value);
    if (!e.detail.value) {
      this.setData({
        showKeywords: false
      })
    } else {
      if (!this.data.showKeywords) {
        timeId && clearTimeout(timeId);
        timeId = setTimeout(() => {
          this.setData({
            showKeywords: true
          })
        }, 1000)
      }
    }
  },
  // 处理搜索结果
  keywordHandle(e,textinput) {
    if (e){
      var text = e.target.dataset.text;
      
    }else{
      var text=textinput;
    }
    console.log("keywordHandle====", e, text);
    var results=[];
    var product_list=app.globalData.product_list;
    for (var key in product_list) {
      var title = product_list[key]["name"];
      if (title.indexOf(text)>=0){
        results.push(product_list[key]);

      };
      
    }
    console.log("results", results);

    this.setData({
      value: text,
      result: results,
      showKeywords: false,
      showResult: true
    })
    this.historyHandle(text);
  },
  // 处理搜索记录的添加和删除

  historyHandle(value) {
    let history = this.data.history;
    const idx = history.indexOf(value);
    if (idx === -1) {
      // 搜索记录只保留8个
      if (history.length > 7) {
        history.pop();
      }
    } else {
      history.splice(idx, 1);
    }
    history.unshift(value);
    wx.setStorageSync('history', JSON.stringify(history));
    this.setData({
      history
    });
  },
  onLoad() {
    const history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        history: JSON.parse(history)
      })
      console.log("history",this.data.history);
    }
  }
})