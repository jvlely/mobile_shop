
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    // 被点击的左侧菜单索引
    currentIndex:0
  },

  // 接口的返回数据
  Cates:[],

  onLoad: function(options){
    // 使用缓存技术，因为请求数据太大了

    // 获取本地缓存中的数据
    const Cates = wx.getStorageSync("cates");
    // 判断是否为空
    if(!Cates){
      // 为空
      this.getCates();
    }else{
      // 有旧的数据，定义过期时间，10分钟
      if(Date.now() -Cates.time > 1000*600){
        // 间隔大于10分钟，重新发送请求
        this.getCates();
      }else{
        // 使用旧数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

    
  },

  // 定义函数获取分类数据
  // getCates(){
  //   request({url:"/categories"})
  //   .then(result => {
  //     this.Cates = result;

  //     // 把接口数据存到本地存储中
  //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});;

  //     // 构建左侧菜单数据
  //     let leftMenuList = this.Cates.map(v => v.cat_name);
  //     // 构建右侧商品数据
  //     let rightContent = this.Cates[0].children;
  //     // 传到data里
  //     this.setData({
  //       leftMenuList,
  //       rightContent
  //     })
  //   })
  // },

  // 定义函数获取分类数据(使用es7)
  async getCates(){
    // 1 使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children;
    // 传到data里
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 定义左侧菜单点击事件
  handleItemTap(e){
    // 获取被点击标题身上的索引
    const {index} = e.currentTarget.dataset;
    // 根据不同的标题渲染右侧的商品内容
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,//给data中currentIndex赋值，实现被点击的标题变红
      rightContent
    })
    
    
  }


})