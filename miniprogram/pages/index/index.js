//index.js
var app = getApp()
import Notify from '../../dist/notify/notify';
Page({
  data: {
    avatarUrl: '../../images/nologin.jpg',
    nickName:'',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    windowHeight:'',
    userlength:0,
    show: true,
    showmoney: false,
    money:0,
    moneydata:''
  },
  onLoad: function() {
    var that=this
    var height=0
    try {
      const res = wx.getSystemInfoSync()
      height=res.windowHeight
    } catch (e) {
      // Do something when catch error
    }
    that.setData({
      windowHeight:height
    })
    wx.getSetting({
      success: res => {
        //用户已经授权
        if (res.authSetting['scope.userInfo']) {
          //获取登录用户openid
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              app.globalData.openid = res.result.openid
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
              wx.navigateTo({
                url: '../deployFunctions/deployFunctions',
              })
            }
          })
          //获取数据库连接
          const testDB = wx.cloud.database({
            env: 'cloudtest1-v6j4t'
          })
          //通过当前用户openid查询数据库
          testDB.collection('userinfo').where({
            _openid: app.globalData.openid,
          })
          .get({
            success: function(res) {
              app.globalData.userid = res.data[0]._id
              if(res.data.length!=0){
                that.setData({
                  avatarUrl:res.data[0].avatarUrl,
                  nickName:res.data[0].nickName,
                  money:res.data[0].money
                })
              }
            }
          })
        }
      }
    })
  },
  //获取登录用户信息
  onGetOpenid: function(e) {
    var that=this
    wx.getSetting({
      success: res => {
        //用户已经授权
        if (res.authSetting['scope.userInfo']) {
          if (e.detail.userInfo) {
            var userInfo=e.detail.userInfo;
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            var province = userInfo.province
            var city = userInfo.city
            var country = userInfo.country
          }
          //获取登录用户openid
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              app.globalData.openid = res.result.openid
              //获取数据库连接
              const testDB = wx.cloud.database({
                env: 'cloudtest1-v6j4t'
              })
              //通过当前用户openid查询数据库
              testDB.collection('userinfo').where({
                _openid: app.globalData.openid,
              })
              .get({
                success: function(res) {
                  that.setData({
                    userlength:res.data.length
                  })
                  //数据库没有当前用户信息--将用户信息插入到数据库
                  if(that.data.userlength==0){
                    testDB.collection('userinfo').add({
                      data: {
                        city: city,
                        country: country,
                        province: province,
                        avatarUrl: avatarUrl,
                        nickName: nickName,
                        gender: gender,
                        money:0
                      },
                      success: function(res) {
                        app.globalData.userid = res._id
                      },
                      fail: console.error,
                      complete: console.log
                    })
                    that.setData({
                      money:0
                    })
                  }else{
                    app.globalData.userid = res.data[0]._id
                    that.setData({
                      money:res.data[0].money
                    })
                  }
                  that.setData({
                    avatarUrl:avatarUrl,
                    nickName:nickName
                  })
      
                }
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
              wx.navigateTo({
                url: '../deployFunctions/deployFunctions',
              })
            }
          })
        }
      }
    })
  },
  onClose() {
    this.setData({ close: false });
  },
  onClose2() {
    this.setData({ showmoney: false, moneydata: ''});
  },
  showCustomDialog() {
    this.setData({ showmoney: true });
  },
  suremoney:function(){
    var that=this
    if(that.data.moneydata==''||that.data.moneydata==null){
      that.setData({ showmoney: true });
      that.moneytip();
    }else{
      wx.showLoading({
        title: '修改中',
      })
      //获取数据库连接
      const testDB = wx.cloud.database({
        env: 'cloudtest1-v6j4t'
      })
      testDB.collection('userinfo').doc(app.globalData.userid).update({
        data: {
          money:parseInt(that.data.moneydata)
        },
        success: function(res) {
          console.log(8888888888)
          wx.hideLoading({
            complete: () => {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000,
                complete: () => {
                  setTimeout(function () {
                    wx.hideToast()
                  }, 2000)
                  setTimeout(function () {
                    that.setData({
                      money:parseInt(that.data.moneydata)
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






      console.log(this.data.moneydata)
    }
    
  },
  moneyChange:function(e){
    this.setData({ moneydata: e.detail });
    console.log(e.detail);
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //未登录提示
  tip:function(){
    Notify({
      message: '请先登录',
      color: '#fff',
      background: '#03BCD4',
      duration: 1500,
    });
  },
  moneytip:function(){
    Notify({
      message: '请输入钱数',
      color: '#fff',
      background: '#03BCD4',
      duration: 1500,
    });
  },
  //分类记录
  appliance:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=电器'
      })
    }
    
  },
  furniture:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=家具'
      })
    }
  },
  household:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=家居'
      })
    }
  },
  bathroom:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=卫浴'
      })
    }
  },
  wallpaper:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=壁纸'
      })
    }
  },
  floor:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=地板/瓷砖'
      })
    }
  },
  switch:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=开关'
      })
    }
  },
  other:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../field/field?type=其他'
      })
    }
  },
  //物品清单
  list:function(){
    var that=this
    if(that.data.nickName==''){
      that.tip();
    }else{
      wx.navigateTo({
        url: '../list/list'
      })
    }
  },
  //圈子
  factionalism:function(){
    // wx.navigateTo({
    //   url: '../factionalism/factionalism'
    // })
    wx.showToast({
      title: '开发中，敬请期待！',
      icon: 'none',
      duration: 2000
    })
  
  }
})
