// pages/home/home.js
Page({
  handleJump:function(event){
    //console.log(event);
    var id=event.target.dataset.id;
    var title=event.target.dataset.title;
      wx.navigateTo({
        url: '/pages/product/product?title='+title
      })
  },
  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    navitems:[],
    wbClassList:[]
  },
  getWbClass:function(){
    wx.request({
      url: 'http://176.51.1.241:3000/wbClass',
      success:res=>{
        //console.log(res);
        this.setData({wbClassList:res.data});
        //console.log(this.data.wbClassList);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'http://176.51.1.241:3000/imagelist',
      success:res=>{
        this.setData({imageList:res.data})
      }
    });
    wx.request({
      url: 'http://176.51.1.241:3000/smallImagelist',
      success:res=>{
        //console.log(res);
        this.setData({navitems:res.data});
      }
    });
    this.getWbClass();
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

  }
})