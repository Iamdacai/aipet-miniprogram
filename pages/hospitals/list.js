const { hospitals } = require('../../../utils/api');
Page({
  data: { hospitals: [] },
  onLoad() { this.loadHospitals(); },
  async loadHospitals() {
    try {
      const res = await hospitals.getList();
      if (res.success) this.setData({ hospitals: res.data || [] });
    } catch (err) { console.error(err); }
  },
  goToDetail(e) {
    const { hospitalId } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/hospitals/detail?id=${hospitalId}` });
  }
});
