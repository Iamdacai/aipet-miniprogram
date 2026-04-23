/**
 * 宠物列表页面
 */

const { pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    pets: [],
    loading: true
  },

  onLoad() {
    this.loadPets();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadPets();
  },

  /**
   * 加载宠物列表
   */
  async loadPets() {
    const app = getApp();
    const userId = app.globalData.userId;

    if (!userId) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }

    try {
      this.setData({ loading: true });
      
      const res = await pets.getList(userId);
      
      if (res.success) {
        this.setData({
          pets: res.data || [],
          loading: false
        });
      } else {
        util.showError(res.message || '加载失败');
        this.setData({ loading: false });
      }
    } catch (err) {
      console.error('加载宠物列表失败', err);
      util.showError('加载失败，请稍后重试');
      this.setData({ loading: false });
    }
  },

  /**
   * 跳转详情
   */
  goToDetail(e) {
    const { petId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/pets/detail?id=${petId}`
    });
  },

  /**
   * 添加宠物
   */
  goToAdd() {
    wx.navigateTo({
      url: '/pages/pets/edit'
    });
  }
});
