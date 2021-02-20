
// 引入用来发送请求的方法
import {request} from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航数组
    cateList:[],
    // 楼层数据
    floorList:[]
  },

  // 页面加载时就会触发的函数
  onLoad:function(options){
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 定义获取轮播图数据的方法
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result => {
      this.setData({
        swiperList:result
      })
    })
  },

  // 定义获取导航数据的方法
  getCateList(){
    request({url:"/home/catitems"})
    .then(result => {
      this.setData({
        cateList:result
      })
    })
  },

  // 定义获取楼层数据的方法
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result => {
      this.setData({
        floorList:result
      })
    })
  }
});