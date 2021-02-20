import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data:{
    goods:[],
    // 取消按钮是否显示
    isShow:false,
    // 输入框的值
    inpValue:''
  },
  // 定时器id
  TimeId:-1,

  // 定义事件：输入框值改变就会触发的
  handleInput(e){
    // 获取输入框的值
    const {value} = e.detail;
    // 如果不合法
    if(!value.trim()){//空值
      this.setData({
        goods:[],
        isShow:false
      })
      return;
    };
    // 准备发送请求获取数据
    this.setData({isShow:true});
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    },1000)
  },

  // 发送请求获取搜索建议的数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    this.setData({goods:res})
  },

  // 定义事件：点击取消按钮
  handleCancel(){
    this.setData({
      goods:[],
      isShow:false,
      inpValue:''
    })
  }


})