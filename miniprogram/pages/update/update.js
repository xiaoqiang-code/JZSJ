// pages/update/update.js
var util = require('../../util/util.js');
var app = getApp();
import Notify from '../../dist/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name:'',
    price:'',
    number:'',
    location:'',
    remark:'',
    type:'',
    windowHeight:'',
    show: false,
    imglist:[],
    newimglist:[],
    imgarray: [],
    aaa:[{'url':'https://636c-cloudtest1-v6j4t-1302867650.tcb.qcloud.la/owKoG5kd_BUFVFql6s9OZDgrL5dI/2020-08-3112599331099.jpg'},{'url':'https://636c-cloudtest1-v6j4t-1302867650.tcb.qcloud.la/owKoG5kd_BUFVFql6s9OZDgrL5dI/2020-08-3114398679368.jpg'}],
    actions: [
      {
        name: '客厅',
        color:'#03BCD4'
      },
      {
        name: '主卧',
        color:'#03BCD4'
      },
      {
        name: '次卧',
        color:'#03BCD4'
      },
      {
        name: '卫生间',
        color:'#03BCD4'
      },
      {
        name: '厨房',
        color:'#03BCD4'
      },
      {
        name: '餐厅',
        color:'#03BCD4'
      },
      {
        name: '阳台',
        color:'#03BCD4'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var imglist2=[]
    var height=0
    try {
      const res = wx.getSystemInfoSync()
      height=res.windowHeight
    } catch (e) {
    }
    for(var i=0;i<JSON.parse(options.imglist).length;i++){
      imglist2.push({'url':JSON.parse(options.imglist)[i].url,"deletable": true})
    }
    that.setData({
      windowHeight:height,
      id: options.id,
      name: options.name,
      price: options.price,
      number: options.number,
      location: options.location,
      remark: options.remark,
      newimglist:imglist2,
    });
  },
  toggle(type) {
    this.setData({
      [type]: !this.data[type]
    });
  },
  selectlocation() {
    this.toggle('show');
  },

  onSelect:function(e){
    var that=this
    that.setData({
      location:e.detail.name
    })
  },
  close:function(){
    this.setData({
      show:false
    });
  },

  //选择图片
  afterRead(event) {
    const { file} = event.detail;
    const fileList = this.data[`newimglist`];
    this.setData({ [`newimglist`]: fileList.concat(file) });
  },
  //删除图片
  delete(event) {
    const { index} = event.detail;
    const fileList = this.data[`newimglist`];
    fileList.splice(index, 1);
    this.setData({ [`newimglist`]: fileList });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  name:function(e){
    var that=this
    that.setData({
      name:e.detail
    })
  },
  price:function(e){
    var that=this
    that.setData({
      price:e.detail
    })
  },
  numChange:function(e){
    var that=this
    that.setData({
      number:e.detail
    })
  },
  remark:function(e){
    var that=this
    that.setData({
      remark:e.detail
    })
  },
  save_update:function(){
    var that=this
    if(that.data.name==''||that.data.name==null){
      Notify({
        message: '请输入名称',
        color: '#FFFFFF',
        background: '#03BCD4',
        duration: 1500,
      });
      return;
    }
    if(that.data.price==''||that.data.price==null){
      Notify({
        message: '请输入价格',
        color: '#FFFFFF',
        background: '#03BCD4',
        duration: 1500,
      });
      return;
    }
    wx.showLoading({
      title: '保存中',
      mask:true
    })
    var imglist=that.data.newimglist
    //获取数据库连接
    const testDB = wx.cloud.database({
      env: 'cloudtest1-v6j4t'
    })
    if(imglist.length==0){
      testDB.collection('purchaserecord').doc(that.data.id).update({
        data: {
          name:that.data.name,
          price:that.data.price,
          number:that.data.number,
          location:that.data.location,
          remark:that.data.remark,
          images:0
        },
        success: function(res) {
          wx.hideLoading({
            complete: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000,
                complete: () => {
                  setTimeout(function () {
                    wx.hideToast()
                  }, 2000)
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../list/list',
                    })
                  }, 800)
                }
              })
            }
          });
        },
        fail: console.error,
        complete: console.log
      })
    }else{
      var imgarr2=[]
      var imgarr3=[]
      var flag=0
      for(var i=0;i<imglist.length;i++){
        if(imglist[i].url==undefined){
          flag=true
          imgarr2.push({path:imglist[i].path})
        }else{
          flag=false
          imgarr3.push({'url':imglist[i].url,"deletable": false})
        }
      }
      
      if(flag){
        for(var j=0;j<imgarr2.length;j++){
          var filePath = imgarr2[j].path
          var k = Math.random()
          var o = Math.random()
          var a = (k * 10000000000+o*10000000000).toFixed(0)
          const cloudPath =app.globalData.openid+"/"+util.formatDate(new Date())+a+'.jpg'
          //上传图片（存储）
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
          success: res => {
            imgarr3.push({ 'url': res.fileID,"deletable": false })
            if(imgarr3.length==imglist.length){
              testDB.collection('purchaserecord').doc(that.data.id).update({
                data: {
                  name:that.data.name,
                  price:that.data.price,
                  number:that.data.number,
                  location:that.data.location,
                  remark:that.data.remark,
                  images:imgarr3
                },
                success: function(res) {
                  wx.hideLoading({
                    complete: () => {
                      wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 1000,
                        complete: () => {
                          setTimeout(function () {
                            wx.hideToast()
                          }, 2000)
                          setTimeout(function () {
                            wx.navigateTo({
                              url: '../list/list',
                            })
                          }, 800)
                        }
                      })
                    }
                  });
                },
                fail: console.error,
                complete: console.log
              })
            }
          },
          })
        }
      }else{
        testDB.collection('purchaserecord').doc(that.data.id).update({
          data: {
            name:that.data.name,
            price:that.data.price,
            number:that.data.number,
            location:that.data.location,
            remark:that.data.remark,
            images:imgarr3
          },
          success: function(res) {
            wx.hideLoading({
              complete: () => {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 1000,
                  complete: () => {
                    setTimeout(function () {
                      wx.hideToast()
                    }, 2000)
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '../list/list',
                      })
                    }, 800)
                  }
                })
              }
            });
          },
          fail: console.error,
          complete: console.log
        })
      }
    }
  }
})