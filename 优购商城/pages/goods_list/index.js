
import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },

  // 定义接口要的参数
  queryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10,
  },

  // 总页数
  totalPages:1,

  onLoad: function(options){
    this.queryParams.cid = options.cid||"";
    this.queryParams.query = options.query||"";
    this.getGoodsList();
  },

  // 定义函数获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.queryParams});
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.queryParams.pagesize);
    this.setData({
      // 拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    });

    // 关闭下拉刷新的窗口，如果没有调用下拉刷新窗口，直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 定义标题栏点击事件，该事件受Tabs子组件影响而触发
  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改tabs数组中的isActive值
    let {tabs} = this.data;
    tabs.forEach((v,i) => {i===index? v.isActive=true :v.isActive=false});
    // 赋值到data中
    this.setData({
      tabs
    });

    
  },

  /* 定义下拉刷新事件
     需要先到json文件中添加"enablePullDownRefresh":true和"backgroundTextStyle":"dark" 
  */
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      goodsList:[]
    });
    // 重置页码
    this.queryParams.pagenum = 1;
    // 发送请求重新获取数据
    this.getGoodsList()
  },

  // 定义页面下滑，滚动条触底后自动加载下一页数据的事件
  onReachBottom(){
    // 先判断还有没有下一页数据
    if(this.queryParams.pagenum >= this.totalPages){
      // 没有
      wx.showToast({ title: '到底了！'});
    }else{
      // 有
      this.queryParams.pagenum++;
      this.getGoodsList()
    }
  }

})