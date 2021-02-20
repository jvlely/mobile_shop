/** 
 * promise形式的getSetting（返回用户已经授权过的权限的api）
 */
export const getSetting = function(){
  return new Promise((resolve,reject) =>{
    wx.getSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/** 
 * promise形式的chooseAddress（调起用户获取收货地址的api）
 */
export const chooseAddress = function(){
  return new Promise((resolve,reject) =>{
    wx.chooseAddress({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/** 
 * promise形式的openSetting（调起用户已经请求过的权限的api）
 */
export const openSetting = function(){
  return new Promise((resolve,reject) =>{
    wx.openSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/** 
 * promise形式的showModal（显示模态对话框的api）
 * @param {object} content
 */
export const showModal = function({content}){
  return new Promise((resolve,reject) =>{
    wx.showModal({
      title:"提示",
      content:content,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/** 
 * promise形式的showToast（显示消息对话框的api）
 * @param {object} title
 */
export const showToast = function({title}){
  return new Promise((resolve,reject) =>{
    wx.showToast({
      title:title,
      icon:'none',
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/** 
 * promise形式的login（调用接口获取登录凭证（code）的api）
 */
export const login = function(){
  return new Promise((resolve,reject) =>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/** 
 * promise形式的requestPayment（调用发起微信支付的api）
 * @param {object} pay
 */
export const requestPayment = function(pay){
  return new Promise((resolve,reject) =>{
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}