// pages/category/index.js
Page({

  data:{
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 文本域的内容
    textVal:'',
    // 选择的图片路径数组
    chooseImgs:[]
  },
  // 上传外网的图片路径数组
  UpLoadImgs:[],

  // 定义标题栏点击事件，该事件受Tabs子组件影响而触发
  handleTabsItemChange(e){
    const {index} = e.detail;
    // 修改tabs里的isActive值
    let {tabs} = this.data;
    tabs.forEach((v,i) => {i === index? v.isActive = true : v.isActive = false});
    this.setData({tabs})
  },

  // 定义文本域的输入事件
  handleTextInput(e){
    this.setData({
      // 输入的内容传到data中
      textVal:e.detail.value
    })
  },

  // 定义添加图片事件
  handleChooseImg(){
    // 调用小程序添加图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          // 对所中过的图片路径拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    })
  },

  // 定义删除图片事件
  handleRemoveImg(e){
    // 获取被点击的图片的索引
    const {index} = e.currentTarget.dataset;
    // 获取data中的图片数组
    const {chooseImgs} = this.data;
    // 删除该元素
    chooseImgs.splice(index,1);
    this.setData({chooseImgs})
  },

  // 定义事件：点击提交按钮
  handleFormSubmit(){
    // 获取文本域中的文本、图片数组
    const {textVal,chooseImgs} = this.data;
    // 进行合法性验证
    if(!textVal.trim()){
      // 文本为空
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    };
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 准备上传图片到专门的服务器，因为上传的api不支持多个文件同时上传，所以只能遍历数组逐一上传
    // 判断有没有需要上传的图片数组
    if(chooseImgs.length != 0){
      chooseImgs.forEach((v,i) => {
        wx.uploadFile({
          // 图片上传到哪
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的图片路径
          filePath: v,
          // 名称
          name: 'file',
          // 顺带信息
          formData: {},
          success: (result)=>{
            console.log(result);
            // Json.parse方法是将字符串转化为对象
            let url = Json.parse(result.data).url;
            this.UpLoadImgs.push(url);

            // 等待所有图片上传完毕才触发
            if(i === chooseImgs.length - 1){
              wx.hideLoading();
              console.log("上传完毕");
              // 重置页面
              this.setData({
                textVal:'',
                chooseImgs:[]
              });
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    }else{
      wx.hideLoading();
      console.log("只提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }

  }

  
})