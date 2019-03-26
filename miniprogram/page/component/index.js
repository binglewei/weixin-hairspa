var app = getApp();
var bannerUrls = app.globalData.bannerUrls;
var product_list = app.globalData.product_list;
Page({
  data: {
    bannerUrls:bannerUrls,
    product_list: product_list,
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  }
})