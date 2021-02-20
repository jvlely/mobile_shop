// pages/category/index.js
Page({

  data:{
    collect:[],
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        value:"浏览足迹",
        isActive:false
      }
    ]
  },

  onShow(){
    const collect = wx.getStorageSync("collect")||[];
    this.setData({collect});
  },

  // 定义标题栏点击事件，该事件受Tabs子组件影响而触发
  handleTabsItemChange(e){
    const {index} = e.detail;
    // 修改tabs里的isActive值
    let {tabs} = this.data;
    tabs.forEach((v,i) => {i === index? v.isActive = true : v.isActive = false});
    this.setData({tabs})
  }


})