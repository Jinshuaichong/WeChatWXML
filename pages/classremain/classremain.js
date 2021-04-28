// pages/signin/signin.js
import {request}from "../../request/index.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classNo:null,
    classData:null,
    classJie:null,
    className:null,
    classArrd:null,
    access_token:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccess_token()
  },
    //获取accesstoken
    getAccess_token:function(){
      let self=this
      request({url:"/requestaccess_token/getaccess_token"})
      .then(result=>{
        self.setData({
          access_token:result.data.access_token
        })
        //console.log(this.data.access_token)
      })
    },

  //获取老师的id
  getTeacherNum:function(){
    this.setData({
      teacher:wx.getStorageSync('user')
    })
  },
  sendMessage:function(e){
    this.setData({
      classNo:e.detail.value.classNo,
      classData:e.detail.value.class_data,
      classJie:e.detail.value.class_jie,
      className:e.detail.value.class_name,
      classArrd:e.detail.value.class_addr
    })
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+this.data.access_token,
      method:"POST",
      data:{
        "touser": "oOAaf4pAwWq5XwPB-qX7wA4tN_Ls",
        "template_id": "omDT1WbyrkU43YG41Vt_2X8B2oEmaHqYr_U5tXbqMLg",
        "miniprogram_state":"developer",
        "lang":"zh_CN",
        "data": {
            "date1": {
                "value": "2021-04-26"
            },
            "thing4":{
                "value":this.data.classJie
            },
            "thing6":{
              "value":this.data.className
            },
            "thing10":{
              "value":this.data.classArrd
            }
        }
      },
      success(res){
        console.log(res)
      }
    })

    console.log(this.data)
  },

  //页面加载时获得学生人数
  getStuNum:function(){
    this.setData({
      stuNumber:wx.getStorageSync('stuNumber')
    })
    console.log("stuNumber---"+wx.getStorageSync('stuNumber'))
  },
})