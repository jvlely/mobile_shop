
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  // 监听页面显示事件
  onShow: function(){
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address")||{};
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    // every方法：只有商品中所有复选框被选中才返回true
    // const allChecked = cart.length?cart.every(v => v.checked):false;
    
    // 将缓存中的数据加入data中
    this.setData({address}),
    this.setCart(cart)
  },

  // 定义函数：获取收货地址
  async handleChooseAddress(){
    try{
      // 获取权限状态：检查用户是否授权
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断
      if(scopeAddress === false){
        // 用户申请过但拒绝了，则诱导再授权
        await openSetting()
      }
      // 统一调用获取用户收货地址的api
      let address = await chooseAddress();
      // 定义address.all：地址详情显示内容
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // 将address存入到缓存中
      wx.setStorageSync("address", address);

    }catch(err){
      console.log(err)
    }
  },

  // 定义函数：商品复选框被点击
  handleItemChange(e){
    // 获取被点击的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被点击的商品对象的索引
    const index = cart.findIndex(v => v.goods_id === goods_id);
    // 复选框选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);    
  },

  // 定义函数：全选商品功能
  handleItemAllCheck(){
    // 获取data中的数据
    let {cart,allChecked} = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环cart数组，修改里面的checked值
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值传回data和缓存
    this.setCart(cart);
  },

  // 定义函数：商品数量的编辑
  async handleItemNumEdit(e){
    // 获取传递过来的参数
    const {id,change} = e.currentTarget.dataset;
    // 获取购物车数组
    const {cart} = this.data;
    // 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if(cart[index].num === 1 && change === -1){
      // 弹窗提示是否删除
      const res = await showModal({content:"您是否要删除？"});
      if(res.confirm){
        // 确定
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      // 修改商品数量
      cart[index].num += change;
      this.setCart(cart);
    }
  },

  // 定义函数：实现结算功能
  async handlePay(){
    const {address,totalNum} = this.data;
    if(!address.userName){
      // 地址里没有用户名，即地址为空的时候
      await showToast({title:"您还没有选择收货地址"});
      return;
    };
    if(totalNum === 0){
      // 购物车里无商品
      await showToast({title:"您还没有选购商品"});
      return
    };
    // 有地址有商品，跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  },

  // 封装函数，设定购物车状态，同时重新计算底部工具栏属性(全选、总价、数量)
  setCart(cart){
    let allChecked = true;
    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
      }else{
        // 未被全选中
        allChecked = false
      }
    })
    // 排除cart为空时allChecked会为true的情况
    allChecked = cart.length!=0?allChecked:false;

    // 传回data和缓存
    this.setData({cart,allChecked,totalPrice,totalNum});
    wx.setStorageSync("cart", cart);
  }
})