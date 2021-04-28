// pages/askLeave/askLeave.js
import {request}from "../../request/index.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    askList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
    this.getAskList()
  },

  //获取缓存
  getUser:function(){
    let that=this
    this.setData({
      user:wx.getStorageSync('user')
    })
  },

  


  uploadNote:function(){
    var self=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        self.setData({
          bookPhotoList: tempFilePaths
        });
        wx.uploadFile({
          url: app.globalData.baseUrl+'/ask/askleave',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
          account:self.data.user.sno,
          sclass:self.data.user.sclass
        },
          success(res) {
            // console.log("success")
            // console.log(res)
            wx.showToast({
              title: '上传成功',
            })
            self.getAskList()
          },
          fail(res) {
            // console.log("失败")
            // console.log(res)
            wx.showToast({
              title: '上传失败',
              icon:"none"
            })
          }
        })
      },
    })
  },

  //页面加载时请求 获取已经请的假
  getAskList:function(){
    console.log(this.data.user)
    let that=this
    request({url:"/ask/getNote?account="+this.data.user.sno})
    .then(result=>{
      this.setData({
        askList:result.data.askList
      })
      console.log(this.data.askList)
    })
    if(!this.data.askList){
      wx.showToast({
        title: '加载失败',
        icon:"none"
      })
    }
    
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

  //删除已通过的请假
  deleteNote:function(e){
    let self=this
    console.log(this.data.user.sno)
    wx.request({
      url: app.globalData.baseUrl+'/ask/deleteNote',
      data:{
        account:this.data.user.sno
      },
      success:res=>{
        console.log(res)
        if(res.data.delteRows>0){
          wx.showToast({
            title: '删除成功',
          })
        }else{
          wx.showToast({
            title: '没有可删除的请假申请哦～',
          })
        }
        self.getAskList()
      },
      fail:res=>{
        wx.showToast({
          title: '删除失败,请稍后再试',
          icon:"none"
        })
      }
    })
  },
}) 