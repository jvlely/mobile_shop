// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收goods_list的js中传递过来的数据
    tabsb:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 标题栏的点击事件
    handleItemTap(e){
      // 获取点击对象的索引
      const {index} = e.currentTarget.dataset;
      // 触发父组件中的自定义事件
      this.triggerEvent("tabsItemChange",{index})
    }
  }
})
