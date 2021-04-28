// pages/mine/mine.js
import {request}from "../../request/index.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    facemess:"",
    catalog:[],
    class:[],
    classNo:"",
    stuLongitude:"",
    stuLatitude:"",
    stuSignInfo:[],
    state:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that=this
    wx.showToast({
      title: '登陆成功',
    }),
    this.setData({
      //同步方式获取缓存中的user
      user:wx.getStorageSync('user')
    })
    wx.getStorage({
      key: 'catalog',
      success:res=>{
        console.log(res)
        this.setData({
          catalog:res.data
        })
      },
      fail:res=>{
        if(that.data.user.role==1){
          this.getAllitems()
        }else if(that.data.user.role==0){
          this.getTeacherItems()
        }
        
      }
    })
    
    this.getAllClass()
    //console.log(this.data.user)
    if(this.data.user.sface=="0"){
      that.setData({facemess:"你还未录入脸部信息,请移步至<信息录入>！"})
    } 
    this.getClassNo()
  },

  //点击签到结果先判断有没有结束签到
  getClassNo:function(){
    this.setData({
      classNo:wx.getStorageSync('classNo')
    })
  },
  //获取所有功能选项
  getAllitems:function(){
    //加载时获取功能的图片和文字
    request({url:"/catalog/getAllitems"})
    .then(result=>{
      this.setData({
        catalog:result.data.catitem
      })
      //console.log(this.data.catalog)
      wx.setStorage({
        data: this.data.catalog,
        key: 'catalog',
      })
    })
  },

  //获取教师的功能
  getTeacherItems:function(){
    //加载时获取功能的图片和文字
    request({url:"/catalog/getTeacherItems"})
    .then(result=>{
      this.setData({
        catalog:result.data.catitem
      })
      //console.log(this.data.catalog)
      wx.setStorage({
        data: this.data.catalog,
        key: 'catalog',
      })
    })
  },


  //通过点击事件传过来的自定义参数来判断点击的是那个功能
  funBtn:function(e){
    const index=e.currentTarget.dataset.index
    if(index===1){
      this.faceInput()
    }else if(index===2){
      if(this.data.facemess!=""){
        wx.showToast({
          title: '请前往信息录入',
          icon:"none"
        })
      }else{
        this.stuTapSign()
      }
    }else if(index===3){
      wx.navigateTo({
        url: '/pages/askLeave/askLeave',
      })
    }else if(index===4){
      wx.showToast({
        title: '该功能还未开发哦～',
        icon:"none"
      })
    }else if(index===5){
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    }
  },
  
  //学生点击签到
  stuTapSign:function(){
    let self=this
    wx.getLocation({
      isHighAccuracy:true,
      success:res=>{
        self.setData({
          stuLatitude:res.latitude,
          stuLongitude:res.longitude
        })
      }
    })
    request({url:"/student/getSignInfo?sno="+this.data.user.sno})
    .then(result=>{
      console.log(result)
      if(result.data.stuSignInfo.state!=4){
        wx.showToast({
          title: '当前没有签到任务',
          icon:"none"
        })
      }else{
        //console.log(result)
        this.setData({
          stuSignInfo:result.data.stuSignInfo
        })
      //console.log(result)
        wx.setStorage({
          data: this.data.stuSignInfo,
          key: 'stuSignInfo',
      })
      this.signImageUpload()
      }
    })
  },
  //用户签到需要上传照片
  signImageUpload:function(){
    let self=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.baseUrl+'/user/faceCom',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            account:self.data.user.sno,
            teacherLongitude:self.data.stuSignInfo.longitude,
            teacherLatitude:self.data.stuSignInfo.latitude,
            studentLatitude:self.data.stuLatitude,
            studentLongitude:self.data.stuLongitude
          },
          success(res) {
            //console.log("success")
            //console.log(res)
            var data = JSON.parse(res.data)
            console.log(data)
            if(data.distance>14){
              wx.showToast({
                title: '你不在签到范围内哦～',
                icon:"none"
              })
            }else if(data.VerifyFaceResponse==false){
              wx.showToast({
                title: '人脸不匹配哦～',
                icon:"none"
              })
            }else{
              wx.showToast({
                title: '签到成功',
              })
              //console.log("distance---"+data.distance+"---ver---"+data.VerifyFaceResponse)
            }
            
          },
          fail(res) {
            console.log("失败")
            console.log(res)
            wx.showToast({
              title: '签到失败，请重试',
              icon:"none"
            })
          }
        })
      },
    })
  },

  //当用户点击的是信息录入的时候启用该功能
  faceInput:function(){
    var self=this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(reschooseImage) {
        const tempFilePaths = reschooseImage.tempFilePaths
        self.setData({
          bookPhotoList: tempFilePaths
          
        });
        wx.uploadFile({
          url: app.globalData.baseUrl+'/user/faceUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            account:self.data.user.sno
          },

          success(result) {
            console.log("success")
            console.log(result)
            wx.showToast({
              title: '上传成功',
            })
            //上传成功后重新加载
            console.log(self.data.user)
            var face='user.sface'
            self.setData({
              [face]:1
            })
            wx.setStorage({
              data: self.data.user,
              key: 'user',
            })
            wx.reLaunch({
              url: '/pages/mine/mine',
            })
          },
          fail(res) {
            console.log("失败")
            console.log(res)
            wx.showToast({
              title: '上传失败',
              icon:"none"
            })
          }
        })
      },
    })
  },
  //教师页面功能点击
  teacherBtn:function(e){
    const index=e.currentTarget.dataset.index
    if(index===1){
      wx.navigateTo({
        url: '/pages/studentinfo/studentinfo',
      })
    }else if(index===2){
        wx.navigateTo({
          url: '/pages/signin/signin',
        })
    }else if(index===3){
      wx.navigateTo({
        url: '/pages/seeleave/seeleave',
      })
    }else if(index===4){
      // if(this.data.classNo!="")
        console.log(this.data.classNo=="")
        wx.navigateTo({
          url: '/pages/signresult/signresult',
        })

      
    }else if(index===5){
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    }else if(index===6){
      wx.navigateTo({
        url: '/pages/classremain/classremain',
      })
    }
  },

  
  //获取目前所有班级
  getAllClass:function(){
    request({url:"/teacher/getAllClass"})
    .then(result=>{
      this.setData({
        class:result.data.result
      })
      //console.log(result)
      console.log(this.data.class)
      wx.setStorage({
        data: this.data.class,
        key: 'class',
      })
    })
  }
})