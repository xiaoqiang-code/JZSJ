// pages/field/field.js
var util = require('../../util/util.js');
var app = getApp();
import Notify from '../../dist/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    price:'',
    money:0,
    number:1,
    location:'',
    remark:'',
    type:'',
    windowHeight:'',
    show: false,
    fileList: [],
    imgarray: [],
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
    var height=0
    try {
      const res = wx.getSystemInfoSync()
      height=res.windowHeight
    } catch (e) {
      // Do something when catch error
    }
    that.setData({
      type:options.type,
      windowHeight:height
    })
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
    console.log(5555)
    this.setData({
      show:false
    });
  },
  name:function(e){
    var that=this
    that.setData({
      name:e.detail
    })
    console.log(that.data.name)
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
    console.log(that.data.number)
  },
  remark:function(e){
    var that=this
    that.setData({
      remark:e.detail
    })
  },
  //选择图片
  afterRead(event) {
    const { file, name } = event.detail;
    const fileList = this.data[`fileList`];
    this.setData({ [`fileList`]: fileList.concat(file) });
  },
  //删除图片
  delete(event) {
    const { index, name } = event.detail;
    const fileList = this.data[`fileList`];
    fileList.splice(index, 1);
    this.setData({ [`fileList`]: fileList });
  },
  //保存数据
  save:function(){
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
    
    var imglist=that.data.fileList
    //获取数据库连接
    const testDB = wx.cloud.database({
      env: 'cloudtest1-v6j4t'
    })
    if(imglist.length==0){
      //通过当前用户openid查询数据库
      testDB.collection('userinfo').where({
        _openid: app.globalData.openid,
      })
      .get({
        success: function(res) {

          if(res.data.length!=0){
            testDB.collection('userinfo').doc(app.globalData.userid).update({
              data: {
                money:parseInt(res.data[0].money)+parseInt(that.data.price)*that.data.number
              },
              success: function(res) {
                
              }
            })
          }
        }
      })
      
      
      testDB.collection('purchaserecord').add({
        data: {
          user: app.globalData.openid,
          name:that.data.name,
          type: that.data.type,
          date: util.formatTime(new Date()),
          location: that.data.location,
          price: that.data.price,
          number: that.data.number,
          remark: that.data.remark,
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
                      url: '../index/index',
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
      //通过当前用户openid查询数据库
      testDB.collection('userinfo').where({
        _openid: app.globalData.openid,
      })
      .get({
        success: function(res) {
          if(res.data.length!=0){
            testDB.collection('userinfo').doc(app.globalData.userid).update({
              data: {
                money:parseInt(res.data[0].money)+parseInt(that.data.price)*that.data.number
              },
              success: function(res) {
                
              }
            })
          }
        }
      })
      
      var imgarr=[]
      for(var i=0;i<imglist.length;i++){
        const filePath = imglist[i].path
        var k = Math.random()
        var j = Math.random()
        var a = (k * 10000000000+j*10000000000).toFixed(0)
        const cloudPath =app.globalData.openid+"/"+util.formatDate(new Date())+a+'.jpg'
        //上传图片（存储）
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            imgarr.push({ 'url': res.fileID,"deletable": false })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
          },
          complete: () => {
            that.setData({
              imgarray:imgarr
            })
            //上传图片（数据库） 如果返回的集合长度等于选择图片的集合长度就把数据存到数据库
            if(that.data.imgarray.length==imglist.length){
              testDB.collection('purchaserecord').add({
                data: {
                  user: app.globalData.openid,
                  name:that.data.name,
                  type: that.data.type,
                  date: util.formatTime(new Date()),
                  location: that.data.location,
                  price: that.data.price,
                  number: that.data.number,
                  remark: that.data.remark,
                  images:that.data.imgarray
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
                              url: '../index/index',
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
        })
      }
    }
  }
})