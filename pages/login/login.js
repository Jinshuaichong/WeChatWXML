//index.js
import {request}from "../../request/index.js"
//获取应用实例
const app = getApp()

Page({
  data: {
    user:[],
    code:null,
    account:null,
    password:null,
    token:null
  },
  onLoad:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['HT7x8BAPBAeeTPO978FT9aD3qGaMxzguCzcMMTup3Es','omDT1WbyrkU43YG41Vt_2X8B2oEmaHqYr_U5tXbqMLg'],
    })
    //加载时判定缓存中有无token 有的话直接登录 没有的话请求
    let that=this
    wx.getStorage({
      key: 'token',
      success:res=>{
        
        // console.log(res)
        that.setData({
          token:res.data
        })
        wx.switchTab({
          url: '/pages/mine/mine',
        })
        // console.log(that.data.user)
      },
      fail:res=>{
        this.getCode()
      },
    })
    
    
  },
  
  getCode:async function(e){
    let that=this
    //获取code
    wx.login({
      timeout: 2000,
      success:res=>{
        that.setData({
          code:res.code
        })
        //console.log(that.data.code)
      }
    })
  },
  getProfile:function(e){
    console.log(e)
    let that=this
    this.setData({
      account:e.detail.value.account,
      password:e.detail.value.password
    })
    //没有填写信息时对应的提示
    if(this.data.account===""&&this.data.password===""){
      wx.showToast({
        title: '请填写信息',
        icon:'none',
        duration:1500,
        mask:true
      })
    }else if(this.data.account===""){
      wx.showToast({
        title: '请输入学工号/学号',
        icon:'none',
        duration:1500,
        mask:true
      })
    }else if(this.data.password===""){
      wx.showToast({
        title: '请输入密码',
        icon:'none',
        duration:1500,
        mask:true
      })
    }else{
      let self=this
      wx.requestSubscribeMessage({
        
        tmplIds: ['HT7x8BAPBAeeTPO978FT9aD3qGaMxzguCzcMMTup3Es','omDT1WbyrkU43YG41Vt_2X8B2oEmaHqYr_U5tXbqMLg'],
        success(res) {
          console.log(res)
          wx.request({
            url: app.globalData.baseUrl+'/login/getOpenid?code='+self.data.code+"&account="+self.data.account+"&password="+self.data.password,
            method:"POST",
            header:{
              'content-type':'application/x-www-form-urlencoded;charset=utf-8'
            },
            success:res=>{
              console.log(res)
              //将token存入缓存
              if(res.data.login_state==1){
                wx.showToast({
                  title: '登陆成功',
                  timeout:1500,
                })
                wx.setStorage({
                  data: res.data.token,
                  key: 'token',
                }),
                wx.setStorage({
                  data: res.data.user,
                  key: 'user',
                }),
                wx.switchTab({
                  url: '/pages/mine/mine',
                })
              }
            },
            fail:res=>{
              wx.showToast({
                title: '登陆失败',
                icon:'none',
                duration:1500,
                mask:true
              })
            }
          })
        },
        fail(err) { console.log(err)}
      })
      
    }
  }
})
