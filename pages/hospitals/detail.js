const { hospitals } = require('../../../utils/api');
Page({
  data: { hospital: null },
  onLoad(options) { if (options.id) this.loadHospital(options.id); },
  async loadHospital(hospitalId) {
    try {
      const res = await hospitals.getDetail(hospitalId);
      if (res.success && res.data) this.setData({ hospital: res.data });
    } catch (err) { console.error(err); }
  },
  callPhone() {
    const { phone } = this.data.hospital;
    if (phone) wx.makePhoneCall({ phoneNumber: phone });
  },
  navigateTo() {
    const { address, latitude, longitude } = this.data.hospital;
    if (latitude && longitude) {
      wx.openLocation({ latitude, longitude, name: this.data.hospital.name, address });
    } else {
      wx.showToast({ title: '暂无位置信息', icon: 'none' });
    }
  }
});
