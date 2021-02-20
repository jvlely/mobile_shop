
import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
import {login} from "../../utils/asyncWx.js"
Page({

  async handleGetUserInfo(e){
    try {
    // 获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail;
    // 获取小程序登录成功后的code
    const {code} = await login();
    // 将获取token所需的五个参数合一
    const loginParams = {encryptedData,rawData,iv,signature,code};
    // 发送请求，获取用户token
    const token = await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    // 注：没有企业账号，获取到的token值为空，属正常现象
    // 把token值存回缓存
    wx.setStorageSync("token", token);
    // 跳转回上一个页面
    wx.navigateBack({
      delta: 1
    });

    } catch (error) {
      console.log(error)  
    }
  }
})