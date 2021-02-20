
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },

  // 监听页面显示事件
  onShow: function(){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address")||{};
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    // 过滤复选框被选中的数组
    cart = cart.filter(v => v.checked);    

    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num*v.goods_price;
      totalNum += v.num;      
    })

    this.setData({cart,totalPrice,totalNum,address});
  },

  // 定义方法：实现支付功能
  async handleOrderPay(){
    try {
    const token = wx.getStorageSync("token");
    // 判断缓存中有无token值
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }

    // 创建订单
    // 准备请求头
    // const header = {Authorization:token}
    // 准备请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }));
    // 合并创建订单请求头所需参数
    const orderParams = {order_price,consignee_addr,goods};
    // 发送请求，创建订单，获取订单编号
    const {order_number} = await request({url:"/my/orders/create",data:orderParams,method:"post"});
    // 发起预支付接口
    const {pay} = await request({url:"/my/orders/req_unifiedorder",data:{order_number},method:"post"});
    // 发起微信支付
    await requestPayment(pay);
    // 查询后台订单状态，是否支付成功
    const res = await request({url:"/my/orders/chkOrder",data:{order_number},method:"post"});
    await showToast({title:"支付成功"});
    // 手动删除缓存中已经支付了的商品
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v => !v.checked);
    wx.setStorageSync("cart", newCart);
    // 支付成功了跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    });

    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error)
    }

  }

})