//同时发送的异步代码的次数
let ajaxTimes=0
const app=getApp()
export const request=(params)=>{
    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
      

    //定义公共的URL
    const baseUrl=app.globalData.baseUrl
    return new Promise((resolve,reject)=>{
        var reqTask = wx.request({
            ...params,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err)
            },
            //关闭加载中框框
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                    wx.hideLoading();
                }
                
                  
            }
        });
          
    })
}