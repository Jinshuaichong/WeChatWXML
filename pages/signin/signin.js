// pages/signin/signin.js
import {request}from "../../request/index.js"
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:"",
    teacher:"",
    studentList:[],
    stuNumber:"",
    hasData:0,
    classNo:"",
    longitude:"",
    latitude:"",
    baseUrl:"",
    actionSheetHidden:true,
    stuRollCall:[],
    actionSheetItems:[
      {bindtap:'Menu1',txt:'已到',data:'1'},
      {bindtap:'Menu2',txt:'请假',data:'2'},
      {bindtap:'Menu3',txt:'迟到',data:'3'},
      {bindtap:'Menu4',txt:'未到',data:'4'}
    ],
    access_token:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStudentList()
    if(this.data.studentList.length==0){
      this.getTeacherNum()
    }
    this.getLoc()
    this.getImageUrl()
    this.getStuNum()
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
  //进入时看看是不是已经有签到任务
  getStudentList:function(){
    this.setData({
      studentList:wx.getStorageSync('studentList'),
      classNo:wx.getStorageSync('classNo')
    })
    if(this.data.studentList.length!=0){
      this.setData({hasData:1})
    }
  },

  //页面加载时获取位置
  getLoc:function(){
    let self=this
    wx.getLocation({
      isHighAccuracy:true,
      success:res=>{
        self.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      }
    })
  },

  //获取老师的id
  getTeacherNum:function(){
    this.setData({
      teacher:wx.getStorageSync('user')
    })
  },
  //表单提交事件
  getClass:function(e){
    let self=this
    if(e.detail.target.dataset.id==1){
      if(e.detail.value.classNo==""){
        wx.showToast({
          title: '请输入班级号～',
          icon:"none"
        })
      }else{
        this.setData({
          classNo:e.detail.value.classNo,
          hasData:1
        })
        wx.setStorage({
          data: this.data.classNo,
          key: 'classNo',
        })
        this.getUserByClass()
        console.log(this.data.classNo)
      }
    }else if(e.detail.target.dataset.id==2){
      var classno=wx.getStorageSync('classNo')
      //console.log("classNo---"+classno)
      if(!wx.getStorageSync('classNo')){
        if(e.detail.value.classNo==""){
          wx.showToast({
            title: '请输入班级号～',
            icon:"none"
          })
        }else{
          this.setData({
            classNo:e.detail.value.classNo,
          })
          wx.setStorage({
            data: this.data.classNo,
            key: 'classNo',
          })
          request({url:"/teacher/getStuNum?sclass="+this.data.classNo})
          .then(result=>{
            this.setData({
              stuNumber:result.data.number
            })
            wx.setStorage({
              data: this.data.stuNumber,
              key: 'stuNumber',
            })
            wx.showToast({
              title: '发起人脸签到成功～',
              duration:1500,
              icon:"none"
          })
          setTimeout(function(){
            //点用人脸签到
            self.tapFaceSign()
            wx.navigateBack({
              delta: 0,
            })
          },1500)
            //console.log(this.data.stuNumber)
        //console.log(result)
      })
          //console.log(this.data.classNo)
        }
      }
      
    }else if(e.detail.target.dataset.id==3){
      //console.log("classNo---"+classno)
     
        if(e.detail.value.classNo==""){
          wx.showToast({
            title: '请输入班级号～',
            icon:"none"
          })
        }else{
          this.setData({
            classNo:e.detail.value.classNo,
          })

        request({url:"/teacher/findAclass?sclass="+this.data.classNo})
        .then(result=>{
            console.log(result)
            this.setData({
              stuRollCall:result.data.result
            })
            var index=this.randomNum(0,this.data.stuRollCall.length)
            console.log(this.data.stuRollCall[index].id)
            wx.navigateTo({
              url: '/pages/rollcall/rollcall?studentid='+this.data.stuRollCall[index].id
            })
        })
        
      }
    }
  },
  //随机数
  randomNum:function(minNum,maxNum){
    switch(arguments.length){
      case 1:
        return parseInt(Math.random()*minNum+1,10)
      break;
      case 2:return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)
      break;
        default:
          return 0;
        break;
    }
  },

  //通过教师输入的班级号进行签到
  getUserByClass:function(){
    request({url:"/teacher/findStudentByClass?sclass="+this.data.classNo+"&tnumber="+this.data.teacher.sno})
    .then(result=>{
      this.setData({
        studentList:result.data.result
      })
      wx.setStorage({
        data: this.data.studentList,
        key: 'studentList',
      })
      console.log(this.data.studentList)
      //console.log(result)
    })
    
  },
  
  //获取图片url
  getImageUrl:function(){
    this.setData({
      baseUrl:app.globalData.baseUrl+"/upload/"
    })
    //console.log(this.data.baseUrl)
  },

  //设置底部上滑菜单
  actionSheetTap:function(e){
    this.setData({
      actionSheetHidden:!this.data.actionSheetHidden,
      index:e.currentTarget.dataset.index
    })
    
    //console.log(this.data.index)
  },
  actionSheetbindchange:function(){
    this.setData({
      actionSheetHidden:!this.data.actionSheetHidden
    })
  },

  //各个按钮的功能  今天写到了全部学生签到时候默认已到 老师可以修改状态 下一步就是传递index和state去请求数据库
  bindMenu1:function(e){
    //console.log(e)
    const index=this.data.index-1
    var state=e.currentTarget.dataset.state
    var studentState="studentList["+index+"]"+".state"
    this.setData({
      [studentState]:state
    })
    this.actionSheetbindchange()
    //请求服务器修改学生状态
    request({url:"/teacher/updateLoginState?id="+index+"&state="+state})
    .then(result=>{
      //console.log(result)
      console.log(result)
    })
  },
  bindMenu2:function(e){
    //console.log(e)
    const index=this.data.index-1
    var state=e.currentTarget.dataset.state
    var studentState="studentList["+index+"]"+".state"
    this.setData({
      [studentState]:state
    })
    this.actionSheetbindchange()
    //请求服务器修改学生状态
    request({url:"/teacher/updateLoginState?id="+index+"&state="+state})
    .then(result=>{
      //console.log(result)
      console.log(result)
    })
  },
  bindMenu3:function(e){
    //console.log(e)
    const index=this.data.index-1
    var state=e.currentTarget.dataset.state
    var studentState="studentList["+index+"]"+".state"
    this.setData({
      [studentState]:state
    })
    this.actionSheetbindchange()
    //请求服务器修改学生状态
    request({url:"/teacher/updateLoginState?id="+index+"&state="+state})
    .then(result=>{
      //console.log(result)
      console.log(result)
    })
  },
  bindMenu4:function(e){
    //console.log(e)
    const index=this.data.index-1
    var state=e.currentTarget.dataset.state
    var studentState="studentList["+index+"]"+".state"
    this.setData({
      [studentState]:state
    })
    //console.log(this.data.studentList[index])
    this.actionSheetbindchange()
    //请求服务器修改学生状态
    request({url:"/teacher/updateLoginState?id="+index+"&state="+state})
    .then(result=>{
      //console.log(result)
      console.log(result)
    })
  },

  //教师点击提交按钮
  endSign:function(){
    request({url:"/teacher/endSign?sclass="+this.data.classNo})
    .then(result=>{
      this.setData({
        studentList:result.data.notArriveList
      })
      wx.setStorage({
        data: this.data.studentList,
        key: 'ResultStudentList',
      }),
      wx.removeStorage({
        key: 'classNo',
      }),
      console.log(this.data.studentList)
        wx.showToast({
          title: '签到成功～',
          duration:1500
      })
      setTimeout(function(){
        console.log(result)
        wx.removeStorage({
          key: 'studentList',
        })
        wx.navigateBack({
          delta: 0,
        })
      },1500)
    })
  },

  //教师点击结束人脸签到按钮
  endFaceSign:function(e){
    console.log("结束人脸签到")
    request({url:"/teacher/endFaceSign?tnumber="+this.data.teacher.sno+"&sclass="+this.data.classNo})
    .then(result=>{
      console.log(result)
      wx.removeStorage({
        key: 'classNo',
      }),
      wx.removeStorage({
        key: 'stuNumber',
      }),
      wx.removeStorage({
        key: 'classNo',
      }),
      wx.showToast({
        title: '已结束人脸签到',
      }),
      wx.setStorage({
        data: result.data.ResultList,
        key: 'ResultStudentList',
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 0,
        })
      },1500)
    })
  },

  //教师点击使用人脸签到
  tapFaceSign:function(){
    request({url:"/teacher/startFaceSign?tnumber="+this.data.teacher.sno+"&longitude="+this.data.longitude+"&latitude="+this.data.latitude+"&stunum="+this.data.stuNumber+"&sclass="+this.data.classNo})
    .then(result=>{
      //人脸签到请求成功后给学生发送信息
      this.sendMess2stu()
      console.log(result)
    })
  },
  //点击人脸签到同时发送消息
  sendMess2stu:function(){
    //this.getFormatDate
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+this.data.access_token,
      method:"POST",
      data:{
        "touser": "oOAaf4pAwWq5XwPB-qX7wA4tN_Ls",
        "template_id": "HT7x8BAPBAeeTPO978FT9aD3qGaMxzguCzcMMTup3Es",
        "miniprogram_state":"developer",
        "lang":"zh_CN",
        "data": {
            "thing1": {
                "value": "你有一条签到信息"
            },
            "time8":{
                "value":this.getFormatDate()
            }
        }
      },
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  },

  //获得当前时间
  getFormatDate:function() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + "-" + month + "-" + strDate
            + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return currentDate;
},

  //页面加载时获得学生人数
  getStuNum:function(){
    this.setData({
      stuNumber:wx.getStorageSync('stuNumber')
    })
    //console.log("stuNumber---"+wx.getStorageSync('stuNumber'))
  },
  
})