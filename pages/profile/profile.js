/**
 * 个人中心页面
 */

const util = require('../../../utils/util');

Page({
  data: {
    userInfo: null
  },

  onShow() {
    this.loadUserInfo();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    
    if (!userInfo) {
      // 未登录，跳转到登录页
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
    
    this.setData({ userInfo });
  },

  /**
   * 跳转页面
   */
  goToPage(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },

  /**
   * 关于我们
   */
  showAbout() {
    wx.showModal({
      title: '关于 Ai 宠',
      content: 'Ai 宠是一款专业的宠物健康管理工具，帮助您更好地照顾毛孩子。\n\n版本：v0.1.0\n开发团队：Ai 宠团队',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 意见反馈
   */
  showFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有任何问题或建议，请联系客服微信：aipet-service',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  /**
   * 退出登录
   */
  async logout() {
    const confirmed = await util.showConfirm('确定要退出登录吗？', '确认退出');
    
    if (!confirmed) return;

    const app = getApp();
    app.clearUserInfo();
    
    util.showSuccess('已退出登录');
    
    setTimeout(() => {
      wx.reLaunch({ url: '/pages/login/login' });
    }, 500);
  }
});
