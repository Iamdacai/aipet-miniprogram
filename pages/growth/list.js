const { growthRecords, pets } = require('../../../utils/api');
const util = require('../../../utils/util');

Page({
  data: { pets: [], petIndex: -1, records: [] },
  onLoad() { this.loadPets(); },
  onPullDownRefresh() { this.loadRecords().then(() => wx.stopPullDownRefresh()); },
  async loadPets() {
    const app = getApp();
    const res = await pets.getList(app.globalData.userId);
    if (res.success && res.data?.length) {
      this.setData({ pets: res.data, petIndex: 0 }, () => this.loadRecords());
    }
  },
  async loadRecords() {
    const { pets, petIndex } = this.data;
    if (petIndex < 0 || !pets[petIndex]) return;
    try {
      const res = await growthRecords.getList(pets[petIndex].id);
      if (res.success) {
        const records = (res.data || []).map(r => ({
          ...r,
          date: util.formatDateTime(new Date(r.createdAt))
        }));
        this.setData({ records });
      }
    } catch (err) { console.error(err); }
  },
  onPetChange(e) {
    this.setData({ petIndex: e.detail.value }, () => this.loadRecords());
  },
  goToAdd() { wx.navigateTo({ url: '/pages/growth/edit' }); }
});
