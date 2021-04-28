// pages/seeleave/seeleave.js
import {request}from "../../request/index.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAskList()
  },

  //页面加载时请求 获取已经请的假
  getAskList:function(){
    let that=this
    request({url:"/ask/getAllNote"})
    .then(result=>{
      this.setData({
        askList:result.data.askList
      })
      console.log(this.data.askList)
    })
    
  },

  //点击某个请假通过
  accessLeave:function(e){
    let self=this
    //console.log(e)
    wx.showModal({
      cancelColor: '#DC143C',
      cancelText:"不通过",
      confirmText:"通过",
      content:"是否通过此申请?",
      success:res=>{
        console.log(res)
        if(res.confirm==true){
          console.log("你点击了通过")
          //request({url:"/accessLeave/access?id="+e.currentTarget.dataset.index})
          wx.request({
            url: app.globalData.baseUrl+'/accessLeave/access',
            data:{
              id:e.currentTarget.dataset.index
            },
            success:res=>{
              wx.showToast({
                title: '已通过',
              })
              self.getAskList()
            }
          })
        }else if(res.cancel==true){
          console.log("您点击了不通过")
          //request({url:"/accessLeave/noaccess?id="+e.currentTarget.dataset.index})
          wx.request({
            url: app.globalData.baseUrl+'/accessLeave/noaccess',
            data:{
              id:e.currentTarget.dataset.index
            },
            success:res=>{
              wx.showToast({
                title: '未通过',
              })
              self.getAskList()
            }
          })
        }
      }
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
})