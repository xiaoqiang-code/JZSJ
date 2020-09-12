// pages/list/list.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemTitle: '筛选',
    value1: '全部',
    windowHeight:'',
    windowHeight1:'',
    windowHeight2:'',
    type:'全部',
    result: [],
    list:[],
    option1: [
      { text: '全部', value: '全部' },
      { text: '电器', value: '电器' },
      { text: '家具', value: '家具' },
      { text: '家居', value: '家居' },
      { text: '卫浴', value: '卫浴' },
      { text: '灯具', value: '灯具' },
      { text: '地板/瓷砖', value: '地板/瓷砖' },
      { text: '开关/插座', value: '开关/插座' },
      { text: '其他', value: '其他' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var height=0
    try {
      const res = wx.getSystemInfoSync()
      
      height=res.windowHeight
    } catch (e) {
      // Do something when catch error
    }
    that.setData({
      windowHeight:height,
      windowHeight1:parseInt(height)*0.08,
      windowHeight2:height*0.8
    })

    //获取数据库连接
    const testDB = wx.cloud.database({
      env: 'cloudtest1-v6j4t'
    })
    //通过当前用户openid查询数据库
    testDB.collection('purchaserecord').where({
      user: app.globalData.openid,
    }).orderBy('date','desc')
    .get({
      success: function(res) {
        if(res.data.length!=0){
          that.setData({
            list:res.data,
          })
        }
        wx.hideLoading({});
      }
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
  //筛选确认
  onConfirm() {
    var that=this
    this.selectComponent('#item').toggle();
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    const testDB = wx.cloud.database({
      env: 'cloudtest1-v6j4t'
    })
    const _ = testDB.command
    //通过当前用户openid查询数据库
    if(that.data.type=='全部'){
      testDB.collection('purchaserecord').where({
        user: app.globalData.openid,
        location:_.in(that.data.result)
      }).orderBy('date','desc')
      .get({
        success: function(res) {
            that.setData({
              list:res.data,
            })
            wx.hideLoading({});
        }
      })
    }else{
      testDB.collection('purchaserecord').where({
        user: app.globalData.openid,
        type: that.data.type,
        location:_.in(that.data.result)
      }).orderBy('date','desc')
      .get({
        success: function(res) {
            that.setData({
              list:res.data,
            })
            wx.hideLoading({});
        }
      })
    }
  },
  //筛选
  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },
  //分类
  select(e){
    var that=this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    that.setData({
      type:e.detail
    })
    //获取数据库连接
    const testDB = wx.cloud.database({
      env: 'cloudtest1-v6j4t'
    })
    const _ = testDB.command
    //通过当前用户openid查询数据库
    if(e.detail=='全部'){
      if(that.data.result.length==0){
        testDB.collection('purchaserecord').where({
          user: app.globalData.openid,
        }).orderBy('date','desc')
        .get({
          success: function(res) {
              that.setData({
                list:res.data,
              })
              wx.hideLoading({});
          }
        })
      }else{
        testDB.collection('purchaserecord').where({
          user: app.globalData.openid,
          location:_.in(that.data.result)
        }).orderBy('date','desc')
        .get({
          success: function(res) {
              that.setData({
                list:res.data,
              })
              wx.hideLoading({});
          }
        })
      }
    }else{
      if(that.data.result.length==0){
        testDB.collection('purchaserecord').where({
          user: app.globalData.openid,
          type: e.detail
        }).orderBy('date','desc')
        .get({
          success: function(res) {
              that.setData({
                list:res.data,
              })
              wx.hideLoading({});
          }
        })
      }else{
        testDB.collection('purchaserecord').where({
          user: app.globalData.openid,
          type: e.detail,
          location:_.in(that.data.result)
        }).orderBy('date','desc')
        .get({
          success: function(res) {
              that.setData({
                list:res.data,
              })
              wx.hideLoading({});
          }
        })
      }
    }
  },
  //选择图片
  afterRead(event) {
    const { file, name } = event.detail;
    const fileList = this.data[`fileList`];
    this.setData({ [`fileList`]: fileList.concat(file) });
  },
  update(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var price = e.currentTarget.dataset.price;
    var number = e.currentTarget.dataset.number;
    var location = e.currentTarget.dataset.location;
    var remark = e.currentTarget.dataset.remark;
    var imglist = e.currentTarget.dataset.imglist;
    var imgliststr=JSON.stringify(imglist);
    wx.reLaunch({
      url: '../update/update?id='+id+'&name='+name+'&price='+price+'&number='+number+'&location='+location+'&remark='+remark+'&imglist='+imgliststr
    })
  }
})