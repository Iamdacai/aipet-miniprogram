/**
 * 宠物详情页面
 */

const { pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: {
    petId: null,
    pet: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ petId: id });
      this.loadPetDetail(id);
    } else {
      util.showError('宠物 ID 缺失');
      wx.navigateBack();
    }
  },

  /**
   * 加载宠物详情
   */
  async loadPetDetail(petId) {
    try {
      this.setData({ loading: true });
      
      const res = await pets.getDetail(petId);
      
      if (res.success && res.data) {
        this.setData({
          pet: res.data,
          loading: false
        });
        
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: res.data.name || '宠物详情'
        });
      } else {
        util.showError(res.message || '加载失败');
        this.setData({ loading: false });
      }
    } catch (err) {
      console.error('加载宠物详情失败', err);
      util.showError('加载失败，请稍后重试');
      this.setData({ loading: false });
    }
  },

  /**
   * 编辑宠物
   */
  goToEdit() {
    const { petId } = this.data;
    wx.navigateTo({
      url: `/pages/pets/edit?id=${petId}`
    });
  },

  /**
   * 删除宠物
   */
  async deletePet() {
    const confirmed = await util.showConfirm('确定要删除这只宠物吗？删除后无法恢复。', '确认删除');
    
    if (!confirmed) return;

    const { petId } = this.data;

    try {
      util.showLoading('删除中...');
      
      const res = await pets.delete(petId);
      
      if (res.success) {
        util.showSuccess('删除成功');
        setTimeout(() => {
          wx.navigateBack();
        }, 500);
      } else {
        util.showError(res.message || '删除失败');
      }
    } catch (err) {
      console.error('删除宠物失败', err);
      util.showError('删除失败，请稍后重试');
    } finally {
      util.hideLoading();
    }
  }
});
