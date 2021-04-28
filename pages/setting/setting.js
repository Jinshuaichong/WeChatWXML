// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户缓存
    this.getUserStorage()
    console.log(this.data.user)
  },

  logout:function(){
    wx.clearStorage({
      success: (res) => {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      },
    })
  },


  getUserStorage:function(){
    this.setData({
      user:wx.getStorageSync('user')
    })
  },
})