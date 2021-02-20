
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    goodsObj:{},
    isCollect:false
  },

  // 建一个商品对象存储数据
  GoodsInfo:{},

  // 监听页面显示，与onLoad的区别是没有options参数
  onShow: function(){
    // 获取options参数，getCurrentPages方法为获取当前页面栈,数组第一个为首页，最后一个为当前页
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
    
  },

  // 定义函数：获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    // 把值也传给GoodsInfo
    this.GoodsInfo = goodsObj;

    // 实现商品收藏功能
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断当前商品是否被收藏，some方法只要调用数组中有一个为true即为true
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机不识别webp图片格式 
        // 最好找到后台让他进行修改 
        // 若临时自己改，需确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  // 定义事件：点击轮播图时放大预览
  handlePreviewImage(e){
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接收点击时传递过来的图片url
    const currentUrl = e.currentTarget.dataset.url;
    wx.previewImage({
      current: currentUrl,// 当前显示的图片链接
      urls:urls// 需要预览的图片链接列表
    });
  },

  // 定义事件：点击按钮加入购物车
  handleCartAdd(e){
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    // 判断商品对象是否存于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      // 不存在，即第一次加购
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);// 把GoodsInfo对象里的数据添加入缓存中
    }else{
      // 存在，执行num++
      cart[index].num++;
    }
    // 再重新把cart添加回缓存
    wx.setStorageSync("cart", cart);
    // 弹窗提示加购成功
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true// 设置点击间隔
    });
  },

  // 定义事件：点击商品收藏图标
  handleCollect(){
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index !== -1){
      // 已收藏，则在数组中删除该商品
      collect.splice(index,1);//splice方法删除索引项
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: false
      });
    }else{
      // 未收藏
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: false
      });
    }
    // 再重新把collect添加回缓存
    wx.setStorageSync("collect", collect);
    // 修改data中的isCollect属性
    this.setData({
      isCollect
    })
  }

})