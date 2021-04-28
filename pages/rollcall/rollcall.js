// pages/studentdetail/studentdetail.js
import {request}from "../../request/index.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentid:"",
    student:[],
    baseUrl:"",
    score:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //页面加载时将传入的参数添加到data
    this.setData({studentid:e.studentid})
    this.getStudentInfo()
    this.getImageUrl()
    
  },
  //加载时请求获取该学生的详细信息
  getStudentInfo:function(){
    request({url:"/find/findById?id="+this.data.studentid})
    .then(result=>{
      this.setData({
        student:result.data.studentList
      })
    })
  },
  //获取图片url
  getImageUrl:function(){
    this.setData({
      baseUrl:app.globalData.baseUrl+"/upload/"
    })
  },

  //分数输入
  inputScore:function(e){
      this.setData({
          score:e.detail.value
      })
  },
  //加分
  incScore:function(){
    request({url:"/teacher/incScore?score="+this.data.score+"&sno="+this.data.student.sno})
    this.getStudentInfo()
    
  },
  //减分
  decScore:function(){
    request({url:"/teacher/decScore?score="+this.data.score+"&sno="+this.data.student.sno})
    this.getStudentInfo()
  },
})