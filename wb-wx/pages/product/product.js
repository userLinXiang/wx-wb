// pages/product/product.js
Page({
  // 商品搜索
  search:function(pno=0){
    var kw=this.data.title;
    //var pno=this.data.pno;
    //console.log(kw);
    wx.request({
      url: 'http://176.51.1.241:3000/getProduct',
      data:{kw:kw,pno:pno},
      success:res=>{
        //console.log(res);
        this.setData({productList:res.data.data});
        this.setData({pageCount:res.data.pageCount});
      }
    })
  },
  // 下一页点击事件
  nextClick:function(){
    var pno=this.data.pno;
    var pageCount=this.data.pageCount;
    if(pno<pageCount-1){
      pno++;
      this.setData({pno:pno})
      this.search(pno);
    }else{
      wx.showToast({
        title: '没有更多商品了',
        icon:"none"
      })
    }
  },
  // 上一页点击事件
  prevClick:function(){
    var pno = this.data.pno;
    var pageCount = this.data.pageCount;
    pno--;
    if (pno < pageCount - 1&&pno>=0) {
      
      this.setData({ pno: pno })
      this.search(pno);
    } else {
      wx.showToast({
        title: '没有更多商品了',
        icon: "none"
      })
    }
  },
  // input输入绑定事件
  getInput:function(e){
    //console.log(e)
    var val=e.detail.value;
    this.setData({title:val});
    this.search();
  },
  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    productList:[],
    pno:0,
    pageCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    if(options.title!=undefined){
      this.setData({ title: options.title });
    }
    this.search();
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