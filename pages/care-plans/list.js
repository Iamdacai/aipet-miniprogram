const { carePlans, pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: { plans: [], petMap: {} },
  onLoad() { this.loadPlans(); this.loadPets(); },
  async loadPets() {
    const app = getApp();
    const res = await pets.getList(app.globalData.userId);
    if (res.success) {
      const petMap = {};
      res.data.forEach(p => petMap[p.id] = p.name);
      this.setData({ petMap });
    }
  },
  async loadPlans() {
    try {
      const res = await carePlans.getList();
      if (res.success) {
        const plans = (res.data || []).map(p => ({
          ...p,
          startDate: util.formatDate(new Date(p.startDate)),
          endDate: util.formatDate(new Date(p.endDate)),
          petName: this.data.petMap[p.petId] || ''
        }));
        this.setData({ plans });
      }
    } catch (err) { console.error(err); }
  },
  goToDetail(e) {
    const { planId } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/care-plans/detail?id=${planId}` });
  }
});
