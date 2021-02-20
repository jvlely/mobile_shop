
// 定义request方法，用来请求数据

// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接header 带上token
    header["Authorization"]=wx.getStorageSync("token");
  };
  
  ajaxTimes++;
  // 显示加载中效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  // 定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,// 解构，即把所有在params之前的参数都拿出来
      header:header,
      url: baseUrl + params.url,
      success: (result)=>{
        resolve(result.data.message)
      },
      fail: (err)=>{
        reject(err)
      },
      complete: ()=>{
        ajaxTimes--;
        if(ajaxTimes === 0){
          // 关闭正在等待图标
          wx.hideLoading();
        }
      }
    });
  })
}