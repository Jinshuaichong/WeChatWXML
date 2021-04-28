// pages/signresult/signresult.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentList:[],
    baseUrl:"",
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getResultStudentList()
    this.getImageUrl()
  },

  //页面加载时获取签到的学生数据
  getResultStudentList:function(){
    this.setData({
      studentList:wx.getStorageSync('ResultStudentList')
    })
  },

  getImageUrl:function(){
    this.setData({
      baseUrl:app.globalData.baseUrl+"/upload/"
    })
    //console.log(this.data.baseUrl)
  },
})