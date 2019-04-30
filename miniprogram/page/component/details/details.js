// page/component/details/details.js
var app = getApp();
// var cart_totalNums = app.globalData.cart_totalNums;

// var cart_totalNums = ;
// var totalNum=0;

Page({
  data: {
    goods: {},
    // cart_totalNums: app.globalData.cart_totalNums,
    num: 1,
    // totalNum: 
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  onLoad: function(options) {
    // console.log("options===", options)
    // 页面初始化 options为页面跳转所带来的参数
    var product_list = app.globalData.product_list;
    var id = options.id;
    console.log("id===", id)
    for (var index in product_list) {
      var product_1 = product_list[index]
      var product_id = product_1["id"]
      if (product_id == id) {
        var product = product_1
        console.log("product===", product)
        this.setData({
          // hasList: true,
          goods: product
        })
      }
      console.log("product_1=product_id=this.goods=", product_1, this.data.goods)


    }

  },
  //单品增加
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },
  //增加到购物车
  addToCart() {
    var product_list = app.globalData.product_list;
    const self = this;
    const num = this.data.num;
    const product_id = this.data.goods.id;
    var totalNum = 0;
    var cart_totalNums = app.globalData.cart_totalNums;
    console.log(" product_list, num, product_id, cart_totalNums===", product_list, num, product_id, cart_totalNums);
    for (var key in cart_totalNums) {
      totalNum = totalNum + cart_totalNums[key]["num"]
    };
    const total = totalNum;
    // console.log("product_id===", product_id)
    self.setData({
      show: true
    })
    setTimeout(function() {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function() {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
        if (cart_totalNums[product_id]) {
          app.globalData.cart_totalNums[product_id]["num"] = num + app.globalData.cart_totalNums[product_id]["num"];
          app.globalData.cart_totalNums[product_id]["selected"] = true;
        } else {
          console.log(" this.goods=1111==", self.data.goods)
          app.globalData.cart_totalNums[product_id] = self.data.goods;
          console.log(" app.globalData.cart_totalNums===", app.globalData.cart_totalNums)
          app.globalData.cart_totalNums[product_id]["num"] = num;
          app.globalData.cart_totalNums[product_id]["selected"] = true;
        }

        console.log("totalNum===", app.globalData.cart_totalNums)
      }, 200)
    }, 300)

  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }

})