let timeId = null;
var app = getApp();
var seach_hot = app.globalData.seach_hot;
var product_list = app.globalData.product_list;
Page({
  data: {
    history: [],
    // hot: ['新鲜芹菜', '大红枣', '滋补桂圆干'],
    hot: seach_hot,
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
    for (var key in product_list) {
      var title = product_list[key]["title"]
      keywords.push(title);
    }
    // console.log("keywords===", keywords);
    this.setData({
      keywords: keywords,
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
    // console.log("keywords===", e.detail.value);
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
  keywordHandle(e) {
    const text = e.target.dataset.text;
    // console.log("keywordHandle", text);
    var results=[];
    for (var key in product_list) {
      var title = product_list[key]["title"];
      if (title.indexOf(text)>=0){
        results.push(product_list[key]);

      };
      console.log("results", results);
    }

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