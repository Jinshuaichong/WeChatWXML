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
    baseUrl:""
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
      //console.log(result)
      console.log(this.data.student)
    })
  },

  //获取图片url
  getImageUrl:function(){
    this.setData({
      baseUrl:app.globalData.baseUrl+"/upload/"
    })
    //console.log(this.data.baseUrl)
  },

  //删除学生
  deleteStudent:function(){
    let self=this
    //console.log(e)
    wx.showModal({
      cancelColor: '#DC143C',
      cancelText:"否",
      confirmText:"是",
      content:"是否删除此学生?",
      success:res=>{
        console.log(res)
        if(res.confirm==true){
          //console.log("你点击了通过")
          //request({url:"/accessLeave/access?id="+e.currentTarget.dataset.index})
          wx.request({
            url: app.globalData.baseUrl+'/delete/deleteUserById',
            data:{
              id:this.data.studentid
            },
            success:res=>{
              wx.showToast({
                title: '删除成功,请重新进入信息查看',
                icon:"none"
              })
            }
          })
          wx.navigateBack({
            delta: 1,
          })
        }else if(res.cancel==true){
          //console.log("您点击了不通过")
          //request({url:"/accessLeave/noaccess?id="+e.currentTarget.dataset.index})
        }
      }
    })
  },

  
  

})