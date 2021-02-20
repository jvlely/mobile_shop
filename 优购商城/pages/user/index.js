// pages/category/index.js
Page({

  data:{
    userinfo:{},
    // 被收藏的商品数量
    collectedNums:0
  },

  onShow(){
    const userinfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      userinfo,
      collectedNums:collect.length
    })
  }
})