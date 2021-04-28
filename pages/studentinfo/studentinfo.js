// pages/studentinfo/studentinfo.js
import {request}from "../../request/index.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:"",
    studentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllStudent()
    this.getImageUrl()
  },

  //获取图片url
  getImageUrl:function(){
    this.setData({
      baseUrl:app.globalData.baseUrl+"/upload/"
    })
    console.log(this.data.baseUrl)
  },

  //请求获取所有学生信息
  getAllStudent:function(){
    request({url:"/find/findAll"})
    .then(result=>{
      this.setData({
        studentList:result.data.studentList
      })
      //console.log(result)
      console.log(this.data.studentList)
    })
  },

  //图片点击预览
  topic_preview: function(e){
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  },

  //点击查看详情
  detailInfo:function(e){
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/studentdetail/studentdetail?studentid='+e.currentTarget.dataset.index,
    })
  },
})