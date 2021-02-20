import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data:{
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ]
  },

  onShow(options){
    // 获取请求历史订单数据的必要参数type
    // 在此之前需获取token
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return
    };

    // 获取当前小程序的页面栈数组（长度最大为10）
    let pages = getCurrentPages();
    // 索引最大项为当前页
    let currentPage = pages[pages.length - 1];
    // 获取url上的type
    const {type} = currentPage.options;
    // 激活选中页面的标题，type=1时index=0
    this.handleTitleByIndex(type-1);
    // 获取历史订单
    this.getOrders(type);
  },
  
  // 定义方法：获取历史订单数据
  async getOrders(type){
    const res = await request({url:"/my/orders/all",data:{type}});
    this.setData({
      // 简单处理下订单日期格式
      orders:res.orders.map(v => ({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  
  // 定义标题栏点击事件，该事件受Tabs子组件影响而触发
  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index} = e.detail;
    this.handleTitleByIndex(index);
    // 重新发送请求 type=1时index=0
    this.getOrders(index+1)
  },

  // 封装函数：根据标题索引激活选中标题数组
  handleTitleByIndex(index){
    // 修改tabs里的isActive值
    let {tabs} = this.data;
    tabs.forEach((v,i) => {i === index? v.isActive = true : v.isActive = false});
    this.setData({tabs})
  }



})